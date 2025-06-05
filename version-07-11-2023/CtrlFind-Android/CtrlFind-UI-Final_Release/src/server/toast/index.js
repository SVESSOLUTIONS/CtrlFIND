import Toast from 'react-native-toast-message';
import {translate} from '../../multiLang/translation';

const no_network = () => {
  Toast.show({
    type: 'error',
    text1: translate('noInternet1'),
    text2: translate('noInternet1Msg'),
  });
};

const add_product_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('productFailed'),
    text2: msg,
  });
};

const add_service_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('serviceFailed'),
    text2: msg,
  });
};

const update_item_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('updateFailed'),
    text2: msg,
  });
};

const item_add_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('createFailed'),
    text2: msg,
  });
};

const item_update_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('updateFailed'),
    text2: msg,
  });
};

const item_delete_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('deleteFailed'),
    text2: msg,
  });
};

const validation_error = msg => {
  Toast.show({
    type: 'error',
    text1: translate('missingFields'),
    text2: msg,
  });
};

const appointment_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('appointmentFailed'),
    text2: msg,
  });
};

const order_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('orderFailed1'),
    text2: msg ? msg : translate('orderFailed1Msg'),
  });
};

const item_exist = msg => {
  Toast.show({
    type: 'info',
    text1: translate('cart'),
    text2: translate('cartMsg'),
  });
};

const request_sent = msg => {
  Toast.show({
    type: 'success',
    text1: translate('requestDone'),
    text2: msg,
  });
};
const enable_notifications_success = msg => {
  Toast.show({
    type: 'success',
    text1: translate('success'),
    text2: `${msg}`,
  });
};
const enable_notifications_failed = msg => {
  Toast.show({
    type: 'error',
    text1: translate('error'),
    text2: `${msg}`,
  });
};

const paymentRequestSuccess = msg => {
  Toast.show({
    type: 'success',
    text1: 'payment requested',
    text2: `${msg}`,
  });
};

const paymentSuccessful = msg => {
  Toast.show({
    type: 'success',
    text1: 'payment',
    text2: `${msg}`,
  });
};
export default {
  no_network,
  add_product_failed,
  add_service_failed,
  update_item_failed,
  item_add_failed,
  item_update_failed,
  item_delete_failed,
  validation_error,
  appointment_failed,
  order_failed,
  item_exist,
  request_sent,
  enable_notifications_success,
  enable_notifications_failed,
  paymentRequestSuccess,
  paymentSuccessful,
};
