import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppHeader,
  AppIcon,
  AppInput,
  BaseView,
  CartItem,
} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {
  decreament,
  increament,
  setSelectedItem,
} from '../../store/reducers/cart';
import {translate} from '../../multiLang/translation';
export const CartScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {cartItems, selectedItem} = useSelector(state => state.cart);
  const {categoryProviders} = useSelector(state => state.buyerDashboard);

  console.log(JSON.stringify(cartItems), '---cartitems');
  const refRBSheetProviders = React.useRef();
  return (
    <>
      <AppHeader
        title={
          route?.name === 'basket'
            ? translate('basketTitle')
            : translate('cartTitle')
        }
        shadow={false}
        isMenu={route?.name === 'basket' ? true : false}
        // rightIcon={icons.filter}
        // iconSize={12}
        // iconTitle="Filter"
        // iconColor={COLORS.lightGray}
        // onPressRight={() => refRBSheetProviders.current?.open()}
      />

      <BaseView styles={styles.container}>
        <ScrollView
          style={{flex: 1, marginTop: 25}}
          showsVerticalScrollIndicator={false}>
          {cartItems?.map(cartItem => (
            <TouchableOpacity
              onPress={() => dispatch(setSelectedItem(cartItem))}
              activeOpacity={0.9}
              key={cartItem.provider_id}
              style={{
                borderWidth: 2,
                padding: 10,
                borderColor: COLORS.gray,
                borderRadius: 10,
                marginBottom: 10,
              }}>
              <View style={styles.checkBox}>
                {selectedItem?.provider_id === cartItem?.provider_id ? (
                  <AppIcon icon={icons.tick} size={24} color={COLORS.primary} />
                ) : null}
              </View>
              <Text style={{...FONTS.h2, fontWeight: '800'}}>
                {cartItem?.provider_name}
              </Text>
              {cartItem?.items.some(i => i?.order_type === 'product') ? (
                <Text
                  style={[
                    styles.itemsTitle,
                    {
                      backgroundColor: COLORS.primary,
                    },
                  ]}>
                  {translate('products')}
                </Text>
              ) : null}
              {cartItem?.items
                .filter(i => i?.order_type === 'product')
                .map((item, i) => (
                  <CartItem
                    item={item}
                    key={item.id + i}
                    onIncreament={() =>
                      dispatch(
                        increament({
                          provider_id: cartItem?.provider_id,
                          product: item,
                        }),
                      )
                    }
                    onDecreament={() =>
                      dispatch(
                        decreament({
                          provider_id: cartItem?.provider_id,
                          product: item,
                        }),
                      )
                    }
                  />
                ))}
              {cartItem?.items.some(i => i?.order_type === 'service') ? (
                <Text
                  style={[
                    styles.itemsTitle,
                    {
                      backgroundColor: COLORS.black,
                    },
                  ]}>
                  {translate('services')}
                </Text>
              ) : null}
              {cartItem?.items
                .filter(i => i?.order_type === 'service')
                .map((item, i) => (
                  <CartItem
                    item={item}
                    key={item.id + i}
                    type="service"
                    onIncreament={() =>
                      dispatch(
                        increament({
                          provider_id: cartItem?.provider_id,
                          product: item,
                        }),
                      )
                    }
                    onDecreament={() =>
                      dispatch(
                        decreament({
                          provider_id: cartItem?.provider_id,
                          product: item,
                        }),
                      )
                    }
                  />
                ))}
              <AppButton
                onPress={() =>
                  navigation.navigate('provider', {
                    item: categoryProviders.find(
                      p => p.id === cartItem?.provider_id,
                    ),
                    id:cartItem?.category_id,
                    service: 'Products',
                  })
                }
                title={translate('buyFrom')}
                otherStyles={{
                  backgroundColor: COLORS.black,
                }}
              />
            </TouchableOpacity>
          ))}
          <View style={{height: 60}} />
        </ScrollView>
        <View style={{position: 'absolute', right: 15, bottom: 15}}>
          <AppButton
            disabled={!selectedItem}
            loading={!selectedItem}
            onPress={() => navigation.navigate('order_review')}
            title={translate('buy')}
            icon={icons.basket}
            leftIconStyles={{
              marginLeft: 0,
            }}
            otherStyles={{
              width: 130,
              alignSelf: 'flex-end',
              justifyContent: 'center',
              marginTop: 20,
            }}
            textStyles={{
              flex: 0,
            }}
          />
        </View>
        <RBSheet
          ref={refRBSheetProviders}
          height={300}
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
            <View
              style={{
                marginHorizontal: 15,
                paddingVertical: 10,
              }}>
              <AppInput placeholder={translate('selectCategory')} />
              <AppInput placeholder={translate('byKeyword')} />
              <AppButton title={translate('confirmTitle')} onPress={() => {}} />
            </View>
          </ScrollView>
        </RBSheet>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  txt: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '300',
    marginRight: 5,
  },
  checkBox: {
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 15,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 5,
    top: 10,
  },
  itemsTitle: {
    ...FONTS.body5,
    color: COLORS.white,
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    alignSelf: 'baseline',
    paddingVertical: 1,
    paddingHorizontal: 15,
    borderRadius: 2,
    marginTop: 5,
  },
});
