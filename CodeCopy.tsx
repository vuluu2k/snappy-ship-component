import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import PropTypes, { InferProps } from 'prop-types';

import { Notification } from '@components/SnyNotification';
import CommonStyle from './CommonStyle';
import Colors from './Colors';

const propTypes: any = {
  text: PropTypes.node,
  number: PropTypes.node,
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const defaultProps: any = {
  text: 'code number',
  number: 1,
  style: {},
};

type IProps = InferProps<typeof propTypes>;

function CodeCopy(props: IProps) {
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Notification.success(`Đã sao chép ${text}`);
  };

  const { text, index, children, style } = props;
  return (
    <View style={style}>
      <View style={[CommonStyle.d_flex_start]}>
        <TouchableOpacity onPress={() => copyToClipboard(text)}>
          {((text || children) && (
            <Text style={{ color: Colors.geek_blue_7, fontFamily: 'Roboto_500Medium' }}>
              {index && `${index}.`} {children || text}
            </Text>
          )) ||
            null}
        </TouchableOpacity>
      </View>
    </View>
  );
}

CodeCopy.propTypes = propTypes;
CodeCopy.defaultProps = defaultProps;

export default CodeCopy;
