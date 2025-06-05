import React from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {useDispatch} from 'react-redux';
import {AppHeader, BaseView, ShopCard} from '../../components';
import icons from '../../constants/icons';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {setIndex} from '../../store/reducers/orders';

const SHOP_ITEMS = [
  {
    id: 1,
    name: 'categories',
    icon: icons.categories,
    route: 'categories',
  },
  {
    id: 2,
    name: 'shopItems',
    icon: icons.items_icon,
    route: 'category_items',
  },
  {id: 3, name: 'colors', icon: icons.colors, route: 'colors'},
  {id: 4, name: 'sizes', icon: icons.sizes, route: 'sizes'},
  {id: 5, name: 'orders', icon: icons.orders, route: 'orders'},
  {id: 6, name: 'payments', icon: icons.payments, route: 'payments'},
  {
    id: 7,
    name: 'employees',
    icon: icons.employees,
    route: 'employees',
  },
  {
    id: 8,
    name: 'mySchedule',
    icon: icons.schedule,
    route: 'my_schedule',
  },
];
export const ShopScreen = ({navigation}) => {
  const dispatch = useDispatch();
  return (
    <>
      <AppHeader title={translate('shopTitle')} isMenu />
      <BaseView styles={styles.container}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.select({
              ios: getBottomSpace(),
              android: 20,
            }),
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            {SHOP_ITEMS.map(item => (
              <ShopCard
                onPress={() => {
                  if (item.route === 'orders') {
                    dispatch(setIndex(0));
                  }
                  navigation.navigate(item.route);
                }}
                icon={item.icon}
                title={translate(item.name)}
                key={item.id}
              />
            ))}
          </View>
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
