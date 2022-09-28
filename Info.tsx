import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PropTypes, { InferProps } from 'prop-types';
import withTheme, { withThemeProps } from '@hocs/withTheme';

const propTypes = {
  position: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContainer: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  children: PropTypes.node,
  index: PropTypes.any,
  count: PropTypes.any,
  total: PropTypes.any,
  loading: PropTypes.bool,
};

const defaultProps = {
  position: 'bottomLeft',
};

type Props = InferProps<typeof propTypes> & withThemeProps;

function Info(props: Props) {
  const { onPress, position, children, index, count, total, style, styleContainer, loading, themeColor } = props;
  return (
    <View style={[styles.container, position && styles[position], styleContainer]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress || undefined}
        style={[styles.button, styles[`button_${position}`], { backgroundColor: themeColor }, style]}>
        {children || (
          <>
            {(loading && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>
                  <ActivityIndicator color="#fff" size="small" />
                </Text>
                <Text style={styles.text}> Đang tải</Text>
              </View>
            )) || (
              <Text style={styles.text}>
                <FontAwesome name="refresh" size={15} /> {index} - {count} / {total} VĐ
              </Text>
            )}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

Info.propTypes = propTypes;

Info.defaultProps = defaultProps;
const styles: any = StyleSheet.create({
  container: { position: 'absolute' },

  text: {
    fontFamily: 'Roboto_500Medium',
    color: '#fff',
  },
  button: {
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button_bottomLeft: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  button_bottomRight: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  topLeft: {
    top: 20,
    left: 15,
  },
  topRight: {
    top: 20,
    right: 15,
  },
  bottomLeft: {
    bottom: 20,
    left: 0,
  },
  bottomRight: {
    bottom: 20,
    right: 0,
  },
});

export default withTheme(Info);
