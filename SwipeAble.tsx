import React from 'react';
import { Animated, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { PanGestureHandler, State, RectButton } from 'react-native-gesture-handler';
import PropTypes, { InferProps } from 'prop-types';
import Colors from './Colors';

const propTypes = {
  onOpenRightOption: PropTypes.func,
  onOpenLeftOption: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  rightTitle: PropTypes.string,
  leftTitle: PropTypes.string,
  disabled: PropTypes.bool,
  children:PropTypes.node
};

const defaultProps = {
  disabled: false,
};

const USE_NATIVE_DRIVER = true;
const RATIO = 3;

type IProps = InferProps<typeof propTypes>;

export default class SwipeAble extends React.Component<IProps> {
  static propTypes = {};
  static defaultProps = {};
  private _width: number;
  private _dragX: Animated.Value;
  private _transX: Animated.AnimatedInterpolation;
  private _showLeftAction: Animated.AnimatedInterpolation;
  private _showRightAction: Animated.AnimatedInterpolation;
  private _onGestureEvent: (...args: any[]) => void;
  constructor(props: IProps) {
    super(props);
    this._width = 0;
    this._dragX = new Animated.Value(0);
    this._transX = this._dragX.interpolate({
      inputRange: [0, RATIO],
      outputRange: [0, 1],
    });
    this._showLeftAction = this._dragX.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0, 0, 1],
    });
    this._showRightAction = this._dragX.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [1, 0, 0],
    });
    this._onGestureEvent = Animated.event([{ nativeEvent: { translationX: this._dragX } }], { useNativeDriver: USE_NATIVE_DRIVER });
  }

  _onHandlerStateChange = (event: any) => {
    const { onOpenRightOption, onOpenLeftOption } = this.props;

    if (event.nativeEvent.oldState === State.ACTIVE) {
      const dragToss = 0.05;
      const endOffsetX = event.nativeEvent.translationX + dragToss * event.nativeEvent.velocityX;

      let toValue = 0;
      if (endOffsetX > this._width * 0.5) {
        toValue = this._width * RATIO;
      } else if (endOffsetX < -this._width * 0.5) {
        toValue = -this._width * RATIO;
      }

      Animated.timing(this._dragX, {
        toValue,
        useNativeDriver: USE_NATIVE_DRIVER,
        duration: 300,
      }).start(() => {
        if (toValue < 0) {
          onOpenRightOption && onOpenRightOption();
        } else if (toValue > 0) {
          onOpenLeftOption && onOpenLeftOption();
        }
        setTimeout(this._reset, 500);
      });
    }
  };

  _onLayout = (event: any) => {
    this._width = event.nativeEvent.layout.width;
  };

  _reset = () => {
    Animated.spring(this._dragX, {
      toValue: 0,
      useNativeDriver: USE_NATIVE_DRIVER,
      tension: 100,
      friction: 1000,
    }).start();
  };

  render() {
    const { children, style, rightTitle, leftTitle, disabled } = this.props;
    if (disabled) return children;
    return (
      <View style={style || {}}>
        <Animated.View style={[styles.rowAction, { opacity: this._showLeftAction }]}>
          <RectButton style={[styles.rowAction, styles.leftAction]} onPress={this._reset}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" />
              </View>
              <View>
                <Text style={styles.actionButtonText}>{leftTitle || ''}</Text>
              </View>
            </View>
          </RectButton>
        </Animated.View>
        <Animated.View style={[styles.rowAction, { opacity: this._showRightAction }]}>
          <RectButton style={[styles.rowAction, styles.rightAction]} onPress={this._reset}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" />
              </View>
              <View>
                <Text style={styles.actionButtonText}>{rightTitle || ''}</Text>
              </View>
            </View>
          </RectButton>
        </Animated.View>
        <PanGestureHandler
          {...this.props}
          activeOffsetX={[-10, 10]}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <Animated.View
            style={{
              backgroundColor: 'white',
              transform: [{ translateX: this._transX }],
            }}
            onLayout={this._onLayout}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

SwipeAble.propTypes = propTypes;
SwipeAble.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rectButton: {
    flex: 1,
    height: 60,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  rowAction: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftAction: {
    backgroundColor: Colors.dust_red_7,
  },
  rightAction: {
    backgroundColor: Colors.polar_green_8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonDelimiter: {
    height: 1,
    backgroundColor: '#999',
  },
  buttonText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  infoButton: {
    width: 40,
    height: 40,
  },
  infoButtonBorders: {
    borderColor: '#467AFB',
    borderWidth: 2,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 10,
  },
  infoButtonText: {
    color: '#467AFB',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
});
