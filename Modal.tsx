import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal as ModalNative,
  Dimensions,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Easing,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PropTypes, { InferProps } from 'prop-types';
import Modal from 'react-native-modal';

import Colors from './Colors';
import Button from './Button';
import Divider from './Divider';

const color_bg = '#fff';
const color_text = Colors.color_text;

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const propTypes: any = {
  visible: PropTypes.bool,
  styleContainerModal: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContentModal: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContentChildren: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleModal: PropTypes.node,
  children: PropTypes.node,
  onDismiss: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onCancelText: PropTypes.node,
  onOkText: PropTypes.node,
  supportKeyboard: PropTypes.bool,
  hiddenTitle: PropTypes.bool,
  disabledOk: PropTypes.bool,
};

const defaultProps: any = {
  visible: false,
  styleContainerModal: {},
  styleContentModal: {},
  titleModal: 'SnappyExpress',
  supportKeyboard: true,
  hiddenTitle: false,
};

type IProps = InferProps<typeof propTypes>;

const ModalChildren = ({
  children,
  styleContentModal,
  titleModal,
  onDismiss,
  onOk,
  onCancel,
  onCancelText,
  onOkText,
  loadingOk,
  disabledOk,
  supportKeyboard,
  hiddenTitle,
  styleContentChildren,
  useFast,
}: IProps) => {
  return (
    <KeyboardAvoidingView
      enabled={supportKeyboard}
      behavior={'position'}
      keyboardVerticalOffset={useFast ? -20 : -30}
      contentContainerStyle={styles.keyboard_view}>
      <View style={[styles.content_modal, styleContentModal]}>
        {!hiddenTitle && (
          <>
            <View style={styles.d_flex}>
              <TouchableOpacity style={styles.view_divider} onPress={onDismiss}>
                <View style={styles.divider_close} />
              </TouchableOpacity>
            </View>
            <View style={styles.container_icon_close}>
              <AntDesign name="close" size={20} color="black" style={styles.icon_close} onPress={onDismiss} />
              {titleModal && <Text style={styles.text_title_modal}>{titleModal}</Text>}
            </View>
            <Divider style={{ marginVertical: 0 }} />
          </>
        )}
        <View>
          <View style={[{ paddingHorizontal: 16, paddingVertical: 12 }, styleContentChildren]}>{children}</View>
          {((onOk || onCancel) && (
            <View style={[styles.d_flex, { paddingHorizontal: 16 }]}>
              {(
                <Button
                  size="lg"
                  style={styles.button_modal}
                  onPress={() => {
                    onCancel && onCancel();
                    onDismiss();
                  }}>
                  {onCancelText || 'Quay lại'}
                </Button>
              ) || null}
              {(onOk && (
                <Button style={[styles.button_modal]} disabled={disabledOk} size="lg" type="primary" loading={loadingOk} onPress={onOk}>
                  {onOkText || 'Xác nhận'}
                </Button>
              )) ||
                null}
            </View>
          )) ||
            null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default class SnyModal extends Component<IProps> {
  static defaultProps: any;
  static propTypes: any;
  animatedValue: Animated.Value;
  constructor(props: IProps) {
    super(props);
    this.animatedValue = new Animated.Value(0);
  }

  animateColor = () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: Platform.OS === 'ios' ? 60 : 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  revertAnimatedColor = (callback: () => void) => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: Platform.OS === 'ios' ? 20 : 100,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start(callback);
  };

  render() {
    const { styleContainerModal, onDismiss, visible, useFast } = this.props;

    const interpolateColor = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)'],
    });

    if (useFast) {
      return (
        <Modal
          hideModalContentWhileAnimating
          statusBarTranslucent
          onBackButtonPress={onDismiss}
          onBackdropPress={onDismiss}
          onSwipeComplete={onDismiss}
          onModalHide={onDismiss}
          swipeThreshold={100}
          backdropTransitionOutTiming={0}
          swipeDirection="down"
          propagateSwipe
          isVisible={visible}
          style={[styles.container_fast, styleContainerModal]}>
          <ModalChildren {...this.props} />
        </Modal>
      );
    }

    return (
      <ModalNative
        animationType="slide"
        statusBarTranslucent
        transparent
        hardwareAccelerated
        onRequestClose={() => {
          this.revertAnimatedColor(onDismiss);
        }}
        onShow={() => {
          this.animateColor();
        }}
        visible={visible}
        onDismiss={() => {
          if (Platform.OS === 'android') this.revertAnimatedColor(onDismiss);
        }}>
        <Animated.View style={[styles.style_modal, styleContainerModal, { backgroundColor: interpolateColor }]}>
          <TouchableOpacity
            style={{ height: windowHeight * 0.2 }}
            onPress={() => {
              this.revertAnimatedColor(onDismiss);
            }}></TouchableOpacity>
          <ModalChildren {...this.props} />
        </Animated.View>
      </ModalNative>
    );
  }
}

SnyModal.propTypes = propTypes;

SnyModal.defaultProps = defaultProps;

const styles = StyleSheet.create({
  d_flex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  container_fast: {
    marginHorizontal: 0,
    justifyContent: 'flex-end',
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },

  text_title_modal: {
    color: color_text,
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    paddingHorizontal: 24,
    paddingVertical: 9,
    textAlign: 'center',
    width: '100%',
  },
  style_modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  view_divider: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  divider_close: { height: 6, width: 40, borderRadius: 100, backgroundColor: Colors.color_border },

  content_modal: {
    backgroundColor: color_bg,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 12,
  },

  keyboard_view: { paddingBottom: 40, backgroundColor: '#fff', borderTopLeftRadius: 10, borderTopRightRadius: 10 },

  icon_close: { textAlign: 'left', position: 'absolute', right: 24, zIndex: 10 },
  container_icon_close: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, position: 'relative' },
  button_modal: {
    minWidth: windowWidth / 2 - 20,
  },
});
