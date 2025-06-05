import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppGradientButton,
  AppHeader,
  AppLoader,
  BaseView,
  GroupButtons,
  ItemsList,
} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  getItemDetails,
  getProducts,
  getServices,
  resetForm,
  setEditMode,
} from '../../store/reducers/userItems';

export const CategoryItemsDetailsScreen = ({navigation, route}) => {
  const {item} = route.params;
  const [title, setTitle] = React.useState(item.title);
  const [refreshing, setRefreshing] = React.useState(false);

  const {products, services, loading, item_loading} = useSelector(
    state => state.userItems,
  );
  const dispatch = useDispatch();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    gettingItems();
  }, []);

  const gettingItems = () => {
    if (title === 'Products') {
      dispatch(getProducts());
    } else {
      dispatch(getServices());
    }
    setRefreshing(false);
  };

  useEffect(() => {
    gettingItems();
  }, [title]);

  function onPress(t) {
    setTitle(t);
  }

  return (
    <>
      {item_loading && <AppLoader />}
      <AppHeader title={title} />
      <GroupButtons title={title} onPress={onPress} />
      <BaseView styles={styles.container} loading={loading}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 100}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View>
            {title === 'Products' ? (
              <>
                {products.length ? (
                  products.map(product => (
                    <ItemsList
                      item={product}
                      key={product.id}
                      onPress={() =>
                        dispatch(
                          getItemDetails({route: 'Products', id: product.id}),
                        )
                      }
                    />
                  ))
                ) : (
                  <Text style={styles.empty}>{translate('noProduct')}</Text>
                )}
              </>
            ) : (
              <>
                {services.length ? (
                  services.map(service => (
                    <ItemsList
                      item={service}
                      key={service.id}
                      onPress={() =>
                        dispatch(
                          getItemDetails({route: 'Services', id: service.id}),
                        )
                      }
                    />
                  ))
                ) : (
                  <Text style={styles.empty}>{translate('noServices')}</Text>
                )}
              </>
            )}
          </View>
        </ScrollView>

        <AppGradientButton
          title={
            translate('addNew') +
            ` ${
              title === 'Products' ? translate('product') : translate('service')
            }`
          }
          onPress={() => {
            dispatch(resetForm());
            dispatch(setEditMode(false));
            navigation.navigate(
              `add_new_${title === 'Products' ? 'products' : 'services'}`,
              {
                title: title === 'Products' ? 'Product' : 'Service',
              },
            );
          }}
        />
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray,
    flex: 1,
  },
  empty: {
    ...FONTS.body4,
    marginTop: 50,
    textAlign: 'center',
    color: COLORS.gray,
  },
});
