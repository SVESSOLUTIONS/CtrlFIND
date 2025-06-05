import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  AppGradientButton,
  AppHeader,
  AppIcon,
  BaseView,
  List,
} from '../../components';
import AuthContext from '../../context/AuthContext';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {useDispatch} from 'react-redux';
import {resetCartItems} from '../../store/reducers/cart';
import {translate} from '../../multiLang/translation';

export const OrderSuccessScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {user, trigger} = useContext(AuthContext);
  const {order} = route.params;
  const {id} = route.params;
  const totalAmount=order?.amount

  useEffect(() => {
    dispatch(resetCartItems());
  }, []);

  return (
    <>
      <AppHeader title={translate('success')} isBack={false} />
      <BaseView styles={styles.container}>
        <View style={{flex: 1, marginTop: 15}}>
          <View style={{alignItems: 'center'}}>
            <AppIcon icon={icons.tick} size={80} color={COLORS.primary} />
            <Text
              style={{
                ...FONTS.h2,
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 20,
              }}>
              {translate('paymentSuccess')}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                fontWeight: '300',
                textAlign: 'center',
              }}>
              {translate('hello') + `, ${user?.name} ` + translate('thankyoupayment')}
            </Text>
          </View>
          <ScrollView>
            <List
              title={
                order?.payment_type === 'CARD'
                  ? translate('amountPaid')
                  : translate('payableAmount')
              }
              subtitle={`${totalAmount} CAD`}
            />
            <List
              title={translate('paymentType')}
              subtitle={
                order?.payment_type === 'CARD'
                  ? translate('card')
                  : translate('cod')
              }
            />
            <>
              {order?.order_nr.map((item, i) => (
                <List key={item} title={translate('orderId')} subtitle={item} />
              ))}
            </>

            {order?.payment_type === 'CARD' ? (
              <>
                {order?.invoice_nr.map((item, i) => (
                  <List
                    key={item}
                    title={translate('invoiceNumber')}
                    subtitle={item}
                  />
                ))}
              </>
            ) : null}
          </ScrollView>

          <View style={{height: 80}} />
            {console.log("orderdetail====",order)}
        </View>
        <View>
          <AppGradientButton
            onPress={() => {

                trigger.setRoute('buyer_orders_screen');
              {
                order?.order_type === "service" ?

                    navigation.replace('buyer_service_delivery_status_details', {id: id,})
                    :
                    navigation.replace('buyer_delivery_status_details', {
                      id: id,
                    })
              }
            }}
            title={translate('done')}
            otherStyles={{
              marginTop: 40,
            }}
          />
        </View>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  txt: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '300',
    marginRight: 5,
  },
});
