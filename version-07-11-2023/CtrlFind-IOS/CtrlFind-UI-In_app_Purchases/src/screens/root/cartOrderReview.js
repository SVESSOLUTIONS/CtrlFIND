import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {
  AppGradientButton,
  AppHeader,
  BaseView,
  CartItem,
  LoginForm,
} from '../../components';
import helpers from '../../constants/helpers';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {decreament, getProfile, increament} from '../../store/reducers/cart';
import {goToCheckout} from '../../store/reducers/checkout';
import {translate} from '../../multiLang/translation';

export const CartOrderReviewScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const {cartItems, selectedItem, loading, selectedProvider} = useSelector(
    state => state.cart,
  );

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dispatch(getProfile(selectedItem?.provider_id));
  }, []);

  return (
    <>
      <AppHeader title={translate('orderReview')} />
      <BaseView styles={styles.container} loading={loading}>
        <ScrollView
          style={{flex: 1, marginTop: 25}}
          contentContainerStyle={{paddingBottom: 90}}
          showsVerticalScrollIndicator={false}>
          {cartItems
            .filter(c => c.provider_id === selectedItem?.provider_id)
            .map(cartItem => (
              <View style={styles.cartContainer} key={cartItem.provider_id}>
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
                <View style={{paddingVertical: 10}}>
                  {/* <View style={styles.paymentContainer}>
                    <Text
                      style={{
                        ...FONTS.body4,
                        fontWeight: '300',
                        marginLeft: 5,
                        marginRight: 'auto',
                      }}>
                      Items total:
                    </Text>
                    <Text
                      style={[
                        styles.payment,
                        {...FONTS.h3, color: COLORS.primary},
                      ]}>
                      {helpers.getTotalAmount(cartItem?.items)} CAD
                    </Text>
                  </View> */}

                  {/*{selectedProvider?.is_paying_taxes ? (*/}
                  {/*  <View style={{marginTop: 5}}>*/}
                  {/*    <View style={styles.paymentContainer}>*/}
                  {/*      <Text*/}
                  {/*        style={{*/}
                  {/*          ...FONTS.body4,*/}
                  {/*          fontWeight: '300',*/}
                  {/*          marginLeft: 5,*/}
                  {/*          marginRight: 'auto',*/}
                  {/*        }}>*/}
                  {/*        Total Before Tax:*/}
                  {/*      </Text>*/}
                  {/*      <Text*/}
                  {/*        style={[*/}
                  {/*          styles.payment,*/}
                  {/*          {...FONTS.h3, color: COLORS.black},*/}
                  {/*        ]}>*/}
                  {/*        {helpers.getTotalAmount(cartItem?.items)} CAD*/}
                  {/*      </Text>*/}
                  {/*    </View>*/}

                  {/*    <View style={styles.paymentContainer}>*/}
                  {/*      <Text*/}
                  {/*        style={{*/}
                  {/*          ...FONTS.body4,*/}
                  {/*          color: COLORS.primary,*/}
                  {/*          fontWeight: '300',*/}
                  {/*          fontSize: 12,*/}
                  {/*          marginLeft: 5,*/}
                  {/*          marginRight: 'auto',*/}
                  {/*        }}>*/}
                  {/*        Estimated GST/HST ({selectedProvider?.gst}):*/}
                  {/*      </Text>*/}
                  {/*      <Text*/}
                  {/*        style={[*/}
                  {/*          styles.payment,*/}
                  {/*          {...FONTS.h3, color: COLORS.primary},*/}
                  {/*        ]}>*/}

                  {/*        {helpers.getPercentagePrice(*/}
                  {/*          helpers.getTotalAmount(*/}
                  {/*            cartItem?.items.filter(i => i.taxable === 'Y'),*/}
                  {/*          ),*/}
                  {/*          selectedProvider?.province?.gst_tax_percentage,*/}
                  {/*        )} CAD*/}
                  {/*      </Text>*/}
                  {/*    </View>*/}

                  {/*    <View style={styles.paymentContainer}>*/}
                  {/*      <Text*/}
                  {/*        style={{*/}
                  {/*          ...FONTS.body4,*/}
                  {/*          color: COLORS.primary,*/}
                  {/*          fontSize: 12,*/}
                  {/*          fontWeight: '300',*/}
                  {/*          marginLeft: 5,*/}
                  {/*          marginRight: 'auto',*/}
                  {/*        }}>*/}
                  {/*        Estimated PST/RST/QST ({selectedProvider?.pst}):*/}
                  {/*      </Text>*/}
                  {/*      <Text*/}
                  {/*        style={[*/}
                  {/*          styles.payment,*/}
                  {/*          {...FONTS.h3, color: COLORS.primary},*/}
                  {/*        ]}>*/}

                  {/*        {helpers.getPercentagePrice(*/}
                  {/*          helpers.getTotalAmount(*/}
                  {/*            cartItem?.items.filter(i => i.taxable === 'Y'),*/}
                  {/*          ),*/}
                  {/*          selectedProvider?.province?.pst_tax_percentage,*/}
                  {/*        )} CAD*/}
                  {/*      </Text>*/}
                  {/*    </View>*/}
                  {/*  </View>*/}
                  {/*) : null}*/}

                  <View style={[styles.paymentContainer, {marginTop: 20}]}>
                    <Text
                      style={{
                        ...FONTS.body4,
                        fontWeight: '600',
                        marginLeft: 5,
                        marginRight: 'auto',
                      }}>
                      {translate('totalPayment')}
                    </Text>
                    <Text style={styles.payment}>
                      {helpers.getTotalAmount(cartItem?.items)} CAD
                      {/* {`${helpers.getTotalAmountWithItemTaxas(
                        selectedProvider,
                        helpers.getTotalAmount(cartItem?.items),
                        cartItem?.items,
                        null,
                        null,
                      )} CAD`} */}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
        <AppGradientButton
          disabled={cartItems?.length <= 0}
          loading={cartItems?.length <= 0}
          onPress={() => {
            if (selectedItem?.provider_id === user?.id) {
              return Alert.alert(
                translate('invalidAccount'),
                translate('invalidAccountText'),
                [
                  {
                    text: translate('cancel'),
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: translate('ok'),
                    onPress: () => {},
                    style: 'destructive',
                  },
                ],
              );
            }
            if (helpers.getRole(user?.role_id) === helpers.BUYER) {
              dispatch(goToCheckout(user));
            } else {
              setIsVisible(true);
            }
          }}
          title={translate('checkout')}
        />
      </BaseView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <LoginForm onClose={() => setIsVisible(false)} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  cartContainer: {
    borderWidth: 2,
    padding: 10,
    borderColor: COLORS.gray,
    borderRadius: 10,
    marginBottom: 10,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  payment: {
    ...FONTS.h2,
    color: COLORS.black,
    width: 140,
    fontWeight: '800',
    textAlign: 'right',
  },
  txt: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '300',
    marginRight: 5,
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
