import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

import Colors from './Colors';

const propTypes = {
  options: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func,
  value: PropTypes.any,
};

const defaultProps = {
  options: [
    { key: 1, text: 'All' },
    { key: 2, text: 'Select 1' },
    { key: 2, text: 'Select 2' },
    { key: 2, text: 'Select 3' },
  ],
  value: 1,
};

type Props = InferProps<typeof propTypes>;

function Tab(props: Props) {
  const { options, onChange, style, value } = props;

  return (
    <View style={[styles.container, style]}>
      {options?.map((item, index) => {
        return (
          <TouchableOpacity
            style={[styles.item, value === item?.key && { borderBottomWidth: 2, borderBottomColor: '#000' }]}
            key={index}
            onPress={() => onChange && onChange(item)}>
            <View>
              <Text style={{ fontFamily: 'Roboto_500Medium' }}>{item?.text}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

Tab.propTypes = propTypes;
Tab.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', height: 40, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.color_border },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default Tab;
