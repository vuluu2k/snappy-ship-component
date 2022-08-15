import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes, { InferProps } from 'prop-types';

import Colors from './Colors';

const propTypes = {
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const defaultProps = {};

type IProps = InferProps<typeof propTypes>;

const Radio = (props: IProps) => {
  const { key, children, label, checked, onChange, style, labelStyle } = props;
  return (
    <TouchableOpacity onPress={() => onChange && onChange(checked)} disabled={!onChange} key={key} style={[styles.container, style]}>
      <MaterialIcons name={`radio-button-${checked ? 'on' : 'off'}`} size={20} color={checked ? Colors.daybreak_blue_7 : Colors.neutral_6} />
      {((children || label) && children) || <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </TouchableOpacity>
  );
};

Radio.propTypes = propTypes;

Radio.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    lineHeight: 22,
    marginLeft: 8,
  },
});

export default Radio;
