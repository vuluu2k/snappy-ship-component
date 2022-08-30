import React, { Component } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Animated, Easing, View, I18nManager, Text } from 'react-native';

const INDETERMINATE_WIDTH_FACTOR = 0.3;
const BAR_WIDTH_ZERO_POSITION = INDETERMINATE_WIDTH_FACTOR / (1 + INDETERMINATE_WIDTH_FACTOR);

const propTypes = {
  animated: PropTypes.bool,
  borderColor: PropTypes.string,
  borderRadius: PropTypes.number,
  borderWidth: PropTypes.number,
  children: PropTypes.node,
  color: PropTypes.string,
  height: PropTypes.number,
  indeterminate: PropTypes.bool,
  indeterminateAnimationDuration: PropTypes.number,
  onLayout: PropTypes.func,
  progress: PropTypes.number,
  style: PropTypes.any,
  unfilledColor: PropTypes.string,
  width: PropTypes.number,
  useNativeDriver: PropTypes.bool,
  animationConfig: PropTypes.object,
  animationType: PropTypes.oneOf(['decay', 'timing', 'spring']),
};

const defaultProps = {
  animated: true,
  borderRadius: 8,
  borderWidth: 1,
  color: 'rgba(0, 122, 255, 1)',
  height: 6,
  indeterminate: false,
  indeterminateAnimationDuration: 1000,
  progress: 0,
  width: 150,
  useNativeDriver: false,
  animationConfig: { bounciness: 0 },
  animationType: 'spring',
};

type IProps = InferProps<typeof propTypes>;
type IState = {
  animationValue: any;
  width: number;
  progress: any;
};

export default class ProgressBar extends Component<IProps, IState> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props: IProps) {
    super(props);
    const progress: any = Math.min(Math.max(props.progress || 0, 0), 1);
    this.state = {
      width: 0,
      progress: new Animated.Value(props.indeterminate ? INDETERMINATE_WIDTH_FACTOR : progress),
      animationValue: new Animated.Value(BAR_WIDTH_ZERO_POSITION),
    };
  }

  componentDidMount() {
    if (this.props.indeterminate) {
      this.animate();
    }
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.indeterminate !== this.props.indeterminate) {
      if (this.props.indeterminate) {
        this.animate();
      } else {
        Animated.spring(this.state.animationValue, {
          toValue: BAR_WIDTH_ZERO_POSITION,
          useNativeDriver: this.props.useNativeDriver || false,
        }).start();
      }
    }
    if (prevProps.indeterminate !== this.props.indeterminate || prevProps.progress !== this.props.progress) {
      const progress: any = this.props.indeterminate ? INDETERMINATE_WIDTH_FACTOR : Math.min(Math.max(this.props.progress || 0, 0), 1);

      if (this.props.animated) {
        const { animationType, animationConfig } = this.props;
        // @ts-ignore
        Animated[animationType](this.state.progress, {
          ...animationConfig,
          toValue: progress,
          useNativeDriver: this.props.useNativeDriver,
        }).start();
      } else {
        this.state.progress.setValue(progress);
      }
    }
  }

  handleLayout = (event: any) => {
    if (!this.props.width) {
      this.setState({ width: event.nativeEvent.layout.width });
    }
    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  };

  animate() {
    this.state.animationValue.setValue(0);
    Animated.timing(this.state.animationValue, {
      toValue: 1,
      duration: this.props.indeterminateAnimationDuration || 100,
      easing: Easing.linear,
      isInteraction: false,
      useNativeDriver: this.props.useNativeDriver || false,
    }).start(endState => {
      if (endState.finished) {
        this.animate();
      }
    });
  }

  render() {
    const { borderColor, borderRadius, borderWidth, children, color, height, style, unfilledColor, width, progress, ...restProps } = this.props;

    const innerWidth = Math.max(0, width || this.state.width) - (borderWidth || 0) * 2;
    const containerStyle = {
      width,
      borderWidth,
      borderColor: borderColor || color,
      borderRadius,
      overflow: 'hidden',
      backgroundColor: unfilledColor,
    };
    const progressStyle: any = {
      backgroundColor: color,
      height,
      transform: [
        {
          translateX: this.state.animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [innerWidth * -INDETERMINATE_WIDTH_FACTOR, innerWidth],
          }),
        },
        {
          translateX: this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [innerWidth / (I18nManager.isRTL ? 2 : -2), 0],
          }),
        },
        {
          // Interpolation a temp workaround for https://github.com/facebook/react-native/issues/6278
          scaleX: this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.0001, 1],
          }),
        },
      ],
    };

    return (
      // @ts-ignore
      <View style={[containerStyle, style]} onLayout={this.handleLayout} {...restProps}>
        <Animated.View style={progressStyle} />
        {/* @ts-ignore */}
        <View style={{ position: 'absolute', width: width, height: height, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Roboto_500Medium' }}>{!!Math.round((progress || 0) * 100) ? Math.round((progress || 0) * 100) : 0}%</Text>
        </View>

        {children}
      </View>
    );
  }
}
