import React from 'react';
import { View } from 'react-native';

import IconSnappy from '@components/IconSnappy';

const IconList = ({ name, color }: { name: string; color: string }) => {
  return (
    <View style={{ backgroundColor: color, width: 30, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
      <IconSnappy name={name} color="#fff" size={20} />
    </View>
  );
};

export default IconList;
