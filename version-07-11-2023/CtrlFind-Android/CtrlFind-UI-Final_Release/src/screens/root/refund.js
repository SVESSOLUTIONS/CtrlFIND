import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  View,
  ActivityIndicator,
} from 'react-native';
import {AppButton, AppHeader, AppInput, BaseView} from '../../components';
import {COLORS} from '../../constants/theme';
import localStorage from '../../server/localStorage';
import {translate} from '../../multiLang/translation';
import {onRefundStatusChanged} from '../../store/reducers/orders';
import {useDispatch} from 'react-redux';

export const RefundScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [description, setDescription] = useState('');

  const handleName = value => {
    setFullName(value);
  };
  const handlePhone = value => {
    setPhone(value);
  };
  const handleEmail = value => {
    setEmail(value);
  };
  const handleOrderId = value => {
    setOrderId(value);
  };
  const handleDescription = value => {
    setDescription(value);
  };
  const validateEmail = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      return false;
    } else {
      console.log('Email is Correct');
      return true;
    }
  };
  const handleRefundRequest = async () => {
    setLoading(true);
    if (fullName === '' || fullName === ' ') {
      Alert.alert(translate('alert'), translate('nameError'));
      setLoading(false);
    } else if (email === '' || email === ' ') {
      Alert.alert(translate('alert'), translate("enteremail"));
      setLoading(false);
    } else if (!validateEmail(email)) {
      Alert.alert(translate('alert'), translate("validemail"));
      setLoading(false);
    } else if (phone === '' || phone === ' ') {
      Alert.alert(translate('alert'), translate("phonenumber"));
      setLoading(false);
    } else if (orderId === '' || orderId === ' ') {
      Alert.alert(translate('alert'), translate("ordernumber"));
      setLoading(false);
    } else if (description === '' || description === ' ') {
      Alert.alert(translate('alert'), translate("refundorder"));
      setLoading(false);
    } else {
      const url = 'https://cntrlfind.com/api/refund-request?';
      let token = await localStorage.getToken();
      const body = JSON.stringify({
        name: fullName,
        phone: phone,
        email: email,
        order: orderId,
        description: description,
      });
      requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: body,
      };

      console.log('Post call started...');
      try {
        const response = await fetch(url, requestOptions).catch(error => {
          Alert.alert(translate("alert")+ error.message);
        });
        const responseJson = await response.json();
        if (response.status === 200) {
          dispatch(onRefundStatusChanged());
          Alert.alert(translate("success")+ translate("refundSuccess"));
          setLoading(false);
          navigation.goBack();
        } else {
          console.log(responseJson);
          Alert.alert(translate("alert")+ translate("Somethingwentwrong"));
          setLoading(false);
        }
      } catch (error) {
        console.error(error.message);
        Alert.alert(translate("alert")+ error.message);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const details = route.params.details;
    setFullName(details?.buyer_name);
    setPhone(details?.phone);
    setEmail(details?.email);
    setOrderId(details?.order_nr);
  }, []);
  return (
    <>
      <AppHeader title={translate('refundTitle')} />
      <BaseView styles={styles.container}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}>
          <AppInput
            placeholder={translate('name')}
            onChangeText={value => {
              handleName(value);
            }}
            value={fullName}
          />
          <AppInput
            placeholder={translate('phone')}
            keyboardType="phone-pad"
            onChangeText={value => {
              handlePhone(value.replace(/[^0-9]/g, ''));
            }}
            value={phone}
          />
          <AppInput
            placeholder={translate('email')}
            onChangeText={value => {
              handleEmail(value.trim());
            }}
            value={email}
          />
          <AppInput
            placeholder={translate('orderId')}
            editable={false}
            onChangeText={value => {
              handleOrderId(value.trim());
            }}
            value={orderId}
          />
          <TextInput
            placeholder={translate('description')}
            multiline={true}
            numberOfLines={4}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              textAlignVertical: 'top',
              marginTop: 10,
              borderRadius: 5,
              paddingHorizontal: 10,
              height: 150,
              color: COLORS.black,
            }}
            onChangeText={value => handleDescription(value)}
            value={description}
          />
          <AppButton
            title={translate('submit')}
            otherStyles={{marginTop: 40}}
            onPress={() => handleRefundRequest()}
          />
        </ScrollView>
        {loading && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 99,
            }}>
            <ActivityIndicator color={COLORS.primary} size="large" />
          </View>
        )}
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
