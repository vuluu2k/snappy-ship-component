import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import dayjs from 'dayjs';
// @ts-ignore
import CallDetectorManager from 'react-native-call-detection';
// @ts-ignore
import { isEmpty } from 'lodash';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
import { connect } from 'react-redux';

import { makePhoneCall } from '@utils/services';
import { decodeToken } from '@utils';
import { API_URL } from '@sny_configs/environment';
import commonStyles from '@styles/common.style';
import { Notification } from '@components/SnyNotification';
import { sendLogs } from '@utils/logs';
import { updateQueueRequest } from '@store/actions/v1/network';
import { updateNewLogFlag } from '@store/actions/v1/miss_log';
import { addLogs } from '@utils/database';
import { checkManageCallState } from '@utils/permissions';
import IconSnappy from '@components/IconSnappy';
import ActionSheet from './ActionSheet';
import Colors from './Colors';

type IProps = {
  trackingId?: any;
  accessToken?: any;
  receiverCallName?: any;
  onCalled?: any;
  updateQueueRequest?: any;
  businessAddressId?: any;
  typeCall?: any;
  updateNewLogFlag?: any;
  phoneNumber: any;
  listPhoneNumbers?: any;
  updateSelectedTracking?: any;
  style?: any;
  icon?: any;
  themeDefault?: boolean;
  textExtraPhone?: string;
  textMainPhone?: string;
  latestViewId?: string;
  subText?: { style?: any; text: string };
  children?: any;
};

type IState = {
  startCallAt: any;
  endCallAt: any;
  isCalling: boolean;
};

class PhoneCall extends React.Component<IProps, IState> {
  mounted: boolean | undefined;
  callDetector: any;
  showMoreCall: any;

  constructor(props: IProps) {
    super(props);
    this.state = { startCallAt: null, endCallAt: null, isCalling: false };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.callDetector) {
      this.callDetector?.dispose();
      this.callDetector = null;
    }
  }

  onShowMoreCall = () => {
    this.showMoreCall?.show();
  };

  makeCall = async (phoneNumber: any) => {
    const isAllowMamangeCall = await checkManageCallState();

    if (!isAllowMamangeCall) return Notification.error('Bạn không cho phép ứng dụng gọi điên. Vui lòng cho phép trong cài đặt');
    try {
      this.startWatchingCall(phoneNumber);
    } catch (error) {
      console.log(error);
    }
  };

  startWatchingCall = async (phoneNumber: number | string | undefined) => {
    if (this.callDetector) {
      await this.callDetector?.dispose();
      this.callDetector = null;
    }

    this.callDetector = new CallDetectorManager(
      (event: any, _phoneNumber: any) => {
        // For iOS: "Connected", "Disconnected", "Dialing", "Incoming"
        // For Android: "Offhook", "Disconnected", "Incoming", "Missed"

        if (event === 'Disconnected') {
          console.log('on_disconected__');
          // Do something call got disconnected
          if (this.state.isCalling) this.setState({ isCalling: false }, () => this.processEndCall(phoneNumber));
        } else if (event === 'Connected') {
          // Do something call got connected
          // This clause will only be executed for iOS
        } else if (event === 'Incoming') {
          // Do something call got incoming
        } else if (event === 'Dialing') {
          // Do something call got dialing
          // This clause will only be executed for iOS
          // if (!this.state.startCallAt) this.setState({ startCallAt: dayjs(), isCalling: true });
        } else if (event === 'Offhook') {
          //Device call state: Off-hook.
          // At least one call exists that is dialing,
          // active, or on hold,
          // and no calls are ringing or waiting.
          // This clause will only be executed for Android
          // if (!this.state.startCallAt) this.setState({ startCallAt: dayjs(), isCalling: true });
        } else if (event === 'Missed') {
          // Do something call got missed
          // This clause will only be executed for Android
          // if (this.state.isCalling) this.setState({ isCalling: false }, () => this.processEndCall(phoneNumber));
        }
      },
      false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {
        sendLogs(
          {
            error: {
              phoneNumber: phoneNumber,
            },
          },
          'RECORD_CALL_LOG'
        );
      }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Yêu cầu truy cập trạng thái cuộc gọi',
        message: 'Ứng dụng cần truy cập trạng thái cuộc gọi để lưu log gọi điện cho khách hàng',
      } // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    );

    this.setState(
      {
        startCallAt: dayjs(),
        endCallAt: null,
        isCalling: true,
      },
      () => {
        makePhoneCall(phoneNumber);
      }
    );
  };

  processEndCall = (phoneNumber: any) => {
    const { startCallAt } = this.state;
    const endCallAt = dayjs();
    if (endCallAt && startCallAt && startCallAt?.isBefore(endCallAt)) {
      const diff = endCallAt?.diff(startCallAt, 'second');
      if (diff >= 1) this.saveCallLog(phoneNumber, diff);
      else
        Notification.warning(
          `Thời gian thực hiện cuộc gọi của bạn quá ngắn, nên sẽ không được ghi nhận trên hệ thống. ${startCallAt?.format(
            'DD-MM-YYYY HH:mm:ss'
          )} -> ${endCallAt?.format('DD-MM-YYYY HH:mm:ss')}`
        );
    } else {
      this.saveCallLog(phoneNumber, 0);
      sendLogs({ error: this.state }, 'NO_DATA_CALL_LOG');
    }

    if (this.callDetector) {
      this.callDetector?.dispose();
      this.callDetector = null;
    }
  };

  saveCallLog = async (phoneNumber: any, callTime: any) => {
    const { trackingId, accessToken, receiverCallName, onCalled, updateQueueRequest, businessAddressId, typeCall, updateNewLogFlag } = this.props;
    const url = `${API_URL}/v1/snappy/trackings/${trackingId || (typeCall && 'tracking_id') || ''}?access_token=${accessToken || ''}&is_shipper=true`;
    const decodedData: any = decodeToken(accessToken);

    const body: any = {
      tracking_id: trackingId || '',
      call_number: phoneNumber || '',
      call_at: dayjs().format('HH:mm - DD/MM/YYYY'),
      receiver_call_name: receiverCallName || '',
      is_add_call_log: true,
      call_time: callTime || '',
      business_address_id: businessAddressId || '',
      type: typeCall || '',
      access_token: accessToken || '',
      shipper_id: decodedData?.uid || '',
    };

    if (isEmpty(body))
      return Notification.error('Dữ liệu gọi điện đang không có không thể thực hiện lưu log cuộc gọi, vui lòng liên hệ đội phát triển sản phẩm');

    const form = new FormData();
    Object.keys(body).forEach(function (key: any) {
      form.append(key, body[key]);
    });

    const firstResult = await this.doSaveCallLog(form);

    if (!firstResult?.success) {
      const secondResult = await this.doSaveCallLog(form);
      if (!secondResult?.success) {
        addLogs(
          {
            body: body,
            url: url,
            type: 'SHIPPER_CALL_LOG',
          },
          (id: any) => {
            updateNewLogFlag({ newKeyFlag: id });
            Notification.warning('Chưa lưu được log gọi điện, vui lòng đồng bộ ở mục đồng bộ');
          }
        );
      }
    }
  };

  doSaveCallLog = async (form: any) => {
    let result = null;
    const { trackingId, accessToken, onCalled, typeCall } = this.props;
    const url = `${API_URL}/v1/snappy/trackings/${trackingId || (typeCall && 'tracking_id') || ''}?access_token=${accessToken || ''}&is_shipper=true`;

    try {
      const response = await fetch(url, { method: 'post', body: form });
      const data = await response?.json();

      if (data?.success) Notification.success('Đã lưu lịch sử cuộc gọi');

      onCalled && onCalled();

      result = data;
    } catch (error) {
      console.log(error);
      sendLogs({ error: error, body: form, url: url }, 'SAVE_CALL_LOG');
    } finally {
      return result;
    }
  };

  onPressCall = () => {
    const { phoneNumber, listPhoneNumbers, updateSelectedTracking } = this.props;
    if (listPhoneNumbers?.length > 0) {
      this.onShowMoreCall();
    } else this.makeCall(phoneNumber);
    updateSelectedTracking && updateSelectedTracking();
  };

  render() {
    const { style, phoneNumber, listPhoneNumbers, children, themeDefault, textMainPhone, textExtraPhone, icon, subText } = this.props;
    const listPhoneNumbersMark =
      listPhoneNumbers?.length > 0 &&
      listPhoneNumbers.map((item: any, index: number) => {
        if (index === 0) return `${textMainPhone || 'Số chính:'} ${item}`;
        else return `${textExtraPhone || 'Số phụ:'} ${item}`;
      });

    return (
      <>
        {phoneNumber ? (
          <TouchableOpacity
            style={[themeDefault && { backgroundColor: Colors.color_action, width: 40, height: 40, borderRadius: 20 }, style]}
            onPress={this.onPressCall}>
            {children || (
              <View style={commonStyles.flex1CenterContent}>
                {(typeof icon === 'object' && <IconSnappy name="phone-call" color={Colors.color_key} size={20} {...icon} />) || icon || (
                  <IconSnappy name="phone-call" color={Colors.color_key} size={20} />
                )}
                {subText && <Text style={[subText.style, { fontFamily: 'Roboto_500Medium', marginTop: 4, fontSize: 12 }]}>{subText.text}</Text>}
              </View>
            )}
          </TouchableOpacity>
        ) : null}

        {listPhoneNumbers?.length > 0 && (
          <ActionSheet
            title="Chọn số để gọi"
            ref={(ref: any) => (this.showMoreCall = ref)}
            options={listPhoneNumbersMark.concat(['Đóng'])}
            cancelButtonIndex={listPhoneNumbers?.length}
            onPress={(index: number) => index !== listPhoneNumbers?.length && this.makeCall(listPhoneNumbers[index])}
          />
        )}
      </>
    );
  }
}

export default connect(null, { updateQueueRequest, updateNewLogFlag })(PhoneCall);
