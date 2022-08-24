import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { AntDesign } from '@expo/vector-icons';

import Colors from './Colors';
import IconSnappy from '@components/IconSnappy';

const propTypes = {
  message: PropTypes.node,
  type: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  icon: PropTypes.node,
};

const defaultProps = {
  type: 'success',
};

type IProps = InferProps<typeof propTypes>;

const IconAlert = (props: IProps) => {
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

  return <IconSnappy name={nameIcon} color={colorIcon} size={16} style={{ marginTop: 2 }} />;
};
function Alert(props: IProps) {
  const { message, type, children, style, icon } = props;

  return (
    <View style={[styles.common, type && styles[type], style]}>
      {icon || <IconAlert type={type} />}
      {children || <Text style={{ flex: 1, marginLeft: 8 }}>{message}</Text>}
    </View>
  );
}

Alert.propTypes = propTypes;

Alert.defaultProps = defaultProps;

const styles: any = StyleSheet.create({
  common: {
    padding: 8,
    flexDirection: 'row',
    borderRadius: 4,
  },
  icon_alert: { marginRight: 8 },
  error: {
    backgroundColor: Colors.dust_red_1,
  },
  success: {
    backgroundColor: Colors.daybreak_blue_4,
  },
  warn: {
    backgroundColor: Colors.sunset_orange_1,
  },
  info: {
    backgroundColor: Colors.geek_blue_1,
  },
});

export default Alert;
