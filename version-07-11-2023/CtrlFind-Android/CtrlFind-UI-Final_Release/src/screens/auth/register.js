import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {AppForm, AppFormInput, AppHeader, SubmitButton} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import useAuth from '../../hooks/useAuth';
import {translate} from '../../multiLang/translation';

export const RegisterScreen = ({navigation}) => {
  const {RegisterValidationSchema, state, register} = useAuth();
  const loading = useSelector(state => state.forgetPassword.loading);

  return (
    <View style={styles.container}>
      <AppHeader title={translate('registerTitle')} />
      <View style={{marginTop: 20, paddingHorizontal: 20}}>
        <AppForm
          validationSchema={RegisterValidationSchema}
          initialValues={state.RegisterInitialValues}
          enableReinitialize={true}
          onSubmit={register}>
          <AppFormInput placeholder={translate('name')} name="name" />
          <AppFormInput
              keyboardType={"phone-pad"}
              placeholder="Phone number (e.g.'+16041234567')"
            name="phone"
          />
          <AppFormInput placeholder={translate('email')} name="email" />
          <AppFormInput
            placeholder={translate('password')}
            name="password"
            secureTextEntry={true}
            multiline={false}
          />
          <AppFormInput
            placeholder={translate('confirm')}
            name="password_confirmation"
            secureTextEntry={true}
            multiline={false}

          />
          <SubmitButton
            title={translate('register')}
            otherStyles={{marginTop: 30}}
            loading={state.loading || loading}
          />
        </AppForm>
        <Text style={{...FONTS.body3, textAlign: 'center', marginTop: 20}}>
          <Text>{translate('termsText') + ' '}</Text>
          <Text
            style={{fontWeight: 'bold', color: COLORS.primary}}
            onPress={() => navigation.navigate('terms')}>
            {translate('terms')}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
