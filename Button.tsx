import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

import Colors from './Colors';
import { ButtonProps } from './types/button';
import withTheme, { withThemeProps } from '@hocs/withTheme';

const propTypes = {
  text: PropTypes.node,
  textColor: PropTypes.string,
  type: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  customStyle: PropTypes.bool, // allow overwrite style, textColor
  onLayout: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  icon: PropTypes.object,
  position: PropTypes.string,
  activeOpacity: PropTypes.number,
  notClick: PropTypes.bool,
  children: PropTypes.node,
};

const defaultProps = {
  text: 'SnappyExpress',
  textColor: Colors.gray_5,
  type: 'default',
  style: {},
  loading: false,
  customStyle: false,
  disabled: false,
  size: 'md',
  position: undefined,
};

type IProps = InferProps<typeof propTypes> & ButtonProps & withThemeProps;

class Button extends Component<IProps> {
  static propTypes: {};
  static defaultProps: {
    text?: string;
    textColor?: string;
    type?: string;
    style?: {};
    loading?: boolean;
    customStyle?: boolean;
    disabled?: boolean;
    size?: string;
    position?: undefined;
  };
  render() {
    const {
      text,
      type,
      onPress,
      style,
      textColor,
      children,
      loading,
      customStyle,
      labelStyle,
      onLayout,
      disabled,
      size,
      icon,
      activeOpacity,
      notClick,
      position,
      themeColor,
    } = this.props;
    const ComponentIcon = icon?.component;

    const colorIcon =
      (disabled && styles(this.props).text_disabled.color) || (customStyle && textColor) || styles(this.props)[`text_${type}`]?.color || textColor;

    return (
      <TouchableOpacity
        activeOpacity={activeOpacity || 0.4}
        onLayout={onLayout}
        onPress={onPress}
        disabled={disabled || notClick}
        style={[
          styles(this.props).common,
          style,
          styles(this.props)[type] || style,
          styles(this.props)[`${size}${(type === 'icon' && '_icon') || ''}`],
          customStyle && style,
          disabled && styles(this.props).disabled,
          position && styles(this.props)[`position_${position}`],
        ]}>
        {(loading && <ActivityIndicator color={colorIcon} style={{ marginRight: 4 }} />) ||
          (icon && <ComponentIcon {...icon} size={icon?.size || 14} color={icon?.color || colorIcon} style={{ marginRight: 4 }} />) ||
          null}
        <Text
          style={[
            styles(this.props).text_common,
            styles(this.props)[`text_${type}`] || { color: textColor },
            customStyle && { color: textColor },
            labelStyle,
            disabled && styles(this.props).text_disabled,
          ]}>
          {children || text || 'Snappy'}
        </Text>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = propTypes;

Button.defaultProps = defaultProps;

export default withTheme(Button);

const styles: any = (props: IProps) => {
  const { themeColor } = props;

  return StyleSheet.create({
    common: {
      borderRadius: 8,
      height: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(217, 219, 234, 0.3)',
      minWidth: 160,
    },

    text_common: {
      fontFamily: 'Roboto_500Medium',
    },
    //size
    sm: { height: 24 },
    smd: { height: 26 },
    md: { height: 32 },
    lg: { height: 40 },
    xl: { height: 48 },

    md_icon: { height: 32, width: 32, minWidth: 32 },
    lg_icon: { height: 40, width: 40, minWidth: 40 },
    //button-style

    default: {
      color: Colors.gray_5,
    },

    icon: {
      backgroundColor: 'transparent',
    },

    disabled: {
      backgroundColor: '#D9DBEA66',
    },

    text_disabled: {
      color: Colors.gray_2,
    },

    primary: {
      backgroundColor: themeColor,
    },

    text_primary: {
      color: 'white',
    },

    danger: {
      backgroundColor: Colors.dust_red_6,
      color: 'white',
    },

    text_danger: {
      color: 'white',
    },

    outline_primary: {
      borderWidth: 1,
      borderColor: Colors.logo_snappy,
    },

    text_outline_primary: {
      color: Colors.logo_snappy,
    },

    sny_select: {
      borderWidth: 1,
      backgroundColor: '#fff',
      borderColor: Colors.gray_1,
      borderRadius: 24,
    },

    text_sny_select: {
      color: Colors.gray_4,
    },

    sny_active_select: {
      backgroundColor: Colors.geek_blue_1,
      borderRadius: 24,
    },

    text_sny_active_select: {
      color: Colors.logo_snappy,
    },

    sny_gold: {
      backgroundColor: '#FFF7E633',
      borderRadius: 24,
      minWidth: 103,
    },

    text_sny_gold: {
      color: Colors.yellow_snappy,
    },

    position_bottom: {
      position: 'absolute',
      bottom: 8,
      width: '100%',
      left: 16,
    },
  });
};
