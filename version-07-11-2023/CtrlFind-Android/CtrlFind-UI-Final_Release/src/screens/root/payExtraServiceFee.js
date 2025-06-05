import React, {useContext, useEffect, useState} from 'react';
import {View, Alert, StyleSheet, Platform} from 'react-native';
import CreditCard from 'react-native-credit-card';
import {CardField, useConfirmPayment, useStripe} from '@stripe/stripe-react-native';
import {AppButton, AppHeader, AppInput, BaseView} from '../../components';
import {COLORS} from '../../constants/theme';
import server from '../../server/server';
import AuthContext from '../../context/AuthContext';
import {useDispatch, useSelector} from 'react-redux';
import {onPay} from '../../store/reducers/checkout';
import {useImmer} from 'use-immer';
import images from '../../constants/images';
import {translate} from '../../multiLang/translation';
import {extraPaymentPaid} from '../../store/reducers/orders';
import toast from '../../server/toast';
import {useNavigation} from '@react-navigation/native';
export const PayExtraServiceFee = ({route}) => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const {serverLoading: load} = useSelector(state => state.orders);
  const {order} = route.params;
  const navigation = useNavigation();
  const [serverLoading, setServerLoading] = useState(true);
  const [card, setCard] = useState(null);
  const [key, setKey] = useState(null);
  const [state, setState] = useImmer({
    type: '',
    focused: '',
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });

  const confirmPayment = Platform.OS === 'android' ? useConfirmPayment().confirmPayment : useStripe().confirmPayment;
  const loading = Platform.OS === 'android' ? useConfirmPayment().loading : serverLoading;

  const gettingClientSecret = async () => {
    setServerLoading(true);
    const response = await server.getClientSecret({
      amount: order?.extra_service_fee,
    });
    setServerLoading(false);
    if (response.ok) {
      const clientSecret = response.data;
      setKey(clientSecret);
    } else {
      Alert.alert(translate("error")+ response.data?.message ?? translate("clientsecret"));
    }
  };
  useEffect(() => {
    gettingClientSecret();
  }, []);

  // const  goBackScreen=()=>{
  //   alert("back")
  //
  // }
  const onPress = () => {
    Platform.select({
      android: onPayPress,
      ios: onPayPressIos,
    })();
  };

  const onPayPress = async () => {
    if (!card) return;
    if (!card.complete) return;
    if (!state.name) return alert(translate("cardholdername"));
    if (!key) return alert(translate("stripeerror"));
    const billingDetails = {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
    const {paymentIntent, error} = await confirmPayment(key, {
      type: 'Card',
      billingDetails,
    });
    if (error) {
      return Alert.alert(
        translate("cardholdername"),
        error?.message ? error.message : '',
      );
    }
    if (paymentIntent) {
      dispatch(extraPaymentPaid(order?.id));
      // toast.paymentSuccessful('payment request successfully submitted');
      // navigation.goBack();
    }
    return;
  };


  const onPayPressIos = async () => {
    if (!card) return;
    if (!card.complete) return;
    if (!state.name) return alert(translate("cardholdername"));
    if (!key) return alert(translate("stripeerror"));
    const billingDetails = {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
    setServerLoading(true)
    const {paymentIntent, error} = await confirmPayment(key, {
      paymentMethodType: "Card",
    });
    setServerLoading(false)
    if (error) {
      return Alert.alert(
          translate("cardholdername"),
          error?.message ? error.message : '',
      );
    }
    if (paymentIntent) {
      dispatch(extraPaymentPaid(order?.id));
      // toast.paymentSuccessful('payment request successfully submitted');
      // navigation.goBack();
    }
    return;
  };

  return (
    <>
      <AppHeader title={translate('paymentsTitle')} />
      <BaseView
        styles={styles.container}
        loading={serverLoading}
        overlayLoading={load}>
        <View style={{flex: 1}}>
          <View
            style={{
              height: 180,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CreditCard
              type={state.type}
              imageFront={images.cartFront}
              imageBack={images.cartBack}
              shiny={false}
              bar={false}
              focused={state.focused}
              number={state.number}
              name={state.name}
              expiry={state.expiry}
              cvc={state.cvc}
            />
          </View>
          <View
            style={{
              width: '80%',
              alignSelf: 'center',
            }}>
            <AppInput
                placeholder={translate("cardHolderName")}
                multiline={false}
                maxLength={40}
              onChangeText={val =>
                setState(draft => {
                  draft.name = val;
                })
              }
            />
          </View>
          <CardField
            dangerouslyGetFullCardDetails
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            postalCodeEnabled={false}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 30,
            }}
            onCardChange={cardDetails => {
              setCard(cardDetails);
              setState(draft => {
                draft.cvc = cardDetails.last4;
                draft.type = cardDetails.brand.toLowerCase();
                draft.number = cardDetails.number;
              });
              if (cardDetails.expiryMonth) {
                if (cardDetails.expiryMonth.toString().length > 1) {
                  setState(draft => {
                    draft.expiry =
                      cardDetails.expiryMonth + '' + cardDetails.expiryYear;
                  });
                } else {
                  setState(draft => {
                    draft.expiry =
                      '0' +
                      cardDetails.expiryMonth +
                      '' +
                      cardDetails.expiryYear;
                  });
                }
              }
            }}
            onFocus={focusedField => {
              setState(draft => {
                switch (focusedField) {
                  case 'CardNumber':
                    draft.focused = 'number';
                    break;
                  case 'ExpiryDate':
                    draft.focused = 'expiry';
                    break;
                  default:
                    break;
                }
              });
            }}
          />
          <AppButton
            disabled={!key}
            title={translate('pay')}
            loading={loading}
            onPress={onPress}
            otherStyles={{
              width: '90%',
              alignSelf: 'center',
            }}
          />
          <View style={{height: 40}} />
        </View>
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
});
