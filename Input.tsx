import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Platform } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import * as Clipboard from 'expo-clipboard';

import { Notification } from '@components/SnyNotification';
import Colors from './Colors';
import CommonStyle from './CommonStyle';
import IconSnappy from '@components/IconSnappy';
import { InputProps } from './types/input';
import { getThemeColor, withThemeProps } from '@hocs/withTheme';

const propTypes: any = {
  title: PropTypes.node,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  numberOfLines: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLabelTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func,
  onChangeText: PropTypes.func,
  iconTitle: PropTypes.object,
  disabled: PropTypes.bool,
  onChangeSny: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  autoFocus: PropTypes.bool,
  loading: PropTypes.bool,
  hasCopy: PropTypes.bool,
  hasCallAction: PropTypes.bool,
};

type IProps = InferProps<typeof propTypes> & InputProps & withThemeProps;

const Input = React.forwardRef((props: IProps, ref: any) => {
  const {
    title,
    placeholder,
    numberOfLines,
    style,
    styleTitle,
    styleLabelTitle,
    name,
    value,
    onChangeText,
    onChange,
    autoCapitalize,
    keyboardType,
    iconTitle,
    disabled,
    secureTextEntry,
    onChangeSny,
    onSubmitEditing,
    onFocus,
    onBlur,
    autoFocus,
    returnKeyType,
    blurOnSubmit,
    hasCopy,
    loading,
    hasCallAction,
  } = props;
  const [isFocus, setFocus] = useState<boolean>(props?.autoFocus || false);
  const [themeColor, setThemeColor] = useState<string>('#2A2565');
  const [securePassword, setSecurePassword] = useState<any>(props?.secureTextEntry);
  const inputRef = useRef<any>(null);

  const handleEyePassword = () => setSecurePassword(!securePassword);

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Notification.success(`Đã sao chép ${text}`);
  };

  useEffect(() => {
    async function getColor() {
      const color = await getThemeColor();
      if (color) setThemeColor(color);
    }

    getColor();
  }, []);

  useEffect(() => {
    const timeout =
      autoFocus &&
      Platform.OS === 'android' &&
      setTimeout(() => {
        inputRef?.current?.blur();
        inputRef?.current?.focus();
      }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const ComponentIcon = iconTitle?.component;
  return (
    <View style={[styles.container]}>
      {title && (
        <View style={[{ marginBottom: 8 }, iconTitle && CommonStyle.flex_start, styleTitle]}>
          {iconTitle && (
            <ComponentIcon
              {...iconTitle}
              name={iconTitle?.name}
              size={iconTitle?.size || 14}
              color={iconTitle?.color || Colors.gray_4}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={[{ fontFamily: 'Roboto_500Medium' }, styleLabelTitle]}>{title}</Text>
        </View>
      )}
      <TextInput
        autoFocus={autoFocus}
        ref={ref || inputRef}
        placeholder={placeholder || (title && `Nhập ${title.toLowerCase()}`)}
        value={value}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        style={[
          CommonStyle.border_input,
          {
            backgroundColor: '#fff',
            borderWidth: isFocus ? 1.5 : 1,
            borderColor: isFocus ? themeColor : Colors.gray_1,
            height: 40,
          },
          style,
          disabled && styles.disabled,
        ]}
        onChange={onChange}
        onChangeText={(onChangeSny && (valueText => onChangeSny(name, valueText))) || onChangeText}
        editable={!disabled}
        onFocus={() => {
          onFocus && onFocus instanceof Function && onFocus();
          setFocus(true);
        }}
        onBlur={() => {
          onBlur && onBlur instanceof Function && onBlur();
          setFocus(false);
        }}
        secureTextEntry={securePassword}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        blurOnSubmit={blurOnSubmit}
        autoComplete="off"
        autoCorrect={false}
        selectionColor={Colors.color_key}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={handleEyePassword} style={styles.eye_password}>
          <IconSnappy name={`eye-${securePassword ? 'off' : 'on'}`} color={Colors.color_icon} size={16} />
        </TouchableOpacity>
      )}
      {(loading && (
        <View style={styles.has_copy}>
          <ActivityIndicator color={Colors.daybreak_blue_9} />
        </View>
      )) ||
        (value && hasCopy && !secureTextEntry && (
          <TouchableOpacity style={styles.has_copy} onPress={() => copyToClipboard(value)}>
            <IconSnappy name="copy" size={18} color={Colors.daybreak_blue_9} />
          </TouchableOpacity>
        )) ||
        null}
      {(value && hasCallAction && !secureTextEntry && (
        <TouchableOpacity style={styles.phone_action} onPress={() => Linking.openURL(`tel:${value}`)}>
          <IconSnappy name="phone" size={18} color={Colors.daybreak_blue_9} />
        </TouchableOpacity>
      )) ||
        null}
    </View>
  );
});

Input.propTypes = propTypes;

Input.defaultProps = {};

export default Input;

const styles = StyleSheet.create({
  container: { position: 'relative' },
  eye_password: { position: 'absolute', bottom: 11, right: 11 },
  has_copy: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: 36,
    width: 36,
    bottom: 3,
    right: 3,
    borderRadius: 17,
    marginLeft: 6,
  },
  phone_action: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: 36,
    width: 36,
    bottom: 3,
    right: 26,
    borderRadius: 17,
    marginLeft: 6,
  },
  disabled: { backgroundColor: 'rgba(199, 201, 217, 0.16)', borderColor: '#D9DBEA', color: Colors.gray_4 },
});
