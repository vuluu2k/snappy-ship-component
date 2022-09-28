import { GestureResponderEvent } from 'react-native';

export type ButtonProps = {
  text?: any;
  textColor?: string | undefined;
  type?: any;
  onPress?: (event: GestureResponderEvent) => void;
  onLayout?: (event: GestureResponderEvent) => void;
  style?: any;
  loading?: Boolean;
  disabled?: boolean;
  icon?: any;
  activeOpacity?: number | undefined;
  position?: string | undefined;
};
