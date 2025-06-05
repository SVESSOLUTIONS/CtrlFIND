import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {AppNoDataFound, BaseView, OrderCardContainer} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

export const PendingOrdersScreen = () => {
  const {loading, orders} = useSelector(state => state.orders);

  return (
    <>
      <BaseView styles={styles.container} loading={loading}>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({item}) => <OrderCardContainer item={item} />}
          ListEmptyComponent={() => (
            <AppNoDataFound title={translate('noOrder')} />
          )}
        />
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
});
