import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Lottie from 'lottie-react-native';

const deviceWidth = Dimensions.get('screen').width;
export default class Empty extends Component {
  render() {
    return (
      <View style={[{ alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
        <Lottie source={require('../../assets/animations/empty.json')} style={{ width: deviceWidth / 3 }} autoPlay loop />
        <Text style={{ fontFamily: 'Roboto_500Medium', color: '#AEB8C2' }}>Không có dữ liệu</Text>
      </View>
    );
  }
}
