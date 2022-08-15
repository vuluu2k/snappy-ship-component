import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';

import { EmptyIcon } from '@components/IconSnappy';

const screen = Dimensions.get('screen');
export default class Empty extends Component {
  render() {
    return (
      <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', height: screen.height / 1.5, width: screen.width }]}>
        <EmptyIcon />
      </View>
    );
  }
}
