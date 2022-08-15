import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

const propTypes: any = {
  text: PropTypes.node,
  size: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.node,
  image: PropTypes.string,
};

const defaultProps: any = {
  text: 'Snappy',
  size: 40,
  style: {},
};

type IProps = InferProps<typeof propTypes>;

export class Avatar extends Component<IProps> {
  static propTypes = {};
  static defaultProps: { text: string; size: number; style: {} };

  render() {
    const { text, style, icon, image, source, onPress, disabled } = this.props;

    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || !onPress}>
        {((image || source) && (
          <Image source={(image?.startsWith('https://') && { uri: image }) || source} style={[styles(this.props).image, style]} />
        )) || (
          <View style={[styles(this.props).container, style]}>
            {icon || (text && <Text style={styles(this.props).text}>{(text?.length <= 6 && text) || text.slice(0, 6).toUpperCase()}</Text>)}
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

Avatar.propTypes = propTypes;

Avatar.defaultProps = defaultProps;

const styles = (props: IProps) =>
  StyleSheet.create({
    container: {
      width: props.size,
      height: props.size,
      borderRadius: props.size / 2,
      backgroundColor: '#D9DBEA4D',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    text: {
      fontSize: props.size / 6,
      fontWeight: '500',
    },
    image: { width: props.size, height: props.size, borderRadius: props.size / 2, overflow: 'hidden' },
  });

export default Avatar;
