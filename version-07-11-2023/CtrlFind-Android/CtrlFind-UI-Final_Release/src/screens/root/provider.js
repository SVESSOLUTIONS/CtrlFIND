import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, FlatList, RefreshControl} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppHeader,
  AppNoDataFound,
  AppSlider,
  BaseView,
  GroupButtons,
  ItemsList,
  ServiceHeader,
  SortBy,
} from '../../components';
import {
  getDashboardProviderProducts,
  getDashboardProviderServices,
  ItemsSortBy,
  resetItemFilters,
  setItemFilterPrice,
} from '../../store/reducers/buyerDashboard';
import icons from '../../constants/icons';
import {COLORS} from '../../constants/theme';
import labels from '../../constants/labels';
import {translate} from '../../multiLang/translation';

export const ProviderScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {
    initial_loading,
    provider_item_price_order,
    itemsFilteredPrice,
    filteredProducts,
    filteredServices,
  } = useSelector(state => state.buyerDashboard);

  // local state
  const refRBSheet = React.useRef();
  const refRBSheetProviders = React.useRef();
  const {item, service, id} = route.params;
  const [title, setTitle] = React.useState(service);

  // getting provider items
  const gettingItems = () => {
      console.log("itemdata==.."+JSON.stringify(item))
      console.log("id==.."+JSON.stringify(id))
      console.log("service==.."+JSON.stringify(service))
    dispatch(resetItemFilters());
    if (title === 'Products') {
      dispatch(
        getDashboardProviderProducts({id: item?.id, values: {category_id: id}}),
      );
    } else {
      dispatch(
        getDashboardProviderServices({id: item?.id, values: {category_id: id}}),
      );
    }
  };

  // onMounted
  useEffect(() => {
    gettingItems();
  }, [title]);

  // change header title
  function onPress(t) {
    setTitle(t);
  }

  // navigate to item details when press on item
  function onPressItem(id) {
       // alert(employee_id)
    title === 'Products'
      ? navigation.navigate('provider_product_details', {id})
      : navigation.navigate('provider_service_details', {id});
  }

  return (
    <>
      {/* header  */}
      <AppHeader title={item.name} />
      {/* group buttons  */}
      <GroupButtons title={title} onPress={onPress} />
      <BaseView styles={styles.container} loading={initial_loading}>
        {/* filters header  */}
        <ServiceHeader
          onPressSort={() => refRBSheet.current?.open()}
          onPressFilter={() => refRBSheetProviders.current?.open()}
        />

          {console.log("filteredServices==",filteredServices)}
        {/* listing provider items  */}
        <FlatList
          contentContainerStyle={{paddingBottom: 10}}
          data={title === 'Products' ? filteredProducts : filteredServices}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={initial_loading}
              onRefresh={() => gettingItems()}
            />
          }
          renderItem={({item}) => (
            <ItemsList
              item={item}
              key={item => item.id}
              onPress={() => onPressItem(item?.id)}
              title={
                title === 'Products'
                  ? translate('product')
                  : translate('service')
              }
              rightIcon={icons.right_arrow}
            />
          )}
          ListEmptyComponent={() => (
            <AppNoDataFound title={`No ${title} Found...`} />
          )}
        />
      </BaseView>

      {/* Sort by Modal  */}
      <RBSheet
        ref={refRBSheet}
        height={370}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
          }}>
          <SortBy
            onClose={() => refRBSheet.current?.close()}
            type="items"
            onPress={selectedValue => {
              if (selectedValue) {
                const index = labels.providerSortTitles.indexOf(selectedValue);
                dispatch(
                  ItemsSortBy({
                    type: title,
                    value: selectedValue?.label,
                    index,
                  }),
                );
                refRBSheet.current?.close();
              }
            }}
          />
        </ScrollView>
      </RBSheet>

      {/* price filter modal  */}
      <RBSheet
        ref={refRBSheetProviders}
        height={170}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
            paddingHorizontal: 20,
          }}>
          <AppSlider
            title={`Price(${parseInt(
              provider_item_price_order?.low,
            )} - ${parseInt(itemsFilteredPrice)})`}
            rightText
            leftText
            minimumValue={parseInt(provider_item_price_order?.low)}
            maximumValue={provider_item_price_order?.high}
            value={itemsFilteredPrice}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray}
            onSlidingComplete={val => {
              dispatch(
                setItemFilterPrice({
                  type: title,
                  value: val,
                }),
              );
            }}
            step={0}
          />
        </ScrollView>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray,
    flex: 1,
  },
});
