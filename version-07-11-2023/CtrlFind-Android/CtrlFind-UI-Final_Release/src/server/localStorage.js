import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToken = token => AsyncStorage.setItem('token', token);
const getToken = () => AsyncStorage.getItem('token');
const removeToken = () => AsyncStorage.removeItem('token');
const saveLocation = location =>
  AsyncStorage.setItem('location', JSON.stringify(location));
const getLocation = () => AsyncStorage.getItem('location');
const savePushToken = token => AsyncStorage.setItem('push_token', token);
const getPushToken = () => AsyncStorage.getItem('push_token');

const saveNotificationSetting = value =>
  AsyncStorage.setItem('notification', value);

const getNotificationSetting = () => AsyncStorage.getItem('notification');

export default {
  saveToken,
  getToken,
  removeToken,
  saveLocation,
  getLocation,
  savePushToken,
  getPushToken,
  saveNotificationSetting,
  getNotificationSetting,
};
