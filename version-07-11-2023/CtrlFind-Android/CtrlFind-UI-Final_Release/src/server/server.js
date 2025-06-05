import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './config';
import {values} from '@babel/runtime/helpers/regeneratorRuntime';
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


const addUserProducts = values => client.post('/add_user_products/', values);

const addUserServices = values => client.post('/add_user_services/', values);

const getItemDetails = id => client.get('/get_item_details/' + id);

const removeImage = id => client.delete('/remove_media/' + id);

const updateItem = (id, values) => client.post('/update_item/' + id, values);

const deleteItem = id => client.delete('/delete_item/' + id);

// USER ATTRIBUTES
const addSize = values => client.post('/add_size/', values);

const updateSize = (id, values) => client.post('/edit_size/' + id, values);

const removeSize = id => client.delete('/remove_size/' + id);

const addColor = values => client.post('/add_color/', values);

const updateColor = (id, values) => client.post('/edit_color/' + id, values);

const removeColor = id => client.delete('/remove_color/' + id);

// EMPLOYEES
const addEmploye = values => client.post('/add_employee/', values);

const updateEmploye = (id, values) =>
  client.post('/update_employee/' + id, values);

const deleteEmploye = id => client.delete('/delete_employee/' + id);

const removeEmployeeService = id =>
  client.post('/remove_employee_service/' + id);

// SCHEDULE
const getSchedule = values => client.post('get_schedule/', values);

const deleteSchedule = id => client.delete('delete_schedule/' + id);

const createSchedule = values => client.post('create_schedule/', values);

const saveTemplate = values => client.post('save_template/', values);

const getTemplates = () => client.get('get_templates');

const updateSchedule = (id, values) =>
  client.post('update_schedule/' + id, values);

const getScheduleDates = values => client.post('get_schedule_dates', values);

const getAllScheduleDates = () => client.get('get_all_schedule_dates');

const getScheduleTiming = id => client.get('get_schedule_timing/' + id);

const getProviderScheduleDates = (id, values) =>
  client.post('/get_provider_schedule_dates/' + id, values);

const createAppointment = values => client.post('/create_appointment/', values);

const appointmentAttachment = values => {

  console.log("value check in api screen ",values)
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  return client.post('appointment_attachment', values, headers);
};

const createAppointmentInstant = values =>
  client.post('/create_appointment_instant/', values);

const createOrderWithCod = values =>
    // alert("order ho create")
console.log("order howa create",values)
  client.post('/create_order_with_cod/', values);

const getClientSecret = values => client.post('/get_client_secret/', values);

const checkout = values => client.post('/checkout/', values);

const getProviderOrders = (status, data) => {
  console.log("status"+status+"===data"+JSON.stringify(data))
  return data?.title === 'Products'
    ? client.post(`get_provider_orders?filter[status]=${status}`, data)
    : client.post(`get_provider_orders?filter[service_status]=${status}`, data);
};

const getBuyerOrders = (status, data) => {
  return data?.title === 'Products'
    ? client.post(`get_buyer_orders?filter[status]=${status}`, data)
    : client.post(`get_buyer_orders?filter[service_status]=${status}`, data);
};

const orderDetails = id => client.get('/order_details/' + id);

const changeOrderStatus = id => client.post('/change_order_status/' + id);

const changeServiceOrderStatus = id =>
  client.post('/change_service_order_status/' + id);

const getBuyerAppointments = () => client.get('get_buyer_appointments');

const getProviderAppointments = () => client.get('get_provider_appointments');

const getAppointmentDetails = id =>
  client.get('/get_appointment_details/' + id);

const orderTrackingState = (id, values) =>
  client.post('/order_tracking_state/' + id, values);

const userUpdateCoords = values => client.post('/user_update_coords', values);

const orderDetailsWithProvider = id =>
  client.get('/order_details_with_provider/' + id);

const getProviderLocation = id => client.get('/get_provider_location/' + id);

const addItemreview = values => client.post('/add_item_review', values);

const getUserFriendsList = () => client.get('/get_user_friends_list');

const getChatMessages = id => client.get('/get_chat_messages/' + id);

const getChatId = values => client.post('/get_chat_id', values);

const createMessage = values => client.post('/create_message', values);

const getPaymentsHistory = () => client.get('/get_payments_history');

const getPage = slug => client.get('/page/' + slug);

const searchService = search => client.post('/search_service?search=' + search+'&lang='+lang);

const requestCategory = values => client.post('/request_category', values);

const addUserReview = values => client.post('/add_user_review', values);

const updateDeviceToken = values => client.post('/update_device_token', values);

const get_faqs = () => client.get('/faq');

const extraPaymentRequest = (id, values) =>
  client.post('/extra_payment_request/' + id, values);

const extraPaymentPaid = id => client.post('/extra_payment_paid/' + id);

const getProvincesList = () => client.get('/get_provinces_list');

const sendOrderDetailsMail = values =>
  client.post('/send_order_details_mail', values);

const sendSubscriptionDetailsMail = values =>
  client.post('/send_subscription_details_mail', values);

const confirmOrder = id => client.post('/confirm_order/' + id);

const orderPayment = id => client.post('/order_payment/' + id);

const getProvince = () => client.get('/get_province');

const declineOrder = (id, values) =>
  client.post('/decline_order/' + id, values);

const cancelOrder = id => client.post('/cancel_order/' + id);


const getProviderProfile = id => client.get('/get_provider_profile/' + id);

export default {
  addUserProducts,
  addUserServices,
  getItemDetails,
  removeImage,
  updateItem,
  deleteItem,
  addSize,
  addColor,
  updateColor,
  removeColor,
  updateSize,
  removeSize,
  addEmploye,
  updateEmploye,
  deleteEmploye,
  removeEmployeeService,
  createSchedule,
  updateSchedule,
  saveTemplate,
  getTemplates,
  getSchedule,
  deleteSchedule,
  getScheduleDates,
  getAllScheduleDates,
  getScheduleTiming,
  getProviderScheduleDates,
  createAppointment,
  createAppointmentInstant,
  createOrderWithCod,
  getClientSecret,
  checkout,
  getProviderOrders,
  getBuyerOrders,
  orderDetails,
  changeOrderStatus,
  getBuyerAppointments,
  getProviderAppointments,
  getAppointmentDetails,
  orderTrackingState,
  userUpdateCoords,
  orderDetailsWithProvider,
  getProviderLocation,
  addItemreview,
  getUserFriendsList,
  getChatMessages,
  getChatId,
  createMessage,
  getPaymentsHistory,
  getPage,
  searchService,
  requestCategory,
  addUserReview,
  updateDeviceToken,
  get_faqs,
  changeServiceOrderStatus,
  extraPaymentRequest,
  extraPaymentPaid,
  getProvincesList,
  sendOrderDetailsMail,
  sendSubscriptionDetailsMail,
  confirmOrder,
  orderPayment,
  getProvince,
  declineOrder,
  cancelOrder,
  appointmentAttachment,
  getProviderProfile
};
