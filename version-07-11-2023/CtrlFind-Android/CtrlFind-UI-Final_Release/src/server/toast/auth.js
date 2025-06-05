import Toast from 'react-native-toast-message';
import {translate} from '../../multiLang/translation';

const login_failed = msg => {
  Toast.show({

    type: 'error',
    text1: translate('loginFailed'),
    text2: msg,
  });
};


const register_failed = msg => {
  Toast.show({

    type: 'error',
    text1: translate('registrationFailed'),
    text2: msg,
  });
};

const register_success = () => {
  Toast.show({
    type: 'success',
    text1: translate('registrationSuccess'),
    text2: translate('registrationSuccessMsg'),
  });
};

const otp_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('invalidCode'),
    text2: msg ? msg : translate('invalidCodeMsg'),
  });
};

const get_profile_failed = () => {
  Toast.show({
    type: 'error',
    text1: translate('requestFailed'),
    text2: translate('requestFailedMsg'),
  });
};

const edit_profile_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('requestFailed'),
    text2: msg,
  });
};

const validate_phone_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('invalidPhone'),
    text2: msg,
  });
};

const forget_password_failed = () => {
  Toast.show({
    type: 'error',
    text1: translate('failed'),
    text2: translate('failedMsg'),
  });
};

const otp_send_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('failedOtp'),
    text2: msg,
  });
};

const reset_password_success = () => {
  Toast.show({
    type: 'success',
    text1: translate('passwordChanged'),
    text2: translate('passwordChangedMsg'),
  });
};

const reset_password_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('passwordFailed'),
    text2: msg,
  });
};

const otp_send_success = msg => {
  Toast.show({
    type: 'success',
    text1: translate('otp'),
    text2: translate('otpMsg') + msg,
  });
};

const fields_are_empty = () => {
  Toast.show({
    type: 'error',
    text1: translate('emptyField'),
    text2: translate('emptyFieldMsg'),
  });
};

const login_with_provider_failed = provder => {
  Toast.show({
    type: 'error',
    text1: translate('loginFailed'),
    text2: translate('failedWith') + ` ${provder} `,
  });
};

const login_with_provider_success = provder => {
  Toast.show({
    type: 'success',
    text1: translate('loginSuccess'),
    text2: translate('successfulWith') + ` ${provder}`,
  });
};

const add_address_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('limitExceeded'),
    text2: `${msg}`,
  });
};

const delete_address_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('failedToDelete'),
    text2: `${msg}`,
  });
};

export default {
  register_failed,
  register_success,
  otp_failed,
  get_profile_failed,
  edit_profile_failed,
  validate_phone_failed,
  login_failed,
  otp_send_failed,
  forget_password_failed,
  reset_password_success,
  reset_password_failed,
  otp_send_success,
  fields_are_empty,
  login_with_provider_failed,
  login_with_provider_success,
  add_address_failed,
  delete_address_failed,
};
