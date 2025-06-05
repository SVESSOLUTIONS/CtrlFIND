import {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppButton, AppHeader, CountDownComponent} from '../../components';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import useAuth from '../../hooks/useAuth';
import {translate} from '../../multiLang/translation';
import {
  ConfirmEmailCode,
  ConfirmOtp,
  otpTimeout,
  sendEmailVerificationCode,
  sendOtp,
} from '../../store/reducers/forgetPassword';

export const VerificationScreen = ({navigation, route}) => {
  const {loading, running, verificationProvider, phoneNumber, isTimeFinish} =
    useSelector(state => state.forgetPassword);
  const dispatch = useDispatch();
  const {confirmRegisterOtp, userRegisterOTP, state} = useAuth();
  const {previousScreen} = route.params;

  function onAuthStateChanged(user) {
    if (user) {
      if (user.uid && user.phoneNumber === phoneNumber) {
        switch (previousScreen) {
          case 'register':
            setTimeout(() => {
               userRegisterOTP();
            }, 500);
            break;
          case 'reset':
            if (verificationProvider === 'phone') {
              setTimeout(() => {
                navigation.navigate('reset');
              }, 300);
            }
            break;
          default:
            break;
        }
      }
    }
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const [code, setCode] = useState();
  const [key, setKey] = useState(0);

  function OtpHandler() {
    if (code.length === 6) {
      onComplete(code);
    }
  }

  const onComplete = code => {
    switch (previousScreen) {
      case 'register':
        confirmRegisterOtp(code);
        break;
      case 'reset':
        switch (verificationProvider) {
          case 'email':
            dispatch(ConfirmEmailCode({code}));
            break;
          case 'phone':
            dispatch(ConfirmOtp({code}));
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={translate('verificationTitle')} />
      <View style={{marginTop: 20, paddingHorizontal: 20}}>
        <Text
          style={{
            ...FONTS.body3,
            marginBottom: 10,
          }}>
          {translate('verificationText')}
        </Text>

        <OTPInputView
          style={{width: '100%', height: 200}}
          pinCount={6}
          code={code}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeChanged={val => setCode(val)}
          onCodeFilled={code => {
            setCode(code);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
            marginTop: 15,
          }}>
          <CountDownComponent
            id={key.toString()}
            running={running}
            onFinish={() => dispatch(otpTimeout(true))}
          />

          <TouchableOpacity
            disabled={loading || !isTimeFinish}
            onPress={async () => {
              switch (verificationProvider) {
                case 'email':
                  await dispatch(
                    sendEmailVerificationCode({previousScreen: 'reset'}),
                  );
                  break;
                case 'phone':
                  await dispatch(sendOtp({previousScreen: 'reset'}));
                  break;
                default:
                  break;
              }
              setKey(prevKey => prevKey + 1);
              setCode('');
            }}>
            <Text
              style={{
                ...FONTS.h3,
                color: loading || !isTimeFinish ? COLORS.gray : COLORS.primary,
                fontWeight: '600',
              }}>
              {translate('sendAgain')}
            </Text>
          </TouchableOpacity>
        </View>
        <AppButton
          onPress={OtpHandler}
          title={translate('continue')}
          loading={loading || state.loading}
          otherStyles={{marginTop: 70}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  lineTxt: {
    ...FONTS.body4,
    paddingHorizontal: 10,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: SIZES.width / 6 - 12,
    height: SIZES.width / 6 - 12,
    borderWidth: 1,
    borderRadius: 10,
    color: COLORS.black,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
