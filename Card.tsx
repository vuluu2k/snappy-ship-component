import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { AntDesign, Feather } from '@expo/vector-icons';

import Colors from './Colors';
import CodeCopy from './CodeCopy';
import Divider from './Divider';
import ButtonAction from './ButtonAction';
import IconSnappy, { DollarCircleIcon } from '@components/IconSnappy';
import SwipeAble from './SwipeAble';
import CheckBox from './CheckBox';
import CommonStyle from './CommonStyle';
import Status from './Status';

const propTypes: any = {
  index: PropTypes.number,
  code: PropTypes.string,
  onPressDetail: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  address: PropTypes.string,
  fullName: PropTypes.string,
  phoneNumber: PropTypes.string,
  packageInfo: PropTypes.string,
  note: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  swipeAble: PropTypes.object,
  onConvert: PropTypes.func,
  onPrint: PropTypes.func,
  onFail: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onSuccess: PropTypes.func,
  onCall: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  isSelect: PropTypes.bool,
  onSelect: PropTypes.func,
  onPin: PropTypes.func,
  latestViewId: PropTypes.string,
  cost: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  status: PropTypes.string,
  isPinned: PropTypes.bool,
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.bool]),
  indexColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.bool]),
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
    onPin,
    successText,
    isSelect,
    onSelect,
    latestViewId,
    cost,
    status,
    isPinned,
    backgroundColor,
    indexColor,
  } = props;
  const buttonOptions = [];
  onConvert && buttonOptions.push({ key: 'convert', text: 'Chuyển', onPress: onConvert });
  onPrint && buttonOptions.push({ key: 'printer', text: 'In đơn', onPress: onPrint });
  onFail && buttonOptions.push({ key: 'fail', text: 'Thất bại', onPress: onFail });
  onSuccess && buttonOptions.push({ key: 'success', text: successText || 'Đã lấy', onPress: onSuccess });
  onCall && buttonOptions.push({ key: 'phone_call', text: 'Gọi', onPress: onCall });

  const visibleContent = address || fullName || phoneNumber || packageInfo || note;
  const indexColorGroup = (indexColor && { backgroundColor: typeof indexColor === 'function' ? indexColor() : indexColor }) || {};
  const indexColorContainer = indexColor && { borderColor: typeof indexColor === 'function' ? indexColor() : indexColor, borderWidth: 1 };
  const backgroundColorGroup =
    (backgroundColor && { backgroundColor: typeof backgroundColor === 'function' ? backgroundColor() : backgroundColor }) || {};
  const backgroundColorLatestView = latestViewId === code && { backgroundColor: Colors.geek_blue_1 };

  return (
    <TouchableOpacity
      onPress={onPressDetail}
      activeOpacity={0.7}
      style={[styles.container, style, backgroundColorGroup, indexColorContainer, backgroundColorLatestView]}>
      <View style={[styles.index, indexColorGroup]}>
        <Text style={{ color: 'white' }}>{index}</Text>
      </View>

      {/* Header */}
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

            {status && <Status status={status} />}
            {onSelect && <CheckBox checked={isSelect} onChange={onSelect} style={{ marginLeft: 8 }} />}
          </View>
        </View>
        <Divider style={[{ marginBottom: 0},indexColorGroup]} />
      </View>

      {/* Content */}
      {visibleContent && (
        <SwipeAble {...swipeAble} disabled={!swipeAble}>
          <View style={[styles.p_hr_16, { paddingTop: 12 }, backgroundColorGroup, backgroundColorLatestView]}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
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
                        <IconSnappy name="package-outline" size={Colors.size_icon} color={Colors.color_icon} />
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
                      {(typeof note === 'object' &&
                        note.map((item: any, idx: number) => {
                          if (item)
                            return (
                              <Text style={styles.text} key={idx}>
                                {item}
                              </Text>
                            );
                          return null;
                        })) || <Text style={styles.text}>{note}</Text>}
                    </View>
                  </View>
                )}
              </View>
              <AntDesign name="right" size={Colors.size_icon} />
            </View>
          </View>
        </SwipeAble>
      )}
      {visibleContent && <Divider style={[{ marginTop: 0, marginHorizontal: 16 },indexColorGroup]} />}

      {/* Footer */}
      <View style={styles.p_hr_16}>
        {cost && (
          <View style={[CommonStyle.d_flex_between, { marginBottom: 8 }]}>
            <Text style={{ fontFamily: 'Roboto_500Medium' }}>Số tiền cần thu</Text>
            <View style={CommonStyle.d_flex_between}>
              <DollarCircleIcon width={20} height={20} theme={1} />
              <Text style={{ marginLeft: 4, fontFamily: 'Roboto_500Medium' }}>{cost}</Text>
            </View>
          </View>
        )}
        <ButtonAction options={buttonOptions} />
      </View>

      {/* Position */}
      {/* Pinned */}
      {onPin && (
        <TouchableOpacity onPress={onPin} style={[styles.pinnedContainer, { backgroundColor: isPinned ? Colors.calendula_gold_4 : Colors.gray_4 }]}>
          <Feather name="paperclip" size={12} color={isPinned ? 'black' : 'white'} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingVertical: 12,
  },
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
  content: { flexDirection: 'row', marginBottom: 12, flex: 1 },
  right: { marginTop: 1 },
  left: { paddingLeft: 12, flex: 1 },
  text: { lineHeight: 22 },
  hasNew: { backgroundColor: Colors.calendula_gold_4, borderRadius: 4, paddingHorizontal: 6, marginRight: 8 },
  p_hr_16: { paddingHorizontal: 16 },
  pinnedContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 8,
    zIndex: 10,
    borderTopLeftRadius: 8,
  },
});

export default Card;
