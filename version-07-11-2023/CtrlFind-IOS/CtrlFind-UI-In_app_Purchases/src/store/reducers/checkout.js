import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Alert, Platform} from 'react-native';
import navigation from '../../navigations/rootNavigator';
import labels from '../../constants/labels';
import helpers from '../../constants/helpers';
import server from '../../server/server';
import toast from '../../server/toast';
import axios from 'axios';
import {baseURL} from '../../server/baseUrl';
import localStorage from '../../server/localStorage';
import {translate} from "../../multiLang/translation";

const initialState = {
  payment_type: '',
  checkoutData: {
    delivery_address_label: '',
    delivery_type: 'standardDelivery',
    name: '',
    delivery_address_value: '',
    lat: null,
    lng: null,
    email: '',
    phone: '',
  },
  loading: false,
  filePath: [],
};
//CREATE ORDER WITH CASH ON DELIVERY
export const createOrderWithCod = createAsyncThunk(
  'checkout/createOrderWithCod',
  async (payload, {dispatch}) => {
    console.log('payloadpayload===', payload);

    dispatch(setLoading(true));
    server.createOrderWithCod(payload).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) {
        toast.order_failed();
        navigation.navigate('order_failed', {order: resp.data});
      } else {
        // alert("hy order ban gya")
        navigation.navigate('order_success', {order: resp.data});
      }
    });
  },
);

export const onPay = createAsyncThunk(
  'checkout/onPay',
  async (formData, {dispatch, getState}) => {
    console.log("FormData of Order Creation ==>"+JSON.stringify(formData))

    dispatch(setLoading(true));
    server.checkout(formData).then(async resp => {
      console.log('data qaisar bhai', resp);

      if (!resp.ok) {
        dispatch(setLoading(false));
        toast.order_failed(resp.data?.message);
        navigation.navigate('order_failed', {order: resp.data});
      } else {
        const service_ids = resp.data?.service_ids ?? [];
        const order_ids = resp.data?.order_ids ?? [];

        if (Object.keys(service_ids).length && Object.keys(order_ids).length) {
          const {filePath} = getState().checkout;
          console.log('filePath---->', filePath);
          console.log('service_ids---->', service_ids);
          console.log('order_ids---->', order_ids[0]);

          let form = new FormData();
          const file1 = filePath[0];
          const file2 = filePath[1];
          const file3 = filePath[2];

          form.append(`order_id`, order_ids[0]);
          form.append(`attachment`, file1);
          form.append(`attachment_1`, file2);
          form.append(`attachment_2`, file3);

          console.log('form--->', form);

          server.appointmentAttachment(form).then(attrachmentResponse => {
            console.log('attrachmentResponse===', attrachmentResponse);

            dispatch(setLoading(false));
            navigation.navigate('order_success_without_payment', {
              order: resp?.data,
            });
          });
          // const token = await localStorage.getToken();
          // axios
          //   .post(`${baseURL}/appointment_attachment`, form, {
          //     headers: {
          //       'Content-Type': 'multipart/form-data',
          //       Authorization: `Bearer ${token}`,
          //     },
          //   })
          //   .then(({data}) => console.log(data))
          //   .catch(error => console.log('error-->', error.response.data))
          //   .finally(() => {
          //     dispatch(setLoading(false));
          //     navigation.navigate('order_success_without_payment', {
          //       order: resp?.data,
          //     });
          //   });
        } else {
          dispatch(setLoading(false));
          navigation.navigate('order_success_without_payment', {
            order: resp?.data,
          });
        }
      }
    });
  },
);

export const onOrderPayment = createAsyncThunk(
  'checkout/onOrderPayment',
  async (id, {dispatch}) => {
    dispatch(setLoading(true));
    server.orderPayment(id).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) {
        dispatch(setLoading(false));
        toast.order_failed(resp.data?.message);
        navigation.navigate('order_failed', {order: resp.data, id: id});
      } else {
        // alert("ho gai ")
        navigation.navigate('order_success', {order: resp.data, id: id});
        // server
        //   .sendOrderDetailsMail({
        //     ...formData,
        //     invoices: resp.data?.invoice_nr ? resp.data.invoice_nr : [],
        //   })
        //   .then(() => {
        //     navigation.navigate('order_success', {order: resp.data});
        //   });
      }
    });
  },
);

// GETTING DASHBOARD PROVIDERS
export const onPressPayment = createAsyncThunk(
  'checkout/onPressPayment',
  async (
    {values, discount, type, cartItem, selectedProvider, role, user1},
    {dispatch, getState},
  ) => {
    try {
      const payment_type = getState().checkout.payment_type;

      const gst = selectedProvider?.is_paying_taxes
        ? helpers.calculateTax(
            cartItem[0]?.items,
            user1?.buyer_province?.gst_tax_percentage,
            discount,
            type,
          )
        : '0.00';

      const pst = selectedProvider?.is_paying_taxes
        ? helpers.calculateTax(
            cartItem[0]?.items,
            user1?.buyer_province?.pst_tax_percentage,
            discount,
            type,
          )
        : '0.00';

      // const ta = helpers.getTotalAmount(cartItem[0]?.items);
      const total_before_tax = helpers.getTotalAmoutWithCoupon(
        cartItem[0]?.items,
        discount,
        type,
      );

      const total_price = helpers.calculateGrandTotal(
        cartItem[0],
        discount,
        type,
        user1?.buyer_province?.gst_tax_percentage,
        user1?.buyer_province?.pst_tax_percentage,
        selectedProvider,
      );

      const image = helpers.get_image(selectedProvider?.avatar);

      let totalDiscount = 0;

      let ordersTotalAmount = helpers.getTotalAmount(cartItem[0].items);

      // Apply discount to item
      if (discount !== undefined && discount > 0) {
        if (type === 'flat') {
          totalDiscount = discount;
        } else {
          totalDiscount = (ordersTotalAmount * discount) / 100;
        }
      }
      console.log(total_before_tax, '--total_before_tax');
      console.log(total_price, '--total_price');
      console.log(totalDiscount, '--totalDiscount');

      const modifiedItems = cartItem[0].items.map(item => {
        let subTotal = parseFloat(item.price) * item.qty;

        let itemTotalAmount = parseFloat(item.price) * item.qty;

        let itemDiscount =
          (itemTotalAmount / ordersTotalAmount) * totalDiscount;
        itemTotalAmount -= itemDiscount;

        // Apply taxes to item if taxable
        let itemGstTax = 0;
        let itemPstTax = 0;

        const isTaxable =
          item?.taxable === 'Y' && selectedProvider?.is_paying_taxes === 1;

        const gstTaxPercentage = user1?.buyer_province?.gst_tax_percentage;
        const pstTaxPercentage = user1?.buyer_province?.pst_tax_percentage;

        if (isTaxable) {
          if (gstTaxPercentage !== null && gstTaxPercentage > 0) {
            itemGstTax = (itemTotalAmount * gstTaxPercentage) / 100;
          }
          if (pstTaxPercentage !== null && pstTaxPercentage > 0) {
            itemPstTax = (itemTotalAmount * pstTaxPercentage) / 100;
          }

          itemTotalAmount += itemGstTax + itemPstTax;
        }

        console.log(subTotal, '--subTotal');
        console.log(itemDiscount, '--itemDiscount');
        console.log(itemGstTax, '--itemGstTax');
        console.log(itemPstTax, '--itemPstTax');
        console.log(itemTotalAmount, '--itemTotalAmount');

        if (itemTotalAmount <= 0) {
          itemTotalAmount = 0;
        } else {
          itemTotalAmount = itemTotalAmount.toFixed(3);
        }

        return {
          ...item,
          sub_total: subTotal,
          discount: itemDiscount,
          gst: itemGstTax,
          pst: itemPstTax,
          price: itemTotalAmount,
        };
      });
      // console.log(JSON.stringify(modifiedItems));

      const formData = {
        cart: {
          ...cartItem[0],
          items: modifiedItems,
          total_before_tax,
          discount: discount === undefined ? 0 : discount,
          type,
          gst,
          pst,
          total_price,
          image,
        },
        info: values,
      };

      if (payment_type === 'cod') {
        Alert.alert(
          '',
         translate("paymentCashonDelivery")+ ` ${total_price}. `+translate("confirmproceedorder"),
          [
            {
              text: translate("cancel"),
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: translate("CONFIRM"),
              onPress: () => dispatch(createOrderWithCod(formData)),
              style: 'default',
            },
          ],
        );
      }
      if (payment_type === 'online') {
        Alert.alert(
          '',
          translate("providervalidation"),
          [
            {
              text: translate("cancel"),
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: translate("CONFIRM"),
              onPress: () => dispatch(onPay(formData)),
              style: 'default',
            },
          ],
        );

        // navigation.navigate('productPayment', {formData});
      }
    } catch (error) {
      console.log(error, ' error');
    }
  },
);

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  extraReducers: {},
  reducers: {
    goToCheckout: (state, {payload}) => {
      state.checkoutData.name = payload?.name;
      state.checkoutData.email = payload?.email;
      state.checkoutData.phone = payload?.phone;
      state.checkoutData.delivery_type = 'Standard Delivery';
      if (payload?.home_lat) {
        state.checkoutData.delivery_address_label = labels.HOME_ADDRESS;
        state.checkoutData.delivery_address_value = payload?.address_home;
        state.checkoutData.lat = payload?.home_lat ? payload.home_lat : null;
        state.checkoutData.lng = payload?.home_lng ? payload.home_lng : null;
      }
      if (payload?.office_lat) {
        state.checkoutData.delivery_address_label = labels.OFFICE_ADDRESS;
        state.checkoutData.delivery_address_value = payload?.address_office;
        state.checkoutData.lat = payload?.office_lat
          ? payload.office_lat
          : null;
        state.checkoutData.lng = payload?.office_lng
          ? payload.office_lng
          : null;
      }
      if (!payload?.office_lat && !payload?.home_lat) {
        state.checkoutData.delivery_address_label = labels.OTHERS;
        state.checkoutData.delivery_address_value = '';
        state.checkoutData.lat = null;
        state.checkoutData.lng = null;
      }
      navigation.navigate('checkout');
    },
    setDeliveryAddress: (state, {payload}) => {
      const {label, user} = payload;
      if (label === labels.HOME_ADDRESS) {
        state.checkoutData.delivery_address_value = user?.address_home;
        state.checkoutData.lat = user?.home_lat ? user.home_lat : null;
        state.checkoutData.lng = user?.home_lng ? user.home_lng : null;
      }
      if (label === labels.OFFICE_ADDRESS) {
        state.checkoutData.delivery_address_value = user?.address_office;
        state.checkoutData.lat = user?.office_lat ? user.office_lat : null;
        state.checkoutData.lng = user?.office_lng ? user.office_lng : null;
      }
      if (label === labels.OTHERS) {
        state.checkoutData.delivery_address_value = '';
        state.checkoutData.lat = null;
        state.checkoutData.lng = null;
      }
      state.checkoutData.delivery_address_label = label;
    },
    setPaymentType: (state, {payload}) => {
      console.log("payload==",JSON.stringify(payload))
      state.payment_type = payload;
    },
    setAddress: (state, {payload}) => {
      state.checkoutData.delivery_address_label = labels.OTHERS;
      state.checkoutData.delivery_address_value = payload?.address;
      state.checkoutData.lat = payload?.lat;
      state.checkoutData.lng = payload?.lng;
    },
    setDeliveryType: (state, {payload}) => {
      state.checkoutData.delivery_type =
        helpers.getProductDeliveryTypes(payload);
    },

    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setFilePath: (state, {payload}) => {
      state.filePath.push(payload);
      console.log('data files payload', payload);
      console.log('data file path', state.filePath);
    },
    resetFilePath: (state, {payload}) => {
      state.filePath = [];
    },

    deleteFilePath: (state, {payload}) => {
      console.log('payload index==', payload);
      // state.filePath?.splice(payload, 1);

      for (let i = 0; i < state.filePath.length; i++) {
        if (state.filePath[i].fileName === payload) {
          state.filePath.splice(i, 1);
        }
      }

      console.log(state.filePath);
    },
  },
});

export const {
  goToCheckout,
  setDeliveryAddress,
  setDeliveryType,
  setAddress,
  setPaymentType,
  setLoading,
  setFilePath,
  resetFilePath,
  deleteFilePath,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
