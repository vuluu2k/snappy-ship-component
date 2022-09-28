import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import IconSnappy from '@components/IconSnappy';

const color_orange = '#ad4e00';
const bg_orange = '#fff7e6';

const color_red = '#a8071a';
const bg_red = '#fff1f0';

const color_blue = '#1d39c4';
const bg_blue = '#f0f5ff';

const color_cyan = '#006d75';
const bg_cyan = '#e6fffb';

const color_purple = '#722ed1';
const bg_purple = '#f9f0ff';

const color_green = '#135200';
const bg_green = '#f6ffed';

const statusArray: Array<Object> = [
  { array: ['request_received', 'waiting_for_return', 'returning', 'part_delivery'], color: 'orange', text_color: color_orange },
  { array: ['processing_picked_up', 'out_for_delivery', 'picked_up'], color: 'blue', text_color: color_blue },
  { array: ['import_picking_warehouse', 'on_the_way', 'import_returning_warehouse', 'returned'], color: 'cyan', text_color: color_cyan },
  { array: ['picked_up_fail', 'undeliverable', 'return_fail', 'canceled'], color: 'red', text_color: color_red },
  { array: ['processing_on_the_way', 'on_the_way_returning'], color: 'purple', text_color: color_purple },
  { array: ['delivered'], color: 'green', text_color: color_green },
];

const trackingStatus = [
  { name: 'request_received', text: 'Chờ lấy hàng' },
  { name: 'processing_picked_up', text: 'Đang lấy' },
  { name: 'import_picking_warehouse', text: 'Nhập kho lấy' },
  { name: 'import_returning_warehouse', text: 'Nhập kho hoàn' },
  { name: 'picked_up_fail', text: 'Lấy thất bại' },
  { name: 'picked_up', text: 'Đã lấy' },
  { name: 'waiting_on_the_way', text: 'Chờ trung chuyển' },
  { name: 'processing_on_the_way', text: 'Đang trung chuyển' },
  { name: 'on_the_way', text: 'Đang trong kho' },
  { name: 'out_for_delivery', text: 'Đang giao' },
  { name: 'part_delivery', text: 'Giao một phần' },
  { name: 'delivered', text: 'Giao thành công' },
  { name: 'undeliverable', text: 'Giao thất bại' },
  { name: 'waiting_for_return', text: 'Chờ hoàn' },
  { name: 'on_the_way_returning', text: 'Trung chuyển hoàn' },
  { name: 'returning', text: 'Đang hoàn' },
  { name: 'returned', text: 'Đã hoàn' },
  { name: 'canceled', text: 'Đã hủy' },
  { name: 'success', text: 'Thành công' },
  { name: 'failed', text: 'Thất bại' },
  { name: 'new', text: 'Đang thực hiện' },
  { name: 'paid', text: 'Đã chốt' },
  { name: 'pending', text: 'Đang thực hiện' },
];

const statusArrayShip: Array<any> = [
  {
    array: ['processing_picked_up', 'out_for_delivery', 'returning', 'new', 'pending'],
    color: '#1D39C4',
    icon: <IconSnappy name="refresh" color="#1D39C4" size={14} />,
  },
  {
    array: ['picked_up', 'delivered', 'returned', 'success', 'paid'],
    color: '#237804',
    icon: <IconSnappy name="success-circle" color="#237804" size={14} />,
  },
  {
    array: ['undeliverable', 'picked_up_fail', 'failed', 'canceled'],
    color: '#CF1322',
    icon: <IconSnappy name="close-circle" color="#CF1322" size={14} />,
  },
];

export { statusArray, statusArrayShip };

const propTypes = {
  statusArray: PropTypes.array,
  status: PropTypes.string,
  status_vi: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  styleText: PropTypes.object,
  requestCounter: PropTypes.number,
  base: PropTypes.bool,
  shipper: PropTypes.bool,
};

const defaultProps = {
  statusArray: statusArray,
  status: '',
  status_vi: undefined,
  type: '',
  label: undefined,
  children: undefined,
  style: {},
  styleText: {},
};

type IProps = InferProps<typeof propTypes>;

const Status = (props: IProps) => {
  const { status, statusArray, status_vi, type, label, children, style, styleText, base, shipper } = props;
  const checkStatus = shipper ? statusArrayShip?.find(item => item.array.includes(status)) : statusArray?.find(item => item.array.includes(status));

  if (shipper)
    return (
      <View style={styles.container_shipper}>
        {checkStatus?.icon}
        <Text style={{ color: checkStatus?.color, marginLeft: 4, fontFamily: 'Roboto_500Medium' }}>
          {trackingStatus.find(item => item.name === status)?.text}
        </Text>
      </View>
    );

  return (
    <View
      style={(!base && [styles.sny_status, status && styles.w_120, type && styles[type], checkStatus && styles[checkStatus?.color], style]) || {}}>
      <Text
        style={[
          { fontSize: base ? 14 : 12 },
          checkStatus && styles[(!base && checkStatus?.color) || `base_${checkStatus?.color}`],
          styles[(!base && type) || `base_${type}`],
          styleText,
        ]}>
        {label || children || status_vi || trackingStatus.find(item => item.name === status)?.text || 'SnappyExpress'}
      </Text>
    </View>
  );
};

Status.propTypes = propTypes;

Status.defaultProps = defaultProps;

const base_common: any = {
  fontSize: 14,
  fontWeight: '500',
};

const styles: any = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  container_shipper: { flexDirection: 'row', alignItems: 'center' },
  container_btn: { position: 'relative' },
  badge: { position: 'absolute', top: -4, right: 4 },
  sny_status: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 80,
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  w_120: {
    minWidth: 120,
  },
  orange: {
    color: color_orange,
    backgroundColor: bg_orange,
    borderColor: color_orange,
  },

  red: {
    color: color_red,
    backgroundColor: bg_red,
    borderColor: color_red,
  },

  blue: {
    color: color_blue,
    backgroundColor: bg_blue,
    borderColor: color_blue,
  },

  cyan: {
    color: color_cyan,
    backgroundColor: bg_cyan,
    borderColor: color_cyan,
  },

  purple: {
    color: color_purple,
    backgroundColor: bg_purple,
    borderColor: color_purple,
  },

  green: {
    color: color_green,
    backgroundColor: bg_green,
    borderColor: color_green,
  },

  base_orange: {
    color: color_orange,
    ...base_common,
  },
  base_red: {
    color: color_red,
    ...base_common,
  },
  base_blue: {
    color: color_blue,
    ...base_common,
  },
  base_cyan: {
    color: color_cyan,
    ...base_common,
  },
  base_purple: {
    color: color_purple,
    ...base_common,
  },
  base_green: {
    color: color_green,
    ...base_common,
  },
});

export default Status;
