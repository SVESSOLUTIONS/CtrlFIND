import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Yup from 'yup';
import toast from '../../server/toast/auth';
import {AppForm, AppFormInput, AppHeader, SubmitButton} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {useDispatch, useSelector} from 'react-redux';
import {
  validateEmail,
  validatePhone,
} from '../../store/reducers/forgetPassword';
import useCountrtCode from '../../hooks/useCountrtCode';
import {translate} from '../../multiLang/translation';

export const ForgetPasswordScreen = () => {
  const {dialCode} = useCountrtCode();

  const [initialValues, setInitialValues] = React.useState({
    phone: dialCode,
    email: '',
  });

  React.useEffect(() => {
    setInitialValues({
      phone: dialCode,
      email: '',
    });
  }, [dialCode]);

  const dispatch = useDispatch();
  const loading = useSelector(state => state.forgetPassword.loading);
  const SubmitHandler = values => {
    if (values.email) {
      dispatch(validateEmail({email: values.email}));
      return;
    }
    if (values.phone) {
      dispatch(validatePhone({phoneNumber: values.phone}));
      return;
    } else {
      toast.fields_are_empty();
    }
  };

  // FORGET_PASSWORD_VALIDATION
  const ForgetValidationSchema = Yup.object().shape({
    phone: Yup.string().label('Phone'),
    email: Yup.string().email().label('Email'),
  });

  return (
    <View style={styles.container}>
      <AppHeader title={translate('forgotTitle')} />
      <View style={{marginTop: 20, paddingHorizontal: 20}}>
        <Text
          style={{
            ...FONTS.body3,
            marginBottom: 10,
          }}>
          {translate('forgotText')}
        </Text>
        <AppForm
          initialValues={initialValues}
          validationSchema={ForgetValidationSchema}
          enableReinitialize={true}
          onSubmit={values => SubmitHandler(values)}>
          <AppFormInput
            placeholder="Phone number (e.g.'+1–604–123–4567')"
            name="phone"
          />
          <View style={styles.or}>
            <View style={styles.line} />
            <Text style={styles.lineTxt}>{translate('or')}</Text>
            <View style={styles.line} />
          </View>
          <AppFormInput
            placeholder={translate('email')}
            name="email"
            otherStyles={{marginTop: 20}}
          />
          <SubmitButton
            title={translate('continue')}
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
