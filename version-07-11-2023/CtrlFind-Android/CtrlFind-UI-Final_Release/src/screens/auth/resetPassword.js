import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {AppForm, AppFormInput, AppHeader, SubmitButton} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {resetPassword} from '../../store/reducers/forgetPassword';

export const ResetPasswordScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.forgetPassword.loading);

  // RESET_PASSWORD_VALIDATION
  const ResetValidationSchema = Yup.object().shape({
    password: Yup.string().required().label('Password'),
    password_confirmation: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  // HANDLE RESET PASSWORD

  const ResetPassworddHandler = values => {
    dispatch(resetPassword(values));
  };

  return (
    <View style={styles.container}>
      <AppHeader title={translate('resetTitle')} isBack={false} />
      <View style={{marginTop: 20, paddingHorizontal: 20}}>
        <Text
          style={{
            ...FONTS.body3,
            marginBottom: 10,
          }}>
          {translate('resetText')}
        </Text>
        <AppForm
          validationSchema={ResetValidationSchema}
          initialValues={{
            password: '',
            password_confirmation: '',
          }}
          onSubmit={ResetPassworddHandler}>
          <AppFormInput
            placeholder={translate('password')}
            name="password"
            secureTextEntry={true}
            multiline={false}
          />

          <AppFormInput
            placeholder={translate('confirm')}
            otherStyles={{marginTop: 20}}
            name="password_confirmation"
            secureTextEntry={true}
            multiline={false}
          />
          <SubmitButton
            title={translate('resetTitle')}
            otherStyles={{marginTop: 70}}
            loading={loading}
          />
        </AppForm>
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
});
