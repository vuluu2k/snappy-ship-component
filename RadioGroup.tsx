import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

import Radio from './Radio';

const propTypes = {
  options: PropTypes.array,
  defaultKey: PropTypes.node,
  onChange: PropTypes.func,
  onPress: PropTypes.func,
  children: PropTypes.node,
};

const defaultProps = {
  options: [
    { key: 1, text: 'option1', onPress: () => console.log('option1') },
    { key: 2, text: 'option2', onPress: () => console.log('option1') },
    { key: 3, text: 'option3', onPress: () => console.log('option1') },
    { key: 4, text: 'option4', onPress: () => console.log('option1') },
  ],
};

type IProps = InferProps<typeof propTypes>;

const RadioGroup = (props: IProps) => {
  const { options, children, onChange, defaultKey } = props;
  const [keySelect, setKeySelect] = useState(defaultKey || undefined);

  const handleOnChange = (item: any) => {
    if (onChange) onChange(item);
    setKeySelect(item?.key);
  };

  return (
    <View>
      {children ||
        options?.map((item: any, idx: number) => (
          <TouchableOpacity onPress={() => handleOnChange(item)} key={idx} style={[{ marginBottom: 12 }]}>
            <Radio checked={keySelect === item?.key} label={item?.text} />
          </TouchableOpacity>
        ))}
    </View>
  );
};

RadioGroup.propTypes = propTypes;

RadioGroup.defaultProps = defaultProps;

export default RadioGroup;
