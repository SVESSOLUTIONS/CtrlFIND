import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import navigation from '../../navigations/rootNavigator';
import server from '../../server/server';
import toast from '../../server/toast';

const initialState = {
  orders: [],
  services: [],
  index: 0,
  serviceIndex: 0,
  orderdetail: null,
  provider_coords: null,
  mapOrderDetail: null,
  loading: false,
  serverLoading: false,
  isVisible: false,
  title: 'Products',
};

//getting provider orders
export const getProviderOrders = createAsyncThunk(
  'orders/getProviderOrders',
  async (payload, {dispatch, getState}) => {
    const {orders} = getState();
    dispatch(setLoading(true));
    server
      .getProviderOrders(payload, {
        title: orders?.title,
      })
      .then(resp => {
        dispatch(setLoading(false));
        console.log("response"+JSON.stringify(resp.data[0]))
        if (!resp.ok) return;
        dispatch(setOrders(resp.data));
      });
  },
);

//getting buyer orders
export const getBuyerOrders = createAsyncThunk(
  'orders/getBuyerOrders',
  async (payload, {dispatch, getState}) => {
    const {orders} = getState();
    dispatch(setLoading(true));
    server
      .getBuyerOrders(payload, {
        title: orders?.title,
      })
      .then(resp => {
        dispatch(setLoading(false));
        if (!resp.ok) return;
        dispatch(setOrders(resp.data));
      });
  },
);

//order details
export const orderDetails = createAsyncThunk(
  'orders/orderDetails',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    server.orderDetails(payload).then(resp => {
      dispatch(setLoading(false));
      dispatch(setServerLoading(false));
      if (!resp.ok) return;
      dispatch(setOrderDetails(resp.data));

    });
  },
);

//change order details
export const changeOrderStatus = createAsyncThunk(
  'orders/changeOrderStatus',
  async (payload, {dispatch}) => {
    dispatch(setServerLoading(true));
    server.changeOrderStatus(payload).then(resp => {
      dispatch(setServerLoading(false));
      if (!resp.ok) return;
      dispatch(setOrderDetails(resp.data));
      dispatch(updateOrderStatus(resp.data));
    });
  },
);

//change service order details
export const changeServiceOrderStatus = createAsyncThunk(
  'orders/changeServiceOrderStatus',
  async (payload, {dispatch}) => {
    dispatch(setServerLoading(true));
    server.changeServiceOrderStatus(payload).then(resp => {
      dispatch(setServerLoading(false));
      if (!resp.ok) return;
      dispatch(setOrderDetails(resp.data));
      dispatch(updateOrderStatus(resp.data));
    });
  },
);

//extra payment request
export const extraPaymentRequest = createAsyncThunk(
  'orders/extraPaymentRequest',
  async ({id, values}, {dispatch}) => {
    dispatch(setServerLoading(true));
    server.extraPaymentRequest(id, values).then(resp => {
      dispatch(setServerLoading(false));
      if (!resp.ok) return;
      dispatch(updateOrderPaymentStatus(resp.data));
      toast.paymentRequestSuccess('payment request successfully submitted');
      navigation.goBack();
    });
  },
);

//extra payment paid
export const extraPaymentPaid = createAsyncThunk(
  'orders/extraPaymentPaid',
  async (payload, {dispatch}) => {
    dispatch(setServerLoading(true));
    server.extraPaymentPaid(payload).then(resp => {
      dispatch(setServerLoading(false));
      if (!resp.ok) return;
      dispatch(updateOrderPaymentStatus(resp.data));
      toast.paymentRequestSuccess('payment request successfully paid');
      navigation.goBack();
    });
  },
);

//order tracking state
export const orderTrackingState = createAsyncThunk(
  'orders/orderTrackingState',
  async ({id, values}, {dispatch}) => {
      console.log("id=>"+id+" valuse=>"+JSON.stringify(values))
    dispatch(setServerLoading(true));
    const resp = await server.orderTrackingState(id, values);
    dispatch(setServerLoading(false));
    if (!resp.ok) {
      return null;
    }
    dispatch(setOrderDetails(resp.data['order_details']));
    return resp.data?.user;
  },
);

//user location update
export const userUpdateCoords = createAsyncThunk(
  'orders/userUpdateCoords',
  async (payload, {dispatch}) => {
    await server.userUpdateCoords(payload);
  },
);

//get order details with provider
export const orderDetailsWithProvider = createAsyncThunk(
  'orders/orderDetailsWithProvider',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    const resp = await server.orderDetailsWithProvider(payload);
    dispatch(setLoading(false));
    if (!resp.ok) return null;
    dispatch(setMapOrderDetail(resp.data));
    return resp.data;
  },
);

//getProviderLocation
export const getProviderLocation = createAsyncThunk(
  'orders/getProviderLocation',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    const resp = await server.getProviderLocation(payload);
    dispatch(setLoading(false));
    if (!resp.ok) return null;
    return resp.data;
  },
);

//addUserReview
export const addUserReview = createAsyncThunk(
  'orders/addUserReview',
  async (payload, {dispatch}) => {
    dispatch(setServerLoading(true));
    const resp = await server.addUserReview(payload);
    dispatch(setServerLoading(false));
    if (!resp.ok) return null;
    dispatch(setReviewInOrder(resp.data));
    dispatch(setIsVisible(false));
  },
);

//onConfirmOrder
export const onConfirmOrder = createAsyncThunk(
  'orders/onConfirmOrder',
  async (payload, {dispatch}) => {
    dispatch(setServerLoading(true));
    const resp = await server.confirmOrder(payload);
    if (!resp.ok) return null;
    dispatch(orderDetails(payload));
  },
);

//onDeclineOrder
export const onDeclineOrder = createAsyncThunk(
  'orders/onDeclineOrder',
  async ({id, values}, {dispatch}) => {
    dispatch(setServerLoading(true));
    const resp = await server.declineOrder(id, values);
    dispatch(setServerLoading(false));
    if (!resp.ok) return null;
    dispatch(orderDetails(id));
  },
);

//onCancelOrder
export const onCancelOrder = createAsyncThunk(
  'orders/onCancelOrder',
  async (payload, {dispatch}) => {
    dispatch(setServerLoading(true));
    const resp = await server.cancelOrder(payload);
    if (!resp.ok) return null;
    dispatch(orderDetails(payload));
  },
);

//on press chat

export const onPressChat = createAsyncThunk(
  'orders/onPressChat',
  async (payload, {dispatch}) => {
    dispatch(setServerLoading(true));
    server
      .getChatId({
        friend_id: payload,
      })
      .then(resp => {
        dispatch(setServerLoading(false));
        if (!resp.ok) return;
        navigation.navigate('chat', {
          screen: 'user_chat',
          params: resp.data,
        });
      });
  },
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  extraReducers: {},
  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setOrders: (state, {payload}) => {
      const services = payload.filter(item => item.order_type === 'service');
      const products = payload.filter(item => item.order_type === 'product');
      state.orders = products;
      state.services = services;
    },
    setOrderDetails: (state, {payload}) => {
      state.orderdetail = payload;
    },
    setMapOrderDetail: (state, {payload}) => {
      state.mapOrderDetail = payload;
      state.provider_coords = {
        lat: payload?.provider?.lat,
        lng: payload?.provider?.lng,
      };
    },
    setFilter: (state, {payload}) => {
      state.filter = payload;
    },
    setIndex: (state, {payload}) => {
      state.index = payload;
    },
    setServiceIndex: (state, {payload}) => {
      state.serviceIndex = payload;
    },
    setTitle: (state, {payload}) => {
      state.orders = [];
      state.services = [];
      state.title = payload;
    },
    setServerLoading: (state, {payload}) => {
      state.serverLoading = payload;
    },
    setProviderCoords: (state, {payload}) => {
      state.provider_coords = payload;
    },

    updateOrderStatus: (state, {payload}) => {
      const id = payload?.id;
      state.orders.map((order, i) =>
        order.id === id
          ? order?.order_type === 'product'
            ? (state.orders[i].status = payload?.status)
            : (state.orders[i].service_status = payload?.service_status)
          : null,
      );
    },
    setIsVisible: (state, {payload}) => {
      state.isVisible = payload;
    },
    setReviewInOrder: (state, {payload}) => {
      state.orderdetail.review = payload;
    },

    updateOrderPaymentStatus: (state, {payload}) => {
      state.orderdetail['extra_service_fee'] = payload?.extra_service_fee;
      state.orderdetail['extra_service_fee_status'] =
        payload?.extra_service_fee_status;
    },
    onRefundStatusChanged: (state, {payload}) => {
      state.orderdetail.refund_status = 'requested';
    },
  },
});

export const {
  setLoading,
  setOrders,
  setOrderDetails,
  setMapOrderDetail,
  setFilter,
  setServerLoading,
  setProviderCoords,
  updateOrderStatus,
  setIndex,
  setServiceIndex,
  setIsVisible,
  setReviewInOrder,
  setTitle,
  updateOrderPaymentStatus,
  onRefundStatusChanged,
} = ordersSlice.actions;

export default ordersSlice.reducer;
