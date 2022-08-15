import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from './Colors';

const propTypes = {
  fontSize: PropTypes.number,
  checked: PropTypes.bool,
  label: PropTypes.node,
  labelColor: PropTypes.string,
  fontFamily: PropTypes.string,
  labelCenter: PropTypes.bool,
  style: PropTypes.object,
  onChange: PropTypes.func,
  end: PropTypes.node,
  center: PropTypes.bool,
  labelReactNode: PropTypes.bool,
};
const defaultProps = {
  checked: false,
  label: '',
  color: '#cecece',
  labelColor: '#434343',
  fontSize: 14,
  style: {},
};

type IProps = InferProps<typeof propTypes>;

const CheckBox = (props: IProps) => {
  const { style, labelCenter, center, label, onChange, labelColor, fontSize, fontFamily, end, checked, labelReactNode } = props;
  const styleLabel: any = { color: labelColor, fontSize: fontSize, fontFamily: fontFamily };
  return (
    <TouchableHighlight onPress={onChange || undefined} style={style} underlayColor="transparent">
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            ...(labelCenter ? { alignItems: 'center' } : {}),
            ...(center ? { alignItems: 'center' } : {}),
          }}>
          {checked ? (
            <View>
              <MaterialIcons name="check-box" size={22} color={Colors.color_key} />
            </View>
          ) : (
            <View>
              <MaterialIcons name="check-box-outline-blank" size={22} color={Colors.color_border} />
            </View>
          )}
          {(labelReactNode && <View style={{ paddingLeft: 4 }}>{label}</View>) || (
            <View>
              <Text style={[styles.checkboxLabel, styleLabel]}>{label}</Text>
            </View>
          )}
        </View>
        {end && <View>{end}</View>}
      </View>
    </TouchableHighlight>
  );
};

CheckBox.propTypes = propTypes;

CheckBox.defaultProps = defaultProps;

const styles = StyleSheet.create({
  checkboxLabel: {
    fontSize: 14,
    paddingLeft: 4,
  },
});

export default CheckBox;
