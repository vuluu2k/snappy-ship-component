import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

import Colors from './Colors';

const propTypes: any = {
  type: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const defaultProps: any = {
  type: 'horizontal',
  style: {},
};

type IProps = InferProps<typeof propTypes>;

export default class Divider extends Component<IProps> {
  static propTypes: any;
  static defaultProps: any;
  render() {
    const { type, style } = this.props;
    return <View style={[styles[`divider_${type}`], style]} />;
  }
}

Divider.propTypes = propTypes;
Divider.defaultProps = defaultProps;

const styles: any = StyleSheet.create({
  divider_horizontal: { height: 1, backgroundColor: Colors.color_border, marginVertical: 12 },
  divider_vertical: { width: 1, backgroundColor: Colors.color_border },
});
