import React from 'react';
import { View, Text, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import Modal from 'react-native-modal';
import { AntDesign, Feather } from '@expo/vector-icons';

import Divider from './Divider';
import ProgressBar from './ProgressBar';
import Colors from '@constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const propTypes = {
  processing: PropTypes.bool,
  options: PropTypes.array,
  percentProcessing: PropTypes.number,
  onDismiss: PropTypes.any,
  enableDismiss: PropTypes.bool,
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
const deviceWidth = Dimensions.get('window').width;

type IProps = InferProps<typeof propTypes>;

function Processing(props: IProps) {
  const { processing, options, percentProcessing, onDismiss, enableDismiss } = props;

  return (
    <Modal
      hideModalContentWhileAnimating
      statusBarTranslucent
      backdropTransitionOutTiming={0}
      isVisible={processing || false}
      style={{
        overflow: 'hidden',
      }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 8, maxHeight: deviceHeight / 2, position: 'relative' }}>
        <Text style={{ textAlign: 'center', paddingTop: 12, fontFamily: 'Roboto_500Medium' }}>Xử lý dữ liệu</Text>
        {enableDismiss && (
          <View style={{ position: 'absolute', right: 5, top: 5 }}>
            <TouchableOpacity onPress={onDismiss}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        <Divider />

        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <ProgressBar progress={Number(percentProcessing?.toFixed(2))} width={deviceWidth - 64} height={14} borderRadius={10} />
        </View>
        <ScrollView>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            {options?.map((item, index) => {
              return (
                <View key={index}>
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ marginRight: 8 }}>
                      {(item?.isFailed && <AntDesign name="closecircleo" size={18} color={Colors.dust_red_7} />) ||
                        (item?.isProcessed && <AntDesign name="checkcircleo" size={18} color={Colors.polar_green_7} />) || <ActivityIndicator />}
                    </View>
                    {((item.key || item.id) && (
                      <Text style={{ color: (item?.isFailed && Colors.dust_red_7) || (item?.isProcessed && Colors.polar_green_7) || 'black' }}>
                        {item.key || item.id || 'Đang lấy dữ liệu'}
                      </Text>
                    )) ||
                      null}
                  </View>
                  <View style={{ paddingBottom: 8 }}>
                    {item.message && (
                      <Text style={{ color: (item?.isFailed && Colors.dust_red_7) || (item?.isProcessed && Colors.polar_green_7) || 'black' }}>
                        {item.message || ''}
                      </Text>
                    )}
                  </View>
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
