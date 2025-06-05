import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from './axiosConfig';

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

const forgetPassword = values => axiosClient.post('/forgot-password?lang=' + lang, values);

const resetPassword = values => axiosClient.post('/reset-password?lang='+lang, values);

const getCategories = () => axiosClient.get('/categories?lang=' + lang);

const getProviderCategories = () =>
  axiosClient.post('/get_provider_categories?lang=' + lang);

const addProviderCategories = values =>
  axiosClient.post('/add_provider_categories?lang=' + lang, values);

const getProviderData = () =>
  axiosClient.get('/get_provider_data?lang=' + lang);

const getCategoryProviders = values =>
  axiosClient.post('/get_category_providers/', values);

const getPackages = () => axiosClient.get('/get_packages?lang=' + lang);

const subscribePackage = (id, payload) =>
  axiosClient.post('/subscribe_package/' + id, payload);

const getUserProducts = () =>
  axiosClient.get('/get_user_products?lang=' + lang);

const getUserServices = () =>
  axiosClient.get('/get_user_services?lang=' + lang);

const getColors = () => axiosClient.get('/get_colors?lang=' + lang);

const getSizes = () => axiosClient.get('/get_sizes?lang=' + lang);

const getEmployees = () => axiosClient.get('/get_employees?lang=' + lang);

const getEmployeeServices = id =>
  axiosClient.get('/get_employee_services/' + id);

const getDashboardProviderByCategory = (id, params) =>
  axiosClient.get(
    `/get_dashboard_provider_by_category/${id}?lat=${params?.lat}&lng=${params?.lng}`,
  );

const getDashboardProviderServices = (id, values) =>
  axiosClient.post(
    `/get_dashboard_provider_services/${id}` + '?lang=' + "en",
    values,
  );

const getDashboardProviderProducts = (id, values) =>
  axiosClient.post(
    `/get_dashboard_provider_products/${id}` + '?lang=' + "en",
    values,
  );

const getProviderItemDetails = id =>
 axiosClient.get(`/get_provider_item_details/${id}` + '?lang=' + lang);

const get_stripe_key = () => axiosClient.get(`get_stripe_key`);

export default {
  forgetPassword,
  resetPassword,
  getCategories,
  getProviderCategories,
  addProviderCategories,
  getCategoryProviders,
  getPackages,
  subscribePackage,
  getUserProducts,
  getUserServices,
  getColors,
  getSizes,
  getProviderData,
  getEmployees,
  getEmployeeServices,
  getDashboardProviderByCategory,
  getDashboardProviderServices,
  getDashboardProviderProducts,
  getProviderItemDetails,
  get_stripe_key,
};
