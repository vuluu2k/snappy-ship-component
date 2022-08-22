import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

import Button from './Button';

const propTypes = {
  cols: PropTypes.number.isRequired,
  options: PropTypes.array,
  onChange: PropTypes.func,
  defaultKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  cols: 1,
  options: [
    {
      key: 1,
      text: 'option1',
      onPress: () => console.log('option1'),
    },
    {
      key: 2,
      text: 'option2',
      onPress: () => console.log('option2'),
    },
    {
      key: 3,
      text: 'option3',
      onPress: () => console.log('option3'),
    },
  ],
};

type IProps = InferProps<typeof propTypes>;
type IState = {
  keySelect: string | number | undefined;
};

export default class ButtonListSelect extends Component<IProps, IState> {
  static propTypes: {
    cols: PropTypes.Validator<number>;
    options: PropTypes.Requireable<any[]>;
    onChange: PropTypes.Requireable<(...args: any[]) => any>;
    defaultKey: PropTypes.Requireable<string | number>;
    buttonStyle: PropTypes.Requireable<object>;
    labelStyle: PropTypes.Requireable<object>;
    titleStyle: PropTypes.Requireable<object>;
    style: PropTypes.Requireable<object>;
    title: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    value: PropTypes.Requireable<string | number>;
  };
  static defaultProps: { cols: number; options: { key: number; text: string; onPress: () => void }[] };
  constructor(props: IProps) {
    super(props);
    this.state = { keySelect: props.defaultKey || props.value || undefined };
  }

  handleSelect = (item: any) => {
    const { onChange } = this.props;
    const { keySelect } = this.state;

    if (keySelect === item?.key) {
      if (onChange) onChange({ key: undefined, text: 'chưa chọn' });
      this.handleClearKey();
    } else {
      if (onChange) onChange(item);
      this.setState({ keySelect: item.key });
    }
  };

  handleClearKey = () => this.setState({ keySelect: undefined });

  render() {
    const { cols, options, buttonStyle, labelStyle, titleStyle, style, title } = this.props;
    const { keySelect } = this.state;

    return (
      <>
        <View>
          <Text style={[{ marginBottom: 12, fontWeight: '500' }, titleStyle]}>{title}</Text>
        </View>
        <View style={[cols > 1 && { flexDirection: 'row', flexWrap: 'wrap' }, style]}>
          {options?.map((item, idx) => {
            return (
              <View key={idx} style={{ width: `${100 / cols}%` }}>
                <Button
                  type={`${(keySelect === item?.key && 'sny_active_select') || 'sny_select'}`}
                  style={[{ marginBottom: 12, minWidth: 50 }, cols > 1 && idx % cols != 0 && { marginLeft: 12 }, buttonStyle]}
                  labelStyle={labelStyle}
                  onPress={() => {
                    item?.onPress && item?.onPress();
                    this.handleSelect(item);
                  }}
                  icon={item?.icon}>
                  {item.text}
                </Button>
              </View>
            );
          })}
        </View>
      </>
    );
  }
}

ButtonListSelect.propTypes = propTypes;

ButtonListSelect.defaultProps = defaultProps;
