import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import PropTypes, { InferProps } from 'prop-types';
import { Entypo, Feather, Fontisto, Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';

import IconSnappy from '@components/IconSnappy';
import { takePhotoFromLibrary, uploadImage } from '@utils/services';
import { Notification } from '@components/SnyNotification';
import Colors from './Colors';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const textRequestTakePictureError = 'Quá trình xử lý ảnh bị lỗi, Vui lòng thử lại';

const propTypes = {
  type: PropTypes.string,
  onClose: PropTypes.func,
  onTakePhoto: PropTypes.func,
  multiple: PropTypes.bool,
  disabledLibrary: PropTypes.bool
};
const defaultProps = {
  type: 'back',
};

type IProps = InferProps<typeof propTypes>;

function SnyCamera(props: IProps) {
  const { type: typeProp, onClose, onTakePhoto, multiple,disabledLibrary } = props;
  const [type, setType] = useState<CameraType>(typeProp === 'back' ? CameraType.back : CameraType.front);
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isViewImage, setIsViewImage] = useState<boolean>(false);
  const [isUploadImage, setIsUploadImage] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  // const [photoWasTakeInPhone, setPhotoWasTakeInPhone] = useState<any>([]);
  const [photoWasTake, setPhotoWasTake] = useState<any>([]);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function toggleFlashMode(type: string) {
    switch (type) {
      case 'on':
        setFlashMode(FlashMode.on);
        break;
      case 'auto':
        setFlashMode(FlashMode.auto);
        break;
      case 'torch':
        setFlashMode(FlashMode.torch);
        break;
      default:
        setFlashMode(FlashMode.off);
        break;
    }
  }

  function onShowViewImage() {
    setIsViewImage(true);
  }

  function onHiddenViewImage() {
    setIsViewImage(false);
  }

  function onEmptyImage() {
    setPhotoWasTake([]);
  }

  const takePictureFromLibrary = async () => {
    if(disabledLibrary) return Notification.error('Không cho phép truy cập vào thư viện')

    const photo: any = await takePhotoFromLibrary();

    if (photo?.uri) {
      handleUploadImage(photo, true);
      onClose;
    } else {
      Notification.error(textRequestTakePictureError);
    }
  };

  const takePicture = async () => {
    if (!isPlaying) return;
    if (cameraRef) {
      const photoTake: { uri: string } = await cameraRef?.current?.takePictureAsync({
        quality: 0.3,
      });

      if (photoTake?.uri) {
        setIsPlaying(false);
        handleUploadImage(photoTake);
        cameraRef?.current?.pausePreview();
      } else {
        Notification.error(textRequestTakePictureError);
      }
    }
  };

  const takeMorePicture = () => {
    cameraRef?.current?.resumePreview();
    setIsPlaying(true);
    setIsUploadImage(false);
    setUploadResult(null);
  };

  const onResumeCamera = () => {
    cameraRef?.current?.resumePreview();
    photoWasTake.pop();
    setPhotoWasTake(photoWasTake);
    setIsPlaying(true);
    setIsUploadImage(false);
    setUploadResult(null);
  };

  const handleUploadImage = (photo: any, isLibrary?: boolean) => {
    setIsUploadImage(true);
    setUploadResult(null);
    const errorObj = { success: false, message: 'Đã có lỗi tải ảnh lên!' };

    uploadImage(
      photo,
      (resData: any) => {
        setIsUploadImage(false);
        if (resData.success) {
          setPhotoWasTake(photoWasTake?.concat([resData.data]));
          if (isLibrary && !multiple) {
            onTakePhoto && onTakePhoto(resData.data);
            onClose;
          }
        } else setUploadResult(errorObj);
      },
      () => {
        setIsUploadImage(false);
        setUploadResult(errorObj);
      }
    );
  };

  const handleSubmit = () => {
    const photoSubmit = multiple ? photoWasTake : photoWasTake[0];
    onTakePhoto && onTakePhoto(photoSubmit);
    onClose;
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={!isViewImage} backgroundColor="transparent" barStyle={!isViewImage ? 'light-content' : 'dark-content'} />

      {(!isViewImage && (
        <Camera ref={cameraRef} style={styles.camera} type={type} flashMode={flashMode}>
          {/* View Information */}
          {/* Actions */}
          {/* Close */}
          <TouchableOpacity onPress={onClose || undefined} style={styles.close}>
            <View style={styles.close_icon}>
              <Ionicons name="ios-close" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* FlashMode */}
          <TouchableOpacity onPress={() => toggleFlashMode(flashMode === 'off' ? 'torch' : 'off')} style={styles.flashMode}>
            <Ionicons name={flashMode === 'off' ? 'flash-off' : 'flash'} size={20} color="#fff" />
          </TouchableOpacity>

          {/* Take Picture */}
          {(isPlaying && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonLeft} onPress={multiple ? onShowViewImage : takePictureFromLibrary}>
                {multiple ? (
                  (photoWasTake?.length > 0 && (
                    <View>
                      <Image
                        source={{ uri: photoWasTake[photoWasTake?.length - 1] }}
                        style={{
                          width: 48,
                          height: 48,
                        }}
                      />
                      <View style={styles.number_multiple_image}>
                        <Text style={[styles.text_take]}>{photoWasTake?.length}</Text>
                      </View>
                    </View>
                  )) || (
                    <View style={styles.no_image}>
                      <Text style={{ color: 'white' }}>No image</Text>
                    </View>
                  )
                ) : (
                  <View style={styles.toggleType}>
                    <IconSnappy name="image-camera" size={26} color="white" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonCenter} onPress={takePicture}>
                <View style={styles.takeCircleInner}>
                  <View style={styles.takeCircleOuter}></View>
                </View>
              </TouchableOpacity>

              {!multiple && (
                <TouchableOpacity style={styles.buttonRight} onPress={toggleCameraType}>
                  <View style={styles.toggleType}>
                    <IconSnappy name="refresh-camera" color="white" size={26} />
                  </View>
                </TouchableOpacity>
              )}

              {multiple && (
                <View style={[styles.buttonRight, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                  <TouchableOpacity onPress={toggleCameraType}>
                    <View style={styles.toggleTypeSmall}>
                      <IconSnappy name="refresh-camera" color="white" size={20} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={takePictureFromLibrary}>
                    <View style={styles.toggleType}>
                      <IconSnappy name="image-camera" color="white" size={26} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )) || (
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonLeft} onPress={onResumeCamera}>
                  <Text style={styles.text_take}>Chụp lại</Text>
                </TouchableOpacity>
                {multiple && (
                  <TouchableOpacity style={styles.buttonCenter} onPress={takeMorePicture}>
                    <Text style={styles.text_take}>Chụp thêm</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.buttonRight} onPress={multiple ? onShowViewImage : handleSubmit}>
                  <Text style={styles.text_take}>{multiple ? 'Xem ảnh đã chụp' : 'Sử dụng ảnh'}</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          )}
        </Camera>
      )) || (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={onHiddenViewImage}>
                <Feather name="chevron-left" color="#121008" size={22} />
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    color: Colors.gray_5,
                    fontSize: 16,
                    fontFamily: 'Roboto_700Bold',
                  }}>
                  Ảnh đã chụp
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onEmptyImage} style={{ paddingRight: 16 }}>
              <Text style={{ fontFamily: 'Roboto_500Medium', color: Colors.color_key }}>Xoá tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {photoWasTake.length > 0 && (
              <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {photoWasTake.map((item: any, idx: number) => (
                  <ImageAction key={idx} url={item} onDelete={() => setPhotoWasTake((prev: any) => prev.filter((image: string) => image !== item))} />
                ))}
              </View>
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={onHiddenViewImage}>
              <Text style={styles.text_take}>Chụp thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={handleSubmit}>
              <Text style={styles.text_take}>Tải ảnh lên</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* Modal */}

      <Modal
        statusBarTranslucent
        backdropTransitionOutTiming={0}
        isVisible={!!isUploadImage || !!uploadResult}
        animationIn="fadeIn"
        animationOut="fadeOut"
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight + 100}
        onBackButtonPress={() => {
          onClose && onClose();
          setIsUploadImage(false);
          setUploadResult(null);
        }}>
        {(!uploadResult && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 100 }}>
            <ActivityIndicator color="#fff" />
            <Text style={[styles.text_take, { marginLeft: 8 }]}>Đang xử lý ảnh</Text>
          </View>
        )) || (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 100 }}>
            <Text>Lỗi: {uploadResult?.message}</Text>
            <TouchableOpacity
              onPress={onResumeCamera}
              style={{ backgroundColor: 'rgba(0,0,0,.6)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 }}>
              <Text style={styles.text_take}>Chụp lại</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

const ImageAction = (props: any) => {
  const { url, onDelete } = props;
  const [isDelete, setIsDelete] = useState<boolean>(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setIsDelete(!isDelete)}>
        <Image
          source={{ uri: url }}
          style={{
            width: deviceWidth / 3 - 4,
            height: deviceWidth / 3 - 4,
            marginBottom: 4,
            marginHorizontal: 2,
          }}
        />
      </TouchableOpacity>
      {isDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={{
            position: 'absolute',
            height: deviceWidth / 3 - 2,
            width: deviceWidth / 3 - 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,.6)',
          }}>
          <IconSnappy name="trash" size={26} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  close: { position: 'absolute', top: Constants.statusBarHeight + 20, left: 20, width: 40, height: 40, zIndex: 10 },
  close_icon: {
    backgroundColor: 'rgba(0,0,0,.6)',
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  flashMode: { position: 'absolute', top: Constants.statusBarHeight + 20, right: 10, width: 40, height: 40, zIndex: 10 },

  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,.6)',
    bottom: 0,
  },

  buttonLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  buttonCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  buttonRight: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },

  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  takeCircleInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  takeCircleOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },

  toggleType: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toggleTypeSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text_take: {
    fontFamily: 'Roboto_500Medium',
    color: '#fff',
  },

  number_multiple_image: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(0,0,0,.6)',
    minWidth: 20,
    minHeight: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  no_image: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

SnyCamera.propTypes = propTypes;
SnyCamera.defaultProps = defaultProps;

export default SnyCamera;
