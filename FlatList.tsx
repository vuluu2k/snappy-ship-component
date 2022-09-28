import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList as FlatListNative, Dimensions } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import Lottie from 'lottie-react-native';

import Empty from './Empty';
import { LoadMore } from '@components/Lottie';
import Colors from './Colors';
import { changeColorKeyPath } from '@utils';
import { getThemeColor } from '@hocs/withTheme';

const deviceWidth = Dimensions.get('window').width;

const propTypes: any = {
  loadingModal: PropTypes.bool,
  loading: PropTypes.bool,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  keyboardShouldPersistTaps: PropTypes.string,
  data: PropTypes.array,
  keyExtractor: PropTypes.func,
  renderItem: PropTypes.func,
  onScroll: PropTypes.func,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  isNative: PropTypes.bool,
};

const defaultProps: any = {
  loadingModal: false,
  loading: false,
  refreshing: false,
  keyboardShouldPersistTaps: 'handled',
  data: [],
  hasMore: true,
  ListFooterComponent: <LoadMore />,
  keyExtractor: (_: any, index: any) => `key-${index}`,
};

type IProps = InferProps<typeof propTypes>;

const FlatList = React.forwardRef((props: IProps, ref: any) => {
  const {
    loadingModal,
    loading,
    refreshing,
    onRefresh,
    keyboardShouldPersistTaps,
    data,
    keyExtractor,
    ListFooterComponent,
    renderItem,
    onScroll,
    onLoadMore,
    hasMore,
    ItemSeparatorComponent,
    showsVerticalScrollIndicator,
    ListHeaderComponent,
  } = props;
  const [themeColor, setThemeColor] = useState<string>('#2A2565');

  useEffect(() => {
    async function getColor() {
      const color = await getThemeColor();
      if (color) setThemeColor(color);
    }

    getColor();
  }, []);

  return (
    <>
      {((loadingModal || (data?.length === 0 && loading)) && (
        <View style={styles.loading}>
          <Lottie
            colorFilters={changeColorKeyPath(require('../../assets/animations/waiting.json'), themeColor)}
            source={require('../../assets/animations/waiting.json')}
            style={{ width: deviceWidth / 3 }}
            autoPlay
            loop
          />
        </View>
      )) ||
        (data?.length > 0 && (
          <FlatListNative
            ref={ref}
            {...props}
            ListHeaderComponent={ListHeaderComponent}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator || false}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            renderItem={renderItem}
            onRefresh={onRefresh}
            data={data}
            keyExtractor={keyExtractor}
            ListFooterComponent={data?.length !== 0 && loading && hasMore && ListFooterComponent}
            ItemSeparatorComponent={ItemSeparatorComponent}
            refreshing={refreshing}
            onEndReached={(!loading && onLoadMore) || (() => {})}
            onEndReachedThreshold={0.1}
            scrollEventThrottle={16}
            onScroll={onScroll}
            removeClippedSubviews={true}
          />
        )) || <Empty />}
    </>
  );
});

FlatList.propTypes = propTypes;

FlatList.defaultProps = defaultProps;

const styles = StyleSheet.create({
  loading: { alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#fff' },
});

export default FlatList;
