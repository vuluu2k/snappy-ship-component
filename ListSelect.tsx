import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { AntDesign } from '@expo/vector-icons';

import Colors from './Colors';

const screen = Dimensions.get('screen');

const propTypes = {
  title: PropTypes.node,
  header: PropTypes.node,
  //options:array -> object in array with key, text, icon, subText, icon, onPress, disabled, arrowIcon, content
  options: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLabelTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleOptions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLabelOption: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPressTitle: PropTypes.func,
  useFlatList: PropTypes.bool,
};

const defaultProps = {
  title: undefined,
  options: [
    { key: 1, text: 'option1', onPress: () => console.log('option1') },
    { key: 2, text: 'option2', onPress: () => console.log('option2') },
    { key: 3, text: 'option3', onPress: () => console.log('option3') },
  ],
  useFlatList: false,
};

type IProps = InferProps<typeof propTypes>;
type IState = {};

export default class ListSelect extends Component<IProps, IState> {
  static propTypes: {
    title: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    header: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    //options:array -> object in array with key, text, icon, subText, icon, onPress, disabled, arrowIcon, content
    options: PropTypes.Requireable<any[]>;
    style: PropTypes.Requireable<object>;
    styleTitle: PropTypes.Requireable<object>;
    styleLabelTitle: PropTypes.Requireable<object>;
    styleOptions: PropTypes.Requireable<object>;
    styleLabelOption: PropTypes.Requireable<object>;
    onPressTitle: PropTypes.Requireable<(...args: any[]) => any>;
    useFlatList: PropTypes.Requireable<boolean>;
  };
  static defaultProps: { title: undefined; options: { key: number; text: string; onPress: () => void }[]; useFlatList: boolean };

  renderItem = ({ item, idx }: { item: any; idx: number }) => {
    const { styleOptions, styleLabelOption } = this.props;

    const { content, subText, text, icon, textArrow } = item;
    const ComponentIcon = icon?.component;

    return (
      <TouchableOpacity
        key={idx}
        disabled={!item?.onPress || item?.disabled}
        onPress={() => item?.onPress(item)}
        style={[item?.icon && styles.container, { backgroundColor: '#fff' }]}>
        {item?.icon && (
          <View style={{ paddingLeft: 16 }}>{(ComponentIcon && <ComponentIcon {...item?.icon} size={item?.icon?.size || 20} />) || item?.icon}</View>
        )}
        <View style={[styles.containerOption, styleOptions, item?.styleOption, icon && { marginLeft: 16 }]}>
          <View style={[!icon && { paddingLeft: 16 }]}>
            {content || <Text style={[styles.text_options, styleLabelOption]}>{text}</Text>}
            {subText && <Text style={[item?.styleSubText, { color: Colors.gray_4 }]}>{subText}</Text>}
          </View>

          <View style={{ paddingRight: 16, flexDirection: 'row', alignItems: 'center' }}>
            {!!textArrow && <Text style={{ color: Colors.gray_4 }}>{textArrow || ''}</Text>}
            {item?.arrowIcon || <AntDesign name="right" size={16} color={Colors.gray_2} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { title, options, styleLabelTitle, styleTitle, onPressTitle, header, style, useFlatList } = this.props;
    return (
      <View style={[style]}>
        {title && (
          <TouchableOpacity onPress={onPressTitle || undefined} disabled={!onPressTitle}>
            <View style={[styles.containerTitle, styleTitle]}>
              <Text style={[styles.title, styleLabelTitle]}>{title}</Text>
            </View>
          </TouchableOpacity>
        )}
        {header && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.daybreak_blue_1 }}>
            <Text style={[styles.text_options, { color: '#2A2565', fontFamily: 'Roboto_700Bold' }]}>{header}</Text>
          </View>
        )}
        {(useFlatList && (
          // @ts-ignore
          <FlatList data={options} renderItem={this.renderItem} showsVerticalScrollIndicator={false} keyExtractor={(_, index) => `key-${index}`} />
        )) ||
          options?.map((item, idx) => this.renderItem({ item, idx }))}
      </View>
    );
  }
}

ListSelect.propTypes = propTypes;

ListSelect.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', flex: 1 },
  containerTitle: { marginTop: 8 },
  title: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: Colors.gray_4,
    fontSize: 12,
    fontFamily: 'Roboto_700Bold',
  },
  containerOption: {
    flex: 1,
    paddingVertical: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.gray_1,
    borderBottomWidth: 1,
  },
  text_options: {
    fontSize: 14,
    lineHeight: 22,
  },
});
