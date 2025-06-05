import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AddNewProductsScreen,
  AddNewServicesScreen,
  AddScheduleScreen,
  AllPaymentsScreen,
  AppointmentBooked,
  AppointmentScreen,
  BuyerProfileScreen,
  CartOrderReviewScreen,
  CartScreen,
  CategoriesScreen,
  CategoryItemsDetailsScreen,
  CategoryItemsScreen,
  ChatListScreen,
  ChatScreen,
  CheckOutScreen,
  ColorsScreen,
  DeliveryDetailsScreen,
  EditProfileScreen,
  EmployeeServicesScreen,
  EmployeesProfileScreen,
  EmployeesScreen,
  ForgetPasswordScreen,
  ItemsScreen,
  LoginScreen,
  MapScreen,
  MyScheduleScreen,
  OrderFailedScreen,
  OrdersScreen,
  OrderSuccessScreen,
  PaymentsScreen,
  ProfileScreen,
  ProviderProductDetailsScreen,
  ProviderScreen,
  CategoryProvidersDetailsScreen,
  ProviderServiceDetailsScreen,
  RefundScreen,
  RegisterScreen,
  ResetPasswordScreen,
  ScheduleAppointmentScreen,
  ScheduleListScreen,
  ServiceDetailsScreen,
  ServiceFilterScreen,
  ShopScreen,
  SizesScreen,
  SubscriptionsDetailsScreen,
  SubscriptionsScreen,
  TrackingOrderScreen,
  VerificationScreen,
  BookAppointmentScreen,
  ConfirmAppointment,
  ConfirmBuyerAppointmentScreen,
  ProductPayment,
  AppointmentPayment,
  BuyerDeliveryDetailsScreen,
  BuyerOrdersScreen,
  BuyerAppointmentScreen,
  SubscriptionPayment,
  TermsScreen,
  BuyerServiceDeliveryScreen,
  ProviderDeliveryStatusDetails,
  PayExtraServiceFee,
  NotificationsScreen,
} from '../screens';
import helpers from '../constants/helpers';
import useAuth from '../hooks/useAuth';
import {ExtraPaymentScreen} from '../screens/root/extraPayment';
import {OrderSuccessWithoutPaymentScreen} from '../screens/root/OrderSuccessWithoutPayment';
import {ProviderProfileScreen} from "../screens/root/ProviderProfile";
import AuthContext from "../context/AuthContext";

const Stack = createStackNavigator();


export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="login"
        component={LoginScreen}
      />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="verification" component={VerificationScreen} />
      <Stack.Screen name="forget" component={ForgetPasswordScreen} />
      <Stack.Screen name="reset" component={ResetPasswordScreen} />
      <Stack.Screen name="terms" component={TermsScreen} />
    </Stack.Navigator>
  );
};

export const ProviderAppointmentsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="my_appointments"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="my_appointments" component={AppointmentScreen} />
      <Stack.Screen
        name="provider_appointment_details"
        component={ProviderDeliveryStatusDetails}
      />

        <Stack.Screen name="notification_stack" component={NotificationsScreen} />
      {/*
      <Stack.Screen
        name="appointment_information"
        component={AppointmentInformationScreen}
      />
      <Stack.Screen
        name="schedule_appointment"
        component={ScheduleAppointmentScreen}
      />
      <Stack.Screen
        name="appointment_confirmation"
        component={AppointmentConfirmationScreen}
      />
      <Stack.Screen name="appointment_booked" component={AppointmentBooked} /> */}
    </Stack.Navigator>
  );
};

export const BuyerAppointmentsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="buyer_appointments"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="buyer_appointments"
        component={BuyerAppointmentScreen}
      />
      <Stack.Screen
        name="buyer_appointment_details"
        component={BuyerServiceDeliveryScreen}
      />
        <Stack.Screen name="notification_stack" component={NotificationsScreen} />

      {/* <Stack.Screen
        name="appointment_information"
        component={AppointmentInformationScreen}
      /> */}
    </Stack.Navigator>
  );
};

export const ProfileStack = () => {
  const {user} = useContext(AuthContext);
     {console.log("useContext(AuthContext)=="+JSON.stringify(user?.role_id))}
  return (
    <Stack.Navigator
      initialRouteName={

        helpers.getRole(user?.role_id) === 3
          ? 'my_profile':helpers.getRole(user?.role_id) === 2?
           'buyer_profile':null
      }
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="my_profile" component={ProfileScreen} />
      <Stack.Screen name="buyer_profile" component={BuyerProfileScreen} />
      <Stack.Screen name="edit_profile" component={EditProfileScreen} />
        <Stack.Screen name="notification_stack" component={NotificationsScreen} />

    </Stack.Navigator>
  );
};

export const BuyerOrdersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="buyer_orders_screen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="buyer_orders_screen" component={BuyerOrdersScreen} />
      <Stack.Screen
        name="buyer_delivery_status_details"
        component={BuyerDeliveryDetailsScreen}
      />
      <Stack.Screen
        name="buyer_service_delivery_status_details"
        component={BuyerServiceDeliveryScreen}
      />
      <Stack.Screen
        name="pay_extra_service_fee"
        component={PayExtraServiceFee}
      />
        <Stack.Screen
            options={{
                animationEnabled: false,
            }}
            name="order_success"
            component={OrderSuccessScreen}
        />
      <Stack.Screen
        name="buyer_tracking_order"
        component={TrackingOrderScreen}
      />
      <Stack.Screen name="refund" component={RefundScreen} />

    </Stack.Navigator>
  );
};

export const NotificationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="notification_stack"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="notification_stack" component={NotificationsScreen} />
      <Stack.Screen
        name="provider_service_delivery_status_details"
        component={ProviderDeliveryStatusDetails}
      />
      <Stack.Screen
        name="delivery_status_details"
        component={DeliveryDetailsScreen}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="productPayment"
        component={ProductPayment}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="order_success"
        component={OrderSuccessScreen}
      />
        <Stack.Screen
            name="buyer_delivery_status_details"
            component={BuyerDeliveryDetailsScreen}
        />
        <Stack.Screen
            name="buyer_service_delivery_status_details"
            component={BuyerServiceDeliveryScreen}
        />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="order_failed"
        component={OrderFailedScreen}
      />
      <Stack.Screen
        name="pay_extra_service_fee"
        component={PayExtraServiceFee}
      />
    </Stack.Navigator>
  );
};

export const ShopStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="shop_dashboard"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="shop_dashboard" component={ShopScreen} />
      <Stack.Screen name="categories" component={CategoriesScreen} />
      <Stack.Screen name="colors" component={ColorsScreen} />
      <Stack.Screen name="sizes" component={SizesScreen} />
      <Stack.Screen name="category_items" component={CategoryItemsScreen} />
      <Stack.Screen
        name="category_items_details"
        component={CategoryItemsDetailsScreen}
      />
      <Stack.Screen name="add_new_products" component={AddNewProductsScreen} />
      <Stack.Screen name="add_new_services" component={AddNewServicesScreen} />
        <Stack.Screen name="notification_stack" component={NotificationsScreen} />
      <Stack.Screen name="orders" component={OrdersScreen} />
      <Stack.Screen
        name="delivery_status_details"
        component={DeliveryDetailsScreen}
      />
      <Stack.Screen
        name="provider_service_delivery_status_details"
        component={ProviderDeliveryStatusDetails}
      />

      <Stack.Screen name="extra_payment" component={ExtraPaymentScreen} />
      <Stack.Screen name="tracking_order" component={TrackingOrderScreen} />
      <Stack.Screen name="payments" component={PaymentsScreen} />
      <Stack.Screen name="all_payments" component={AllPaymentsScreen} />
      <Stack.Screen name="employees" component={EmployeesScreen} />
      <Stack.Screen name="my_schedule" component={MyScheduleScreen} />
      <Stack.Screen name="add_schedule" component={AddScheduleScreen} />
      <Stack.Screen name="schedule_list" component={ScheduleListScreen} />

      <Stack.Screen
        name="employee_profile"
        component={EmployeesProfileScreen}
      />
      <Stack.Screen
        name="employee_services"
        component={EmployeeServicesScreen}
      />
    </Stack.Navigator>
  );
};

export const SubscriptionStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="user_subscriptions"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="user_subscriptions" component={SubscriptionsScreen} />
        <Stack.Screen name="notification_stack" component={NotificationsScreen} />
      <Stack.Screen
        name="subscription_details"
        component={SubscriptionsDetailsScreen}
      />
      <Stack.Screen
        name="subscription_payment"
        component={SubscriptionPayment}
      />
        <Stack.Screen name="edit_profile" component={EditProfileScreen} />
        <Stack.Screen name="my_profile" component={ProfileScreen} />


    </Stack.Navigator>
  );
};

export const ChatStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="chat_list"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="chat_list" component={ChatListScreen} />
      <Stack.Screen name="user_chat" component={ChatScreen} />
        <Stack.Screen name="notification_stack" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export const ItemsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="items_screen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="items_screen" component={ItemsScreen} />
        <Stack.Screen name="notification_stack" component={NotificationsScreen} />
      <Stack.Screen
        name="service_details"
        component={CategoryProvidersDetailsScreen}
      />
      <Stack.Screen name="service_filter" component={ServiceFilterScreen} />
      <Stack.Screen name="map" component={MapScreen} />
      <Stack.Screen name="provider" component={ProviderScreen} />
      <Stack.Screen
        name="provider_product_details"
        component={ProviderProductDetailsScreen}
      />
      <Stack.Screen
        name="provider_service_details"
        component={ProviderServiceDetailsScreen}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="book_appointment"
        component={BookAppointmentScreen}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="confirm_buyer_appointment"
        component={ConfirmBuyerAppointmentScreen}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="confirm_appointment_information"
        component={ConfirmAppointment}
      />
      <Stack.Screen name="AppointmentPayment" component={AppointmentPayment} />

      <Stack.Screen name="appointment_success" component={AppointmentBooked} />

      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="cart"
        component={CartScreen}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="order_review"
        component={CartOrderReviewScreen}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="checkout"
        component={CheckOutScreen}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="productPayment"
        component={ProductPayment}
      />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="order_success"
        component={OrderSuccessScreen}
      />
        <Stack.Screen
            name="buyer_delivery_status_details"
            component={BuyerDeliveryDetailsScreen}
        />
        <Stack.Screen
            name="buyer_service_delivery_status_details"
            component={BuyerServiceDeliveryScreen}
        />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="order_success_without_payment"
        component={OrderSuccessWithoutPaymentScreen}
      />
        <Stack.Screen name="provider_profile" component={ProviderProfileScreen} />
      <Stack.Screen
        options={{
          animationEnabled: false,
        }}
        name="order_failed"
        component={OrderFailedScreen}
      />
    </Stack.Navigator>
  );
};
