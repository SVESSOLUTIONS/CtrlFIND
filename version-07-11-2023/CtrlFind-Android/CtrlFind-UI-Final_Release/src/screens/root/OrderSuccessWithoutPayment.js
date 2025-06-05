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

export const OrderSuccessWithoutPaymentScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {user} = useContext(AuthContext);
  const {order} = route.params;

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
              {translate('orderSuccess')}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                fontWeight: '300',
                textAlign: 'center',
              }}>
              {translate('hello') + `, ${user?.name}. ` + translate('thankyou')}
            </Text>
          </View>
          <ScrollView>
            <List
                title={translate('payableAmount')}
                subtitle={`${order?.amount==="NaN"?0:order?.amount} CAD`}
            />
            {/* <List
              title={translate('paymentType')}
              subtitle={
                order?.payment_type === 'CARD'
                  ? translate('card')
                  : translate('cod')
              }
            /> */}
            <>
              {order?.order_nr.map((item, i) => (
                <List
                  key={item}
                  title={translate('orderId') + '-' + (i + 1)}
                  subtitle={item}
                />
              ))}
            </>

            {/* {order?.payment_type === 'CARD' ? (
              <>
                {order?.invoice_nr.map((item, i) => (
                  <List
                    key={item}
                    title={translate('invoiceNumber') + ' ' + (i + 1)}
                    subtitle={item}
                  />
                ))}
              </>
            ) : null} */}
          </ScrollView>

          <View style={{height: 80}} />
        </View>
        <View>
          <AppGradientButton
            onPress={() => navigation.navigate('items_screen')}
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
