import React from 'react';
import axios from 'axios';
import { View, Dimensions, ActivityIndicator, Text } from 'react-native';

import Input from './Input';
import Modal from './Modal';
import { API_URL } from '@sny_configs/environment';
import Button from './Button';
const windowHeight = Dimensions.get('window').height;

interface ComponentProps {
  autoHidden?: boolean;
  accessToken?: string;
  message?: string;
  visible: boolean;
  onDismiss?: () => void;
  action?: any;
  params?: any;
  loading?: boolean;
}

interface ComponentState {
  countdown: number;
  requesting: boolean;
  message: string | undefined;
  otpCode: any;
  visible: boolean;
}

export default class ModalOTP extends React.Component<ComponentProps, ComponentState> {
  mounted: boolean;
  timer: ReturnType<typeof setInterval> | undefined;

  constructor(props: ComponentProps) {
    super(props);
    this.mounted = false;
    this.state = {
      countdown: 60,
      requesting: false,
      message: props.message,
      otpCode: undefined,
      visible: props.visible,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.startTimer(59);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearInterval(this.timer);
  }

  startTimer = (duration: number) => {
    this.timer = setInterval(() => {
      if (this.timer && duration < 0) {
        if (this.props.autoHidden) this.setState({ visible: false });
        return clearInterval(this.timer);
      }
      this.mounted && this.setState({ countdown: duration-- });
    }, 1000);
  };

  resendOtp = async () => {
    const { accessToken } = this.props;
    const url = `${API_URL}/v1/snappy/users/resend_otp?access_token=${accessToken || ''}`;

    this.mounted && this.setState({ requesting: true });

    const res = await axios.post(url);

    this.mounted && this.setState({ requesting: false, ...res.data, countdown: 60 }, () => this.startTimer(59));
  };

  render() {
    const { onDismiss, action, params, loading, autoHidden } = this.props;
    const { countdown, message, otpCode, visible } = this.state;

    return (
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        titleModal="Nhập Mã OTP"
        styleContentModal={{ height: windowHeight / 1.5 }}
        supportKeyboard={false}>
        {(message && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ textAlign: 'center' }}>{message}</Text>
          </View>
        )) ||
          null}
        <View style={{ marginTop: 10 }}>
          <Input autoFocus value={otpCode} placeholder="Nhập OTP..." onChangeText={(otpCode: string) => this.mounted && this.setState({ otpCode })} />
        </View>

        <View style={{ flexDirection: 'row', marginTop: 24 }}>
          {!autoHidden && (
            <Button
              size="lg"
              style={{ flex: 1, marginRight: 8 }}
              onPress={() => (countdown === 0 ? this.resendOtp() : {})}
              loading={this.state.requesting}
              disabled={countdown !== 0}>
              {this.state.requesting ? (
                <View>
                  <ActivityIndicator color="#8c8c8c" size="small" />
                </View>
              ) : null}
              Gửi lại OTP {countdown > 0 ? `(${countdown})` : ''}
            </Button>
          )}
          <Button
            size="lg"
            type="primary"
            style={{ flex: 1 }}
            onPress={() => {
              action({ ...params, otpCode });
            }}
            loading={loading}
            disabled={!otpCode}>
            Xác nhận {autoHidden && countdown}
          </Button>
        </View>
      </Modal>
    );
  }
}
