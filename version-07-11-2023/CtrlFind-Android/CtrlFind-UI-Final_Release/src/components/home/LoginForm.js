import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Yup from 'yup';
import {AppForm, AppFormInput, AppIcon, SubmitButton} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import useAuth from '../../hooks/useAuth';
import {translate} from '../../multiLang/translation';

export const LoginForm = ({onClose}) => {
  const {login, state} = useAuth();
  const [initialValues, setInitialValues] = React.useState({
    phone: '',
    password: '',
  });

  const LoginValidationSchema = Yup.object().shape({
    phone: Yup.string().required().min(10).label('Phone'),
    password: Yup.string().required().label('Password'),
  });

  const onSubmit = val => {
    Keyboard.dismiss();
    login(val);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <View
          style={{
            height: 50,
            backgroundColor: COLORS.primary,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.white,
              fontWeight: '500',
              flex: 1,
            }}>
            {translate('login')}
          </Text>

          <TouchableOpacity activeOpacity={0.6} onPress={onClose}>
            <AppIcon icon={icons.close} size={15} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 15, marginTop: 10}}>
          <View
            style={{
              marginTop: 10,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.lightGray,
            }}>
            <AppForm
              initialValues={initialValues}
              validationSchema={LoginValidationSchema}
              onSubmit={onSubmit}>
              <AppFormInput
                placeholder={translate('phoneNumber') + '(1–604–123–4567)'}
                name="phone"
                editable={!state.loading}
              />
              <AppFormInput
                placeholder={translate('password')}
                name="password"
                editable={!state.loading}
                secureTextEntry={true}
                multiline={false}

              />
              <SubmitButton loading={state.loading} title={'Login'} />

              <View
                style={{
                  height: 20,
                }}
              />
            </AppForm>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
