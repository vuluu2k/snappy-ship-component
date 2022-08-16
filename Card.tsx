import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { AntDesign, Octicons } from '@expo/vector-icons';

import Colors from './Colors';
import CodeCopy from './CodeCopy';
import Divider from './Divider';
import ButtonAction from './ButtonAction';
import IconSnappy from '@components/IconSnappy';
import SwipeAble from './SwipeAble';
import CheckBox from './CheckBox';

const propTypes: any = {
  index: PropTypes.number,
  code: PropTypes.string,
  onPressDetail: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  address: PropTypes.string,
  fullName: PropTypes.string,
  phoneNumber: PropTypes.string,
  packageInfo: PropTypes.string,
  note: PropTypes.string,
  swipeAble: PropTypes.object,
  onConvert: PropTypes.func,
  onPrint: PropTypes.func,
  onFail: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onSuccess: PropTypes.func,
  onCall: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  isSelect: PropTypes.bool,
  onSelect: PropTypes.func,
  latestViewId: PropTypes.string,
};

const defaultProps: any = {
  // code: 'SNP123456789',
  // fullName: 'Nguyễn Hồng Anh',
  // phoneNumber: '0987654321',
  // address: '12, ngõ 12, Thái Hà, Ngã Tư Sở, Đống Đa, Hà Nội...',
  // packageInfo: 'Áo phông trắng x 20 cái',
  // note: 'Liên hệ 0987654321 nếu người nhận không nghe máy hoặc không nhận hàng.',
};

type IProps = InferProps<typeof propTypes>;

function Card(props: IProps) {
  const {
    index,
    code,
    onPressDetail,
    style,
    address,
    fullName,
    phoneNumber,
    packageInfo,
    note,
    hasNew,
    swipeAble,
    onConvert,
    onPrint,
    onFail,
    onSuccess,
    onCall,
    successText,
    isSelect,
    onSelect,
    latestViewId,
  } = props;
  const buttonOptions = [];
  onConvert && buttonOptions.push({ key: 'convert', text: 'Chuyển', onPress: onConvert });
  onPrint && buttonOptions.push({ key: 'printer', text: 'In đơn', onPress: onPrint });
  onFail && buttonOptions.push({ key: 'fail', text: 'Thất bại', onPress: onFail });
  onSuccess && buttonOptions.push({ key: 'success', text: successText || 'Đã lấy', onPress: onSuccess });
  onCall && buttonOptions.push({ key: 'phone_call', text: 'Gọi', onPress: onCall });

  return (
    <View style={[styles.container, style, latestViewId === code && { backgroundColor: Colors.geek_blue_1 }]}>
      <View style={styles.index}>
        <Text style={{ color: 'white' }}>{index}</Text>
      </View>
      <View style={styles.p_hr_16}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', paddingLeft: 32, alignItems: 'center' }}>
            <CodeCopy text={code} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {(hasNew && (
              <View style={styles.hasNew}>
                <Text>Mới</Text>
              </View>
            )) ||
              null}
            <TouchableOpacity onPress={onPressDetail}>
              <Text style={{ color: Colors.geek_blue_7, fontFamily: 'Roboto_500Medium' }}>
                Chi tiết <AntDesign name="right" />
              </Text>
            </TouchableOpacity>
            {onSelect && <CheckBox checked={isSelect} onChange={onSelect} />}
          </View>
        </View>
        <Divider style={{ marginBottom: 0 }} />
      </View>

      <SwipeAble {...swipeAble} disabled={!swipeAble}>
        <View style={[styles.p_hr_16, { paddingTop: 12 }, latestViewId === code && { backgroundColor: Colors.geek_blue_1 }]}>
          {((address || fullName || phoneNumber) && (
            <View style={styles.content}>
              <View>
                <Text style={styles.right}>
                  <IconSnappy name="environment" size={Colors.size_icon} color={Colors.color_icon} />
                </Text>
              </View>
              <View style={styles.left}>
                {(fullName && phoneNumber && (
                  <Text style={styles.text}>
                    {fullName} - <Text>{phoneNumber}</Text>
                  </Text>
                )) ||
                  null}
                {(address && <Text style={styles.text}>{address}</Text>) || null}
              </View>
            </View>
          )) ||
            null}

          {packageInfo && (
            <View style={styles.content}>
              <View>
                <Text style={styles.right}>
                  <Octicons name="package" size={Colors.size_icon} color={Colors.color_icon} />
                </Text>
              </View>
              <View style={styles.left}>
                <Text style={styles.text}>{packageInfo}</Text>
              </View>
            </View>
          )}

          {note && (
            <View style={styles.content}>
              <View>
                <Text style={styles.right}>
                  <AntDesign name="infocirlceo" size={Colors.size_icon} color={Colors.dust_red_7} />
                </Text>
              </View>
              <View style={styles.left}>
                <Text style={styles.text}>{note}</Text>
              </View>
            </View>
          )}
        </View>
      </SwipeAble>
      {(address || fullName || phoneNumber || packageInfo || note) && <Divider style={{ marginTop: 0, marginHorizontal: 16 }} />}
      <View style={styles.p_hr_16}>
        <ButtonAction options={buttonOptions} />
      </View>
    </View>
  );
}

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1, paddingVertical: 12 },
  index: {
    backgroundColor: Colors.gray_4,
    flex: 1,
    position: 'absolute',
    minWidth: 28,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
    left: 12,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  content: { flex: 1, flexDirection: 'row', marginBottom: 12 },
  right: { marginTop: 1 },
  left: { paddingLeft: 12, flex: 1 },
  text: { lineHeight: 22 },
  hasNew: { backgroundColor: Colors.calendula_gold_4, borderRadius: 4, paddingHorizontal: 6, marginRight: 8 },
  p_hr_16: { paddingHorizontal: 16 },
});

export default Card;
