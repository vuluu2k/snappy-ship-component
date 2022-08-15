import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

import Colors from './Colors';

const propTypes: any = {
  size: PropTypes.number,
  children: PropTypes.node,
  text: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLabel: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const defaultProps: any = {
  size: 16,
};

type IProps = InferProps<typeof propTypes>;

function Badge(props: IProps) {
  const { children, text, style, styleLabel } = props;

  return (
    <View style={[styles(props).badge, style]}>{(children || text) && <Text style={[styles(props).text, styleLabel]}>{children || text}</Text>}</View>
  );
}

Badge.propTypes = propTypes;

Badge.defaultProps = defaultProps;

const styles = (props: IProps) =>
  StyleSheet.create({
    badge: {
      width: props.size,
      height: props.size,
      borderRadius: props.size / 2,
      backgroundColor: Colors.volcano_6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    text: {
      color: '#fff',
      fontSize: props.size / 1.8,
    },
  });

export default Badge;
