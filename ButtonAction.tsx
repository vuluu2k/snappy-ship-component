import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

import Colors from './Colors';
import IconSnappy from '@components/IconSnappy';
import PhoneCall from '@components/Common/Links/PhoneCall';

const propTypes = {
  options: PropTypes.array,
  horizontal: PropTypes.bool,
};
const defaultProps = {
  options: [
    {
      key: 'convert',
      text: 'Convert',
    },
    {
      key: 'fail',
      text: 'Fail',
    },
    {
      key: 'success',
      text: 'Success',
    },
    {
      key: 'phone_call',
      text: 'PhoneCall',
    },
    {
      key: 'print',
      text: 'Print',
    },
  ],
};

type IProps = InferProps<typeof propTypes>;

const keySelect = (key: string) => {
  switch (key) {
    case 'convert':
      return { color: 'purple', name: 'refresh-ship' };
    case 'fail':
      return { color: 'red', name: 'close-circle' };
    case 'success':
      return { color: 'green', name: 'success-circle' };
    case 'phone_call':
      return { color: 'blue', name: 'phone-call' };
    case 'print':
      return { color: 'orange', name: 'printer-ship' };
  }
};

function ButtonAction(props: IProps) {
  const { options, horizontal } = props;

  return (
    <View style={styles1.container}>
      {options?.map((item, idx) => {
        const color = item?.color || keySelect(item?.key)?.color;
        const nameIcon = keySelect(item?.key)?.name;
        if (item?.key === 'phone_call') {
          return (
            <PhoneCall {...item?.onPress} key={idx} style={styles(props, idx).button}>
              <Text>{item?.icon || <IconSnappy size={horizontal ? 14 : Colors.size_icon} name={nameIcon} color={styles1[color].color} />}</Text>
              <Text
                style={{
                  color: styles1[color].color,
                  marginTop: horizontal ? 0 : 4,
                  marginLeft: horizontal ? 4 : 0,
                  lineHeight: 22,
                  fontSize: 12,
                  fontFamily: 'Roboto_500Medium',
                }}>
                {item?.text}
              </Text>
            </PhoneCall>
          );
        }
        return (
          <TouchableOpacity onPress={item?.onPress} key={idx} style={styles(props, idx).button}>
            <Text>{item?.icon || <IconSnappy size={horizontal ? 14 : Colors.size_icon} name={nameIcon} color={styles1[color].color} />}</Text>
            <Text
              style={{
                color: styles1[color].color,
                marginTop: horizontal ? 0 : 4,
                marginLeft: horizontal ? 4 : 0,
                lineHeight: 22,
                fontSize: 12,
                fontFamily: 'Roboto_500Medium',
              }}>
              {item?.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

ButtonAction.propTypes = propTypes;
ButtonAction.defaultProps = defaultProps;

const styles1: any = StyleSheet.create({
  container: { flexDirection: 'row', flex: 1 },

  purple: {
    color: Colors.golden_purple_6,
  },

  red: {
    color: Colors.dust_red_7,
  },

  green: {
    color: Colors.polar_green_8,
  },

  blue: {
    color: Colors.geek_blue_7,
  },

  orange: {
    color: Colors.sunset_orange_8,
  },
});

const styles = (props: IProps, idx: number) => {
  const { options, horizontal } = props;
  return StyleSheet.create({
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: horizontal ? 4 : 8,
      backgroundColor: '#F2F2F7',
      marginRight: idx === (options?.length || 0) - 1 ? 0 : 8,
      flexDirection: horizontal ? 'row' : 'column',
      borderRadius: 6,
    },
  });
};

export default ButtonAction;
