import React from 'react';
import { View, Text, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';

import Divider from './Divider';
import Colors from '@constants/Colors';

const propTypes = {
  processing: PropTypes.bool,
  options: PropTypes.array,
};

const defaultProps = {
  options: [
    { key: 'SNP123456789', isProcessed: true, isFailed: false },
    { key: 'SNP123456789', isProcessed: true, isFailed: true },
    { key: 'SNP123456789', isProcessed: false, isFailed: false },
    { key: 'SNP123456789', isProcessed: false, isFailed: false },
  ],
};

const deviceHeight = Dimensions.get('window').height;

type IProps = InferProps<typeof propTypes>;

function Processing(props: IProps) {
  const { processing, options } = props;

  return (
    <Modal
      hideModalContentWhileAnimating
      statusBarTranslucent
      backdropTransitionOutTiming={0}
      isVisible={processing || false}
      style={{
        overflow: 'hidden',
      }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 8, maxHeight: deviceHeight / 2 }}>
        <Text style={{ textAlign: 'center', paddingTop: 12, fontFamily: 'Roboto_500Medium' }}>Xử lý dữ liệu</Text>
        <Divider />
        <ScrollView>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            {options?.map((item, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ marginRight: 8 }}>
                    {(item?.isFailed && <AntDesign name="closecircleo" size={18} color={Colors.dust_red_7} />) ||
                      (item?.isProcessed && <AntDesign name="checkcircleo" size={18} color={Colors.polar_green_7} />) || <ActivityIndicator />}
                  </View>
                  <Text style={{ color: (item?.isFailed && Colors.dust_red_7) || (item?.isProcessed && Colors.polar_green_7) || 'black' }}>
                    {item.key}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

Processing.propTypes = propTypes;
Processing.defaultProps = defaultProps;

export default Processing;
