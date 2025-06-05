import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import navigation from '../../navigations/rootNavigator';
import auth from '../../server/auth';
import toast from '../../server/toast';

const initialState = {
  cartItems: [],
  total_qty: 0,
  selectedItem: null,
  loading: false,
  selectedProvider: null,
};

// get provider details
export const getProfile = createAsyncThunk(
  'cart/getProfile',
  async (id, {dispatch}) => {
    dispatch(setLoading(true));
    auth.getProfile(id).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(setSelectedProvider(resp.data));
    });
  },
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  extraReducers: {},
  reducers: {
    onAddToCart: (state, {payload}) => {
      console.log("payload===>>>"+JSON.stringify(payload))

      // checing if provider already in cart
      const existing_provider = state.cartItems.find(
        x => x.provider_id === payload.provider_id,
      );
      //  if provider in cart add or update his items
      if (existing_provider) {
        // getting provider index
        const p_index = state.cartItems.findIndex(
          x => x.provider_id === payload.provider_id,
        );
        // getting provider item index
        const payload_product_color_label = payload?.product_color
          ? payload?.product_color?.label
          : '';
        const payload_product_size_label = payload?.product_size
          ? payload?.product_size?.label
          : '';

        const i_index = state.cartItems[p_index].items.findIndex(
          i =>
            i.id === payload?.product_id &&
            i?.color === payload_product_color_label &&
            i?.size === payload_product_size_label,
        );

        const selectedItem = state.cartItems[p_index].items[i_index];

        // if item exist update item qty
        if (selectedItem) {
          return toast.item_exist();
          state.cartItems[p_index].items[i_index].qty += 1;
        }
        // else add new item
        else {
          state.cartItems[p_index].items.push({
            id: payload?.product_id,
            name: payload?.product_name,
            order_type: payload?.order_type ?? 'product',
            category_id:payload?.category_id,
            schedule_id: payload?.schedule_id,
            appointment_date: payload?.appointment_date,
            appointment_time: payload?.appointment_time,
            color: payload?.product_color?.label
              ? payload?.product_color.label
              : '',
            size: payload?.product_size?.label
              ? payload?.product_size.label
              : '',
            price: payload?.product_price,
            img: payload?.product_img ? payload.product_img : '',
            images: payload?.images ?? [],
            pickup: payload?.pickup,
            delivery: payload?.delivery,
            taxable: payload?.taxable,
            require_appointment: payload?.require_appointment ?? '',
            information: payload?.information ?? '',
            address_label: payload?.address_label ?? '',
            address: payload?.address ?? '',
            lat: payload?.lat ?? '',
            lng: payload?.lng ?? '',
            location: payload?.location ?? '',
            qty: 1,
          });
          state.total_qty += 1;
        }
      }
      //  if provider is not in cart list add a new item
      else {
        state.cartItems.push({
          provider_id: payload?.provider_id,
          provider_name: payload?.provider_name,
          order_type: payload?.order_type ?? 'product',
          category_id:payload?.category_id,
          items: [
            {
              id: payload?.product_id,
              name: payload?.product_name,
              order_type: payload?.order_type ?? 'product',
              schedule_id: payload?.schedule_id,
              appointment_date: payload?.appointment_date,
              appointment_time: payload?.appointment_time,
              color: payload?.product_color?.label
                ? payload?.product_color?.label
                : '',
              size: payload?.product_size?.label
                ? payload?.product_size?.label
                : '',
              price: payload?.product_price,
              img: payload?.product_img ? payload.product_img : '',
              images: payload?.images ?? [],
              pickup: payload?.pickup,
              delivery: payload?.delivery,
              taxable: payload?.taxable,
              require_appointment: payload?.require_appointment ?? '',
              information: payload?.information ?? '',
              address_label: payload?.address_label ?? '',
              address: payload?.address ?? '',
              lat: payload?.lat ?? '',
              lng: payload?.lng ?? '',
              location: payload?.location ?? '',
              qty: 1,
            },
          ],
        });
        state.total_qty += 1;
      }
      navigation.navigate('cart');
    },
    increament: (state, {payload}) => {
      const {provider_id, product} = payload;
      const p_index = state.cartItems.findIndex(
        x => x.provider_id === provider_id,
      );
      const i_index = state.cartItems[p_index].items.findIndex(
        i =>
          i.id === product?.id &&
          i?.color === product?.color &&
          i?.size === product?.size,
      );
      state.cartItems[p_index].items[i_index].qty += 1;
    },
    decreament: (state, {payload}) => {
      const {provider_id, product} = payload;
      const p_index = state.cartItems.findIndex(
        x => x.provider_id === provider_id,
      );
      const i_index = state.cartItems[p_index].items.findIndex(
        i =>
          i.id === product?.id &&
          i?.color === product?.color &&
          i?.size === product?.size,
      );

      const item = state.cartItems[p_index].items[i_index];
      if (item.qty <= 1) {
        if (state.cartItems[p_index].items.length > 1) {
          state.cartItems[p_index].items = state.cartItems[
            p_index
          ].items.filter(
            x =>
              x.id !== item?.id ||
              x?.color !== item?.color ||
              x?.size !== item?.size,
          );
          state.total_qty -= 1;
        } else {
          state.cartItems = state.cartItems.filter(
            i => i.provider_id !== provider_id,
          );
          state.total_qty -= 1;
        }
      } else {
        state.cartItems[p_index].items[i_index].qty -= 1;
      }
    },
    setSelectedItem: (state, {payload}) => {
      if (state.selectedItem) {
        if (state.selectedItem.provider_id === payload?.provider_id) {
          state.selectedItem = null;
        } else {
          state.selectedItem = payload;
        }
      } else {
        state.selectedItem = payload;
      }
    },
    resetCartItems: state => {
      state.cartItems = [];
      state.total_qty = 0;
      state.selectedItem = null;
    },
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setSelectedProvider: (state, {payload}) => {
      state.selectedProvider = payload?.user;
    },
  },
});

export const {
  onAddToCart,
  increament,
  decreament,
  setSelectedItem,
  resetCartItems,
  setLoading,
  setSelectedProvider,
} = cartSlice.actions;

export default cartSlice.reducer;
