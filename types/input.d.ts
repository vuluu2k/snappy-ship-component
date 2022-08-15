export type InputProps = {
  secureTextEntry: boolean;
  value: any;
  autoFocus: any;
  autoCapitalize: any;
  keyboardType: any;
  returnKeyType: any;
  blurOnSubmit: any;
  iconTitle?: any;
  title: string | undefined;
  placeholder: string | undefined;
  numberOfLines: any;

  onChange: () => void;
  onChangeText: () => void;
  disabled: boolean;
  onSubmitEditing: () => void;
};
