import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

const propTypes = { children: PropTypes.node, style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), flex: PropTypes.string };
const defaultProps = {};

const styles: any = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.18,
    // shadowRadius: 1.00,

    // elevation: 1,
  },
  space_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

type IProps = InferProps<typeof propTypes>;

function Container({ children, style, flex }: IProps) {
  return <View style={[styles.container, style, flex && styles[flex]]}>{children}</View>;
}

Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

export default Container;
