import React from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  AppNoDataFound,
  BaseView,
  OrderCardContainer,
  ServiceCardContainer,
} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
export const AllOrdersScreen = () => {
  const {loading, orders, services, title} = useSelector(state => state.orders);

  return (
    <>
      <BaseView styles={styles.container} loading={loading}>
        {title === 'Products' ? (
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
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 30,
            }}
            data={services}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ServiceCardContainer item={item} />}
            ListEmptyComponent={() => (
              <AppNoDataFound title={translate('noOrder')} />
            )}
          />
        )}
        {/*{console.log("service=====",JSON.stringify(orders))}*/}
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
