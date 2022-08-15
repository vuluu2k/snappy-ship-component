import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { AntDesign } from '@expo/vector-icons';

import Colors from './Colors';

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

function Alert(props: IProps) {
  const { message, type, children, style, icon } = props;

  return (
    <View style={[styles.common, type && styles[type], style]}>
      {icon || (
        <AntDesign
          name="infocirlceo"
          size={16}
          color={(type === 'success' && Colors.daybreak_blue_6) || (type === 'error' && Colors.volcano_6) || Colors.color_icon}
          style={styles.icon_alert}
        />
      )}
      {children || <Text style={{ flex: 1 }}>{message}</Text>}
    </View>
  );
}

Alert.propTypes = propTypes;

Alert.defaultProps = defaultProps;

const styles: any = StyleSheet.create({
  common: {
    borderWidth: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  icon_alert: { marginRight: 8 },
  error: {
    borderColor: Colors.volcano_4,
    backgroundColor: Colors.volcano_1,
  },
  success: {
    borderColor: Colors.daybreak_blue_1,
    backgroundColor: Colors.daybreak_blue_4,
  },
  warning: {},
});

export default Alert;
