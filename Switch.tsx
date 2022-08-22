import React from 'react';
import { Switch as SwitchNative, Platform, View, StyleSheet } from 'react-native';

import Colors from './Colors';

function Switch(props: any) {
  return (
    <View style={(Platform.OS === 'android' && styles(props).container) || {}}>
      <SwitchNative trackColor={{ false: Colors.gray_2, true: Colors.geek_blue_5 }} thumbColor="#fff" {...props} />
    </View>
  );
}

const styles = (props: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: props.value ? Colors.geek_blue_5 : Colors.gray_2,
      height: 24,
      width: 43,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Switch;
