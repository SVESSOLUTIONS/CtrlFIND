import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './config';
let lang = 'en';
const getLanguage = async () =>
  await AsyncStorage.getItem('language').then(lng => {
    console.log('My Language=' + lng);
    if (lng !== null) {
      lang = lng;
    }
    console.log(lang);
  });
getLanguage();
const register = values => client.post('/signup', values);

const register_validation = values =>
  client.post('/check_signup_validation', values);

const phoneVerification = values => client.post('/validate-phone?lang='+ lang, values);

const login = values => client.post('/login?lang='+ lang, values);
const deleteAccount = values => client.post('/delete-account/', values );

const getProfile = id => client.get(`/profile/${id}` + '?lang=' + lang);

const editProfile = values => client.post('/profile/edit?lang=' + lang, values);

const phoneNumberVerified = values =>
  client.post('/update-phone-verification', values);

const sendEmailVerificationCode = values =>
  client.post('/send_email_verification_code', values);

const VerifyEmailCode = values => client.post('/verify_code', values);

const loginUserFromSocialAccount = (provider, values) =>
  client.post(`/getUserWithSocialAccount/${provider}`, values);

const me = () => client.get('/user' + '?lang=' + lang);

const switchUser = () => client.post('/switch_user');

const addUserAddress = values =>
  client.post('/add_user_address?lang=' + lang, values);

const editUserAddress = (id, values) =>
  client.post('/edit_address/' + id, values);

const deleteAddress = id => client.delete('/delete_address/' + id);

export default {
  me,
  register,
  register_validation,
  phoneVerification,
  login,
  getProfile,
  editProfile,
  phoneNumberVerified,
  sendEmailVerificationCode,
  VerifyEmailCode,
  loginUserFromSocialAccount,
  switchUser,
  addUserAddress,
  editUserAddress,
  deleteAddress,
  deleteAccount
};
