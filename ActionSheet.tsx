import React from 'react';
import { Text, View, Dimensions, Modal, TouchableHighlight, Animated, ScrollView, Easing, StyleSheet, ActionSheetIOS, Platform } from 'react-native';

function isset(prop: any) {
  return typeof prop !== 'undefined';
}

function merge(target: any, source: any) {
  Object.keys(source).forEach(key => {
    if (Object.prototype.toString.call(source).slice(8, -1) === 'Object') {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}

// styles
const hairlineWidth = StyleSheet.hairlineWidth;
const styles: any = {
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: '#000',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  body: {
    flex: 1,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
  titleBox: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titleText: {
    color: '#757575',
    fontSize: 14,
  },
  messageBox: {
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  messageText: {
    color: '#9a9a9a',
    fontSize: 12,
  },
  buttonBox: {
    height: 50,
    marginTop: hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 0.2,
    borderTopColor: '#bfbfbf',
  },
  buttonText: {
    fontSize: 18,
  },
  cancelButtonBox: {
    height: 50,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
};

const WARN_COLOR = '#FF3B30';
const MAX_HEIGHT = Dimensions.get('window').height * 0.7;

type IProps = {
  styles: object | object[];
  onPress: () => void;
  cancelButtonIndex: any;
};

type IState = {
  visible: boolean;
  sheetAnim: any;
};

class ActionSheetForAndroid extends React.Component<any, IState> {
  static defaultProps = {
    tintColor: '#007AFF',
    buttonUnderlayColor: '#F4F4F4',
    onPress: () => {},
    styles: {},
  };
  scrollEnabled: boolean;
  translateY: number;

  constructor(props: IProps) {
    super(props);
    this.scrollEnabled = false;
    this.translateY = this._calculateHeight(props);
    this.state = {
      visible: false,
      sheetAnim: new Animated.Value(this.translateY),
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   this.translateY = this._calculateHeight(nextProps);
  // }

  componentDidUpdate(prevProps: any, prevState: any) {
    this.translateY = this._calculateHeight(this.props);
  }

  get styles(): any {
    const { styles: styleProps } = this.props;
    const obj: any = {};
    Object.keys(styles).forEach((key: any) => {
      const arr = [styles[key]];
      if (styleProps[key]) {
        arr.push(styleProps[key]);
      }
      obj[key] = arr;
    });
    return obj;
  }

  show = () => {
    this.setState({ visible: true }, () => {
      this._showSheet();
    });
  };

  hide = (index: any) => {
    this._hideSheet(() => {
      this.setState({ visible: false }, () => {
        this.props.onPress(index);
      });
    });
  };

  _cancel = () => {
    const { cancelButtonIndex } = this.props;
    if (isset(cancelButtonIndex)) {
      this.hide(cancelButtonIndex);
    }
  };

  _showSheet = () => {
    Animated.timing(this.state.sheetAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  _hideSheet(callback: () => void) {
    Animated.timing(this.state.sheetAnim, {
      toValue: this.translateY,
      duration: 200,
      useNativeDriver: true,
    }).start(callback);
  }

  _calculateHeight(props: any) {
    const styles = this.styles;
    const getHeight = (name: any) => {
      const style = styles[name][styles[name].length - 1];
      let h = 0;
      ['height', 'marginTop', 'marginBottom'].forEach(attrName => {
        if (typeof style[attrName] !== 'undefined') {
          h += style[attrName];
        }
      });
      return h;
    };

    let height = 0;
    if (props.title) height += getHeight('titleBox');
    if (props.message) height += getHeight('messageBox');
    if (isset(props.cancelButtonIndex)) {
      height += getHeight('cancelButtonBox');
      height += (props.options.length - 1) * getHeight('buttonBox');
    } else {
      height += props.options.length * getHeight('buttonBox');
    }

    if (height > MAX_HEIGHT) {
      this.scrollEnabled = true;
      height = MAX_HEIGHT;
    } else {
      this.scrollEnabled = false;
    }

    return height;
  }

  _renderTitle() {
    const styles = this.styles;
    const { title } = this.props;
    if (!title) return null;
    return <View style={styles.titleBox}>{React.isValidElement(title) ? title : <Text style={styles.titleText}>{title}</Text>}</View>;
  }

  _renderMessage() {
    const { message } = this.props;
    const styles = this.styles;
    if (!message) return null;
    return <View style={styles.messageBox}>{React.isValidElement(message) ? message : <Text style={styles.messageText}>{message}</Text>}</View>;
  }

  _renderCancelButton() {
    const { options, cancelButtonIndex } = this.props;
    if (!isset(cancelButtonIndex)) return null;
    return this._createButton(options[cancelButtonIndex], cancelButtonIndex);
  }

  _createButton(title: any, index: any) {
    const styles = this.styles;
    const { buttonUnderlayColor, cancelButtonIndex, destructiveButtonIndex, tintColor } = this.props;
    const fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor;
    const buttonBoxStyle = cancelButtonIndex === index ? styles.cancelButtonBox : styles.buttonBox;
    return (
      <TouchableHighlight key={index} activeOpacity={1} underlayColor={buttonUnderlayColor} style={buttonBoxStyle} onPress={() => this.hide(index)}>
        {React.isValidElement(title) ? title : <Text style={[styles.buttonText, { color: fontColor }]}>{title}</Text>}
      </TouchableHighlight>
    );
  }

  _renderOptions() {
    const { cancelButtonIndex } = this.props;
    return this.props.options.map((title: any, index: any) => {
      return cancelButtonIndex === index ? null : this._createButton(title, index);
    });
  }

  render() {
    const styles = this.styles;
    const { visible, sheetAnim } = this.state;
    return (
      <Modal visible={visible} animationType="none" transparent onRequestClose={this._cancel}>
        <View style={[styles.wrapper]}>
          <Text style={[styles.overlay]} onPress={this._cancel} />
          <Animated.View style={[styles.body, { height: this.translateY, transform: [{ translateY: sheetAnim }] }]}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 6 }}>
              {this._renderTitle()}
              {this._renderMessage()}
              <ScrollView scrollEnabled={this.scrollEnabled}>{this._renderOptions()}</ScrollView>
            </View>
            {this._renderCancelButton()}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

// ActionSheet for IOS
const optionsSchema = [
  /**
   * a list of button titles (required)
   * @type string[]
   * @example
   *   ['cancel', 'Apple', 'Banana']
   */
  'options',

  /**
   * index of cancel button in options
   * @type int
   */
  'cancelButtonIndex',

  /**
   * index of destructive button in options
   * @type int
   */
  'destructiveButtonIndex',

  /**
   * a title to show above the action sheet
   * @type string
   */
  'title',

  /**
   * a message to show below the title
   * @type string
   */
  'message',

  /**
   * the color used for non-destructive button titles
   * @type string
   * @see http://facebook.github.io/react-native/docs/colors.html
   */
  'tintColor',

  /**
   * The 'callback' function takes one parameter, the zero-based index of the selected item
   * @type (buttonIndex) => void
   * @example
   *   (buttonIndex) => if (buttonIndex === 1) { // do something }
   */
  'onPress',
];

class ActionSheetForIOS extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  show() {
    const props: any = this.props;
    const options: any = {};
    optionsSchema.forEach((name: any) => {
      const value: any = props[name];
      if (typeof value !== 'undefined') {
        options[name] = value;
      }
    });
    const callback = options.onPress;
    delete options.onPress;
    ActionSheetIOS.showActionSheetWithOptions(options, callback);
  }

  render() {
    return null;
  }
}

export const ActionSheetCustom = ActionSheetForAndroid;

let ActionSheet: any;

if (Platform.OS === 'ios') {
  ActionSheet = ActionSheetForIOS;
} else {
  ActionSheet = ActionSheetForAndroid;
}

export default ActionSheet;
