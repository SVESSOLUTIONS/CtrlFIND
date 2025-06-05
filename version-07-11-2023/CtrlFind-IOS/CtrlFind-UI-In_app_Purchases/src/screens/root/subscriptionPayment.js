import React, {useContext, useEffect, useState} from 'react';
import {View, Alert, StyleSheet, Platform} from 'react-native';
import CreditCard from 'react-native-credit-card';
import {CardField, useConfirmPayment, useStripe} from '@stripe/stripe-react-native';
import {AppButton, AppHeader, AppInput, BaseView} from '../../components';
import {COLORS} from '../../constants/theme';
import server from '../../server/server';
import AuthContext from '../../context/AuthContext';
import apis from '../../server/apis';
import {useImmer} from 'use-immer';
import images from '../../constants/images';
import {translate} from '../../multiLang/translation';
import {platforms} from "react-native/react-native.config";
import platform from "react-native/Libraries/Utilities/Platform";
import {
  finishTransaction,
  isIosStorekit2,
  PurchaseError,
  requestPurchase,
  requestSubscription,
  useIAP
} from "react-native-iap";

export const SubscriptionPayment = ({navigation, route}) => {
  const {user, trigger} = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const {item, sub_total, gst, pst, price} = route.params;
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
      amount: price,
    });
    setServerLoading(false);
    if (response.ok) {
      const clientSecret = response.data;
      setKey(clientSecret);
    } else {
      Alert.alert(translate("error")+ translate("clientsecret"));
    }
  };

  useEffect(() => {
    console.log("item=="+JSON.stringify(item))
    const unsubscribe = navigation.addListener('focus', () => {
      gettingClientSecret();
    });
    return unsubscribe;
  }, [navigation]);

  const subscribe_package = async () => {
    setLoad(true);
    try {
      const resp = await apis.subscribePackage(item.id, {
        sub_total,
        gst,
        pst,
        price,
      });
      const {user, invoice, package_id} = resp.data;
      const payload = {
        package_id,
        invoice,
      };
      console.log("payload=="+JSON.stringify(payload))
      server.sendSubscriptionDetailsMail(payload).then(resp => {
        console.log("response on cart paymet=="+JSON.stringify(resp))
        setLoad(false);
        trigger.updateUser(user);
        navigation.goBack();
        setTimeout(() => {
          trigger.setRoute('edit_profile');
          navigation.navigate('edit_profile');
        }, 1000);
      });
    } catch (error) {
      setLoad(false);
    }
  };

  // const handlePurchase = async (productId,item) => {
  //   console.log("productId", productId);
  //   console.log("payload item", JSON.stringify((item)));
  //   try {
  //     const purchase = await requestPurchase({
  //       productId: productId,
  //       developerPayload: item,
  //       sku:productId,
  //       // Replace with your own payload
  //     });
  //     // Handle successful purchase here
  //     await finishTransaction(purchase.transactionId);
  //     Alert.alert('Success', 'Purchase successful!');
  //   } catch (error) {
  //     console.log('Error purchasing:', error);
  //     Alert.alert('Error', 'Purchase failed.');
  //   }
  // };



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
        translate('paymentfgfgConf'),
        error?.message ? error.message : '',
      );
    } else if (paymentIntent) {
      subscribe_package();
    }
  };



  const onPayPressIos = async () => {
    if (!card) return;
    if (!card.complete) return;
    if (!state.name) return alert(translate("cardholdername"));
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

    // console.log("erroe",error)
    // console.log("paymentIntent",paymentIntent)
    if (error) {
      return Alert.alert(
          translate('paymentConf'),
          error?.message ? error.message : '',
      );
    } else if (paymentIntent) {
    alert("success")
    }
  };


  return (
    <>
      <AppHeader title={translate('payment')} />
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
