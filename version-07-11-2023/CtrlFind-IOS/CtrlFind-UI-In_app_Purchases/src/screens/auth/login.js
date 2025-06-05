import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  AppForm,
  AppFormInput,
  SubmitButton,
  AppIcon,
  Header,
} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import useAuth from '../../hooks/useAuth';
import useCountrtCode from '../../hooks/useCountrtCode';
import {translate} from '../../multiLang/translation';
export const LoginScreen = ({navigation}) => {
  const [initialValues, setInitialValues] = React.useState({
    phone: '',
    password: '',
  });
  const {
    LoginValidationSchema,
    loginWithFacebook,
    loginWithGoogle,
    loginWithApple,
    loginHandler,
    onPressGuest,
    state,
  } = useAuth();
  const {dialCode} = useCountrtCode();

  React.useEffect(() => {
    // requestUserPermission();
    setInitialValues({
      phone: dialCode,
      password: '',
    });
  }, [dialCode]);

  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //   if (enabled) {
  //     // console.log("Authorization status:", authStatus);
  //     const fcmToken = await getFcmToken();
  //     return fcmToken;
  //   }
  // };

  // const getFcmToken = async () => {
  //   const fcmToken = await messaging().getToken();
  //   if (fcmToken) {
  //     //this.setState({ fcmToken: fcmToken });
  //     console.log('Your Firebase Token is:', fcmToken);
  //     return fcmToken;
  //   } else {
  //     console.log('Failed', 'No token received');
  //     return null;
  //   }
  // };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <Header hideMenu={true} />

          <ScrollView
            contentContainerStyle={styles.bottomContainer}
            keyboardShouldPersistTaps="handled"
            bounces={false}>
            <Text style={styles.title}>{translate('welcomeTitle')}</Text>
            <Text style={styles.subtitle}>{translate('welcomeText')}</Text>
            <AppForm
              enableReinitialize={true}
              validationSchema={LoginValidationSchema}
              initialValues={initialValues}
              onSubmit={values => {
                Keyboard.dismiss();
                loginHandler(values);
              }}>
              <AppFormInput
                  keyboardType={"phone-pad"}
                placeholder={translate("phoneNumber")+"(+16041234567)"}
                name="phone"
                editable={!state.loading}
              />

              {state.isValidNumber && (
                <AppFormInput
                  placeholder={translate("password")}
                  name="password"
                  editable={!state.loading}
                  secureTextEntry={true}
                  multiline={false}
                />
              )}

              <TouchableOpacity
                disabled={state.loading}
                onPress={() => navigation.navigate('forget')}
                style={styles.forgetBtn}>
                <Text style={styles.forgetTxt}>{translate('forgot')}</Text>
              </TouchableOpacity>
              <SubmitButton
                title={translate('signIn')}
                loading={state.loading}
              />
            </AppForm>

            <View style={styles.contineWith}>
              <View style={styles.line} />
              <Text style={styles.lineTxt}>{translate('continueText')}</Text>
              <View style={styles.line} />
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={loginWithGoogle}
                disabled={state.loading}
                activeOpacity={0.7}
                style={styles.iconContainer}>
                <AppIcon icon={icons.google} orgColor={true} size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={loginWithFacebook}
                disabled={state.loading}
                activeOpacity={0.7}
                style={styles.iconContainer}>
                <AppIcon icon={icons.facebook} orgColor={true} size={25} />
              </TouchableOpacity>
              {Platform.OS==="ios"?
                  <TouchableOpacity
                      onPress={loginWithApple}
                      disabled={state.loading}
                      activeOpacity={0.7}
                      style={styles.iconContainer}>
                    <AppIcon icon={icons.appleLogo} orgColor={true} size={25} />
                  </TouchableOpacity>
                  :null
              }
            </View>
            <Text style={styles.bottomLine}>
              <Text>{translate('noAccount')}</Text>{' '}
              <Text
                onPress={() => navigation.navigate('register')}
                style={{color: COLORS.primary, fontWeight: '600'}}>
                {translate('register')}
              </Text>
            </Text>
            <TouchableOpacity
              disabled={state.loading}
              activeOpacity={0.7}
              style={styles.endLineContainer}
              onPress={onPressGuest}>
              <AppIcon icon={icons.profile} color={COLORS.black} size={25} />
              <Text style={styles.endLine}>{translate('guestText')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  bottomContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.secondary,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    ...FONTS.h1,
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body3,
    fontWeight: '400',
    marginVertical: 10,
    textAlign: 'center',
  },
  forgetBtn: {
    marginTop: 20,
    width: '100%',
  },
  forgetTxt: {
    ...FONTS.h2,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  contineWith: {
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
  iconContainer: {
    height: 50,
    width: 50,
    borderWidth: 2,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  bottomLine: {
    ...FONTS.body4,
  },
  endLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  endLine: {
    ...FONTS.h3,
    marginLeft: 10,
    color: COLORS.black,
  },
});
