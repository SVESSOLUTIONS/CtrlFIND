import {configureStore} from '@reduxjs/toolkit';

import forgetPasswordReducer from './reducers/forgetPassword';
import categoriesReducer from './reducers/categories';
import subscriptionsReducer from './reducers/subscriptions';
import userItemsReducer from './reducers/userItems';
import userAttributesReducer from './reducers/userAttributes';
import employeesReducer from './reducers/employees';
import buyerDashboardReducer from './reducers/buyerDashboard';
import cartReducer from './reducers/cart';
import scheduleReducer from './reducers/schedule';
import appointmentsReducer from './reducers/appointments';
import checkoutReducer from './reducers/checkout';
import ordersReducer from './reducers/orders';
import chatReducer from './reducers/chat';
import paymentsReducer from './reducers/payments';
import pagesReducer from './reducers/pages';

export const store = configureStore({
  reducer: {
    forgetPassword: forgetPasswordReducer,
    categories: categoriesReducer,
    subscriptions: subscriptionsReducer,
    userItems: userItemsReducer,
    userAttributes: userAttributesReducer,
    employees: employeesReducer,
    buyerDashboard: buyerDashboardReducer,
    cart: cartReducer,
    schedule: scheduleReducer,
    appointments: appointmentsReducer,
    checkout: checkoutReducer,
    orders: ordersReducer,
    chat: chatReducer,
    payments: paymentsReducer,
    pages: pagesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
