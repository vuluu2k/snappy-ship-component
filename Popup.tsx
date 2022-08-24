import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes, { InferProps } from 'prop-types';

import Colors from './Colors';
import IconSnappy from '@components/IconSnappy';

const propsTypes = {
  visible: PropTypes.bool,
  message: PropTypes.node,
  onOk: PropTypes.func,
  type: PropTypes.string,
};

type IProps = InferProps<typeof propsTypes>;

const IconPopup = (props: IProps) => {
  const { type } = props;
  let nameIcon = '';
  let colorIcon = '';

  switch (type) {
    case 'success':
      nameIcon = 'success-circle';
      colorIcon = Colors.polar_green_8;
      break;
    case 'error':
      nameIcon = 'close-circle';
      colorIcon = Colors.dust_red_7;
      break;
    case 'warn':
      nameIcon = 'warn';
      colorIcon = Colors.sunset_orange_7;
      break;
    case 'info':
      nameIcon = 'info';
      colorIcon = Colors.geek_blue_6;
      break;
    default:
      nameIcon = 'etc';
      break;
  }

  return <IconSnappy name={nameIcon} color={colorIcon} size={30} />;
};

function Popup(props: IProps) {
  const { visible, message, onOk, type } = props;
  return (
    <Modal isVisible={visible || false}>
      <View style={styles.content_modal}>
        <IconPopup type={type} />
        <Text style={styles.text_modal}>{message || 'Cảnh báo Snappy'}</Text>
        <TouchableOpacity onPress={onOk || undefined}>
          <View style={[styles.btn_ok, type && styles[type]]}>
            <Text style={{ color: 'white', fontFamily: 'Roboto_500Medium' }}>Đã hiểu</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles: any = StyleSheet.create({
  content_modal: {
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_modal: {
    color: Colors.gray_5,
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    marginVertical: 12,
  },
  btn_ok: {
    padding: 8,
    marginTop: 10,
    backgroundColor: 'red',
    minWidth: 120,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    backgroundColor: Colors.dust_red_7,
  },
  success: {
    backgroundColor: Colors.polar_green_8,
  },
  warn: {
    backgroundColor: Colors.sunset_orange_7,
  },
  info: {
    backgroundColor: Colors.geek_blue_6,
  },
});

export default Popup;
