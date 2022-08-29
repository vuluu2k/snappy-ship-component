import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, StatusBar, TouchableOpacity, Animated, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';

import IconSnappy from '@components/IconSnappy';
import Colors from './Colors';
import Badge from './Badge';
import Popup from './Popup';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

type IProps = {
  onScan: (event: any) => void;
  onClose: () => void;
  onOkWarn?: () => void;
  children?: any;
  textWarn?: string;
  isWarn?: boolean;
  isScan?: boolean;
  countData?: number;
  textSuccess?: string;
  isSuccess?: boolean;
  onOkSuccess?: () => void;
};

export default function SnyBarCodeScanner(props: IProps) {
  const { onScan, onClose, children, textWarn, isWarn, onOkWarn, isScan, countData, textSuccess, isSuccess, onOkSuccess } = props;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [dataProcess, setDataProcess] = useState<string | null>(null);
  const [screen, setScreen] = useState<string>('scan');
  const [sizeQrCode, setSizeQrCode] = useState<any>({ width: 0, height: 0 });
  const lineAnim = useRef(new Animated.Value(0)).current;

  const onLineLayout = (event: any) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    setSizeQrCode({ width: width, height: height });
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status }: any = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  useEffect(() => {
    handleAnimationLine();
  }, []);

  const handleAnimationLine = () => {
    lineAnim.setValue(0);
    Animated.timing(lineAnim, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start(() => handleAnimationLine());
  };

  const transformLine = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, sizeQrCode?.height - 2],
  });

  const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
    onScan && onScan(data);
    setDataProcess(data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container_permission}>
        <Feather name="camera" size={30} color="black" />
        <Text style={styles.text_permission}>Ứng dụng yêu cầu quyền truy cập Camera</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container_permission}>
        <Feather name="camera-off" size={30} color="black" />
        <Text style={styles.text_permission}>Ứng dụng chưa được cho phép truy cập Camera</Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.main]}>
        <StatusBar
          translucent={screen === 'scan'}
          backgroundColor={screen === 'scan' ? 'transparent' : '#fff'}
          barStyle={screen === 'scan' ? 'light-content' : 'dark-content'}
        />

        {(screen === 'scan' && (
          <BarCodeScanner onBarCodeScanned={isScan || isWarn || isSuccess ? undefined : handleBarCodeScanned || undefined} style={[styles.container]}>
            <View style={styles.layerTop}></View>
            <View style={styles.layerCenter}>
              <View style={styles.layerLeft} />
              <View style={styles.focused} onLayout={onLineLayout}>
                <EdgeQRCode position="topRight" />
                <EdgeQRCode position="topLeft" />
                <Animated.View
                  style={[
                    {
                      transform: [{ translateY: transformLine }],
                    },
                    styles.lineAnim,
                  ]}
                />
                <EdgeQRCode position="bottomRight" />
                <EdgeQRCode position="bottomLeft" />
              </View>
              <View style={styles.layerRight} />
            </View>
            <View style={styles.layerBottom} />
          </BarCodeScanner>
        )) ||
          (screen === 'data' && (
            <SafeAreaView style={{ backgroundColor: '#fff' }}>
              <View style={{ width: deviceWidth, flex: 1, backgroundColor: Colors.color_background }}>
                <ScrollView>{children}</ScrollView>
              </View>
            </SafeAreaView>
          ))}

        {/* Actions */}
        {screen === 'scan' && (
          <TouchableOpacity onPress={onClose} style={styles.close}>
            <View
              style={{ backgroundColor: 'rgba(0,0,0,.6)', width: 22, height: 22, alignItems: 'center', justifyContent: 'center', borderRadius: 13 }}>
              <Ionicons name="ios-close" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.bottomAction}>
          <TouchableOpacity onPress={() => setScreen('scan')}>
            <View style={styles.bottomButtonAction}>
              <IconSnappy name="scan-barcode" color="#fff" size={20} />
              <Text style={styles.bottomTextAction}>Quét mã</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('data')}>
            <View style={styles.bottomButtonAction}>
              <View>
                <IconSnappy name="package-outline" color="#fff" size={20} />
                {(countData && <Badge style={{ position: 'absolute', top: -8, right: -8 }} text={countData || 0} />) || null}
              </View>
              <Text style={styles.bottomTextAction}>Dữ liệu</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Popup visible={isWarn} message={textWarn || 'Cảnh báo Snappy'} type="warn" onOk={onOkWarn} />
      <Popup visible={isSuccess} message={textSuccess} type="success" onOk={onOkSuccess} />

      <Modal
        statusBarTranslucent
        backdropTransitionOutTiming={0}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isScan}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight + 100}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 100 }}>
          <ActivityIndicator color="#fff" />
          <Text style={[{ marginLeft: 8, fontFamily: 'Roboto_500Medium', color: 'white' }]}>Đang xử lý dữ liệu {dataProcess}</Text>
        </View>
      </Modal>
    </>
  );
}

const EdgeQRCode = ({ position }: { position: string }) => {
  const edgeWidth = 20;
  const edgeHeight = 20;
  const edgeColor = '#FFF';
  const edgeBorderWidth = 4;
  const edgeRadius = 0;

  const defaultStyle = {
    width: edgeWidth,
    height: edgeHeight,
    borderColor: edgeColor,
  };
  const edgeBorderStyle: any = {
    topRight: {
      borderRightWidth: edgeBorderWidth,
      borderTopWidth: edgeBorderWidth,
      borderTopRightRadius: edgeRadius,
      top: edgeRadius,
      right: edgeRadius,
    },
    topLeft: {
      borderLeftWidth: edgeBorderWidth,
      borderTopWidth: edgeBorderWidth,
      borderTopLeftRadius: edgeRadius,
      top: edgeRadius,
      left: edgeRadius,
    },
    bottomRight: {
      borderRightWidth: edgeBorderWidth,
      borderBottomWidth: edgeBorderWidth,
      borderBottomRightRadius: edgeRadius,
      bottom: edgeRadius,
      right: edgeRadius,
    },
    bottomLeft: {
      borderLeftWidth: edgeBorderWidth,
      borderBottomWidth: edgeBorderWidth,
      borderBottomLeftRadius: edgeRadius,
      bottom: edgeRadius,
      left: edgeRadius,
    },
  };
  return <View style={[defaultStyle, styles[position + 'Edge'], edgeBorderStyle[position]]} />;
};

const opacity = 'rgba(0, 0, 0, .6)';
const styles: any = StyleSheet.create({
  container_permission: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text_permission: { fontFamily: 'Roboto_500Medium', marginTop: 8 },

  // action
  close: { position: 'absolute', top: Constants.statusBarHeight + 20, left: 20, width: 40, height: 40 },
  bottomAction: {
    backgroundColor: 'rgba(0,0,0,.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90,
    position: 'absolute',
    width: deviceWidth,
    bottom: 0,
    left: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  bottomButtonAction: { alignItems: 'center', width: deviceWidth / 2 },
  bottomTextAction: { color: 'white', fontSize: 13, lineHeight: 22, fontFamily: 'Roboto_500Medium', marginTop: 4 },

  // layout
  main: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    flexDirection: 'column',
    width: deviceHeight,
    height: deviceHeight / 2,
  },

  layerTop: {
    flex: 1,
    backgroundColor: opacity,
  },

  layerCenter: {
    flex: 1,
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 1,
    position: 'relative',
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 4,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },

  layerBottom: {
    flex: 1,
    backgroundColor: opacity,
  },

  // edge
  topLeftEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRightEdge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeftEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bottomRightEdge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  lineAnim: { height: 2, backgroundColor: '#fff' },

  // modal

  content_modal: {
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_modal: {
    color: Colors.gray_5,
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    marginVertical: 12,
  },
  btn_ok: {
    padding: 8,
    marginTop: 10,
    backgroundColor: 'red',
    minWidth: 120,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
