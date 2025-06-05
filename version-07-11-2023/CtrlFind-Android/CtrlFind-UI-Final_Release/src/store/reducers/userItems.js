import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
import navigation from '../../navigations/rootNavigator';

import apis from '../../server/apis';
import server from '../../server/server';
import toast from '../../server/toast';

const initialState = {
  products: [],
  services: [],
  provider_categories: [],
  provider_colors: [],
  provider_sizes: [],
  provider_tags: [],
  provider_filtered_tags: [],
  selected_colors: [],
  selected_sizes: [],
  selected_tags: [],
  provider_employees: [],
  editMode: false,
  productsInitialValues: {
    title: '',
    price: '',
    discount_available: 'N',
    taxable: 'N',
    discount: '',
    discount_type: 'FLAT',
    discount_start_date: new Date(),
    discount_end_date: new Date(),
    category_id: '',
    summary: '',
    images: [],
  },
  serviceInitialValues: {
    title: '',
    price: '',
    discount_available: 'N',
    discount: '',
    discount_type: 'FLAT',
    discount_start_date: new Date(),
    discount_end_date: new Date(),
    location: 'home',
    require_appointment: 'Y',
    taxable: 'N',
    category_id: '',
    price_type: 'flat',
    summary: '',
    employee_id: '',
    images: [],
    pick_up_availible: 'Y',
    delivery_availible: 'Y',
  },
  loading: false,
  item_loading: false,
};

// Get PRODUCTS
export const getProviderData = createAsyncThunk(
  'userItems/getProviderData',
  async values => {
    return apis.getProviderData(values).then(response => response);
  },
);

// Get PRODUCTS
export const getProducts = createAsyncThunk(
  'userItems/getProducts',
  async values => {
    return apis.getUserProducts(values).then(response => response);
  },
);

// GET SERVICES
export const getServices = createAsyncThunk(
  'userItems/getServices',
  async values => {
    return apis.getUserServices(values).then(response => response);
  },
);

// REMOVE IMAGE
export const removeImage = createAsyncThunk(
  'userItems/removeImage',
  async ({id, route}, {dispatch}) => {
    dispatch(setLoading(true));
    server.removeImage(id).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(removeImageFromState({id, route}));
    });
  },
);

// GET ITEM DETAILS
export const getItemDetails = createAsyncThunk(
  'userItems/getItemDetails',
  async ({route, id}, {dispatch}) => {
    dispatch(setItemLoading(true));
    server.getItemDetails(id).then(resp => {
      dispatch(setItemLoading(false));
      if (!resp.ok) return;
      if (route === 'Products') {
        dispatch(setProductDetails(resp.data));
      } else {
        dispatch(setServiceDetails(resp.data));
      }
      navigation.navigate(
        `add_new_${route === 'Products' ? 'products' : 'services'}`,
        {
          title: route === 'Products' ? 'Product' : 'Service',
        },
      );
    });
  },
);

// ADD PRODUCTS
export const addProducts = createAsyncThunk(
  'userItems/addProducts',
  async (values, {dispatch}) => {
    dispatch(setLoading(true));
    server.addUserProducts(values).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) {
        if (res.status === 402) {
          toast.add_product_failed(res.data[0]);
        } else {
          toast.add_product_failed(res.data?.message);
        }
      } else {
        dispatch(setProduct(res.data));
        setTimeout(() => {
          navigation.navigate('category_items_details', {
            item: {title: 'Products'},
          });
        }, 300);
      }
    });
  },
);

// ADD SERVICES
export const addServices = createAsyncThunk(
  'userItems/addServices',
  async (values, {dispatch}) => {
    dispatch(setLoading(true));
    server.addUserServices(values).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) {
        if (res.status === 402) {
          toast.add_service_failed(res.data[0]);
        } else {
          toast.add_service_failed(res.data?.message);
        }
      } else {
        dispatch(setService(res.data));
        setTimeout(() => {
          navigation.navigate('category_items_details', {
            item: {title: 'Services'},
          });
        }, 300);
      }
    });
  },
);

// UPDATE ITEM
export const updateItem = createAsyncThunk(
  'userItems/updateItem',
  async ({id, values, route}, {dispatch}) => {
    {console.log("values discount check"+JSON.stringify(values))}

    dispatch(setLoading(true));
    server.updateItem(id, values).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) {
        if (res.status === 402) {
          toast.update_item_failed(res.data[0]);
        }
      } else {
        dispatch(updateItemWithResponse({route, data: res.data}));
        setTimeout(() => {
          navigation.navigate('category_items_details', {
            item: {title: route},
          });
        }, 300);
      }
    });
  },
);

// DELETE ITEM
export const deleteItem = createAsyncThunk(
  'employees/deleteItem',
  async ({id, type}, {dispatch}) => {
    dispatch(setLoading(true));
    server.deleteItem(id).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(deleteItemWithResponse({id, type}));
      navigation.goBack();
    });
  },
);

export const userItemsSlice = createSlice({
  name: 'userItems',
  initialState,
  extraReducers: {
    [getProducts.pending]: state => {
      state.loading = true;
    },
    [getProducts.fulfilled]: (state, {payload}) => {
      state.products = payload.data;
      state.loading = false;
    },
    [getProducts.rejected]: (state, {payload}) => {
      state.loading = false;
    },
    [getServices.pending]: state => {
      state.loading = true;
    },
    [getServices.fulfilled]: (state, {payload}) => {
      state.services = payload.data;
      state.loading = false;
    },
    [getServices.rejected]: state => {
      state.loading = false;
    },
    [getProviderData.pending]: state => {
      state.loading = true;
    },
    [getProviderData.fulfilled]: (state, {payload}) => {
      state.provider_categories = payload.data?.provider_categories;
      state.provider_colors = payload.data?.provider_colors;
      state.provider_sizes = payload.data?.provider_sizes;
      state.provider_tags = payload.data?.provider_tags;
      state.provider_filtered_tags = payload.data?.provider_tags;
      state.provider_employees = payload.data?.provider_employees;
      state.loading = false;
    },
    [getProviderData.rejected]: state => {
      state.loading = false;
    },
  },

  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setItemLoading: (state, {payload}) => {
      state.item_loading = payload;
    },
    setProduct: (state, {payload}) => {
      state.products.unshift(payload);
    },
    setService: (state, {payload}) => {
      state.services.unshift(payload);
    },
    setEditMode: (state, {payload}) => {
      state.editMode = payload;
    },
    setColors: (state, {payload}) => {
      if (
        state.selected_colors.filter(s => s.value === payload.value).length > 0
      ) {
        let filteredColors = state.selected_colors.filter(
          c => c.value !== payload.value,
        );
        state.selected_colors = filteredColors;
      } else {
        state.selected_colors.push(payload);
      }
    },
    setSizes: (state, {payload}) => {
      if (
        state.selected_sizes.filter(s => s.value === payload.value).length > 0
      ) {
        let filteredSizes = state.selected_sizes.filter(
          c => c.value !== payload.value,
        );
        state.selected_sizes = filteredSizes;
      } else {
        state.selected_sizes.push(payload);
      }
    },
    setTags: (state, {payload}) => {
      if (state.selected_tags.filter(s => s.name === payload.name).length > 0) {
        let filteredTags = state.selected_tags.filter(
          c => c.name !== payload.name,
        );
        state.selected_tags = filteredTags;
      } else {
        state.selected_tags.push(payload);
      }
    },
    searchTags: (state, {payload}) => {
      console.log("tags payload=",payload)
      const search = payload;
      if (search) {
        const newData = state.provider_tags.filter(
          tag => tag.name.toUpperCase().indexOf(search.toUpperCase()) > -1,
        );
        console.log("new data=="+JSON.stringify(newData))
        state.provider_filtered_tags = newData;
      } else {
        state.provider_filtered_tags = state.provider_tags;
      }
    },

    ItemsReset: state => {
      state.products = [];
      state.services = [];
    },
    updateItemWithResponse: (state, {payload}) => {
      const {data, route} = payload;
      if (route === 'Products') {
        state.products.map((p, i) =>
          p.id === data.id ? (state.products[i] = data) : null,
        );
      } else {
        state.services.map((s, i) =>
          s.id === data.id ? (state.services[i] = data) : null,
        );
      }
    },
    removeImageFromState: (state, {payload}) => {
      const {id, route} = payload;
      if (route === 'Product') {
        const filteredImages = state.productsInitialValues.images.filter(
          img => img.id !== id,
        );
        state.productsInitialValues.images = filteredImages;
      } else {
        const filteredImages = state.serviceInitialValues.images.filter(
          img => img.id !== id,
        );
        state.serviceInitialValues.images = filteredImages;
      }
    },
    setProductDetails: (state, {payload}) => {
      state.productsInitialValues = payload;
      state.taxable = payload?.taxable;
      state.selected_colors = payload.colors;
      state.selected_sizes = payload.sizes;
      state.selected_tags = payload.tags;
      state.productsInitialValues.price = JSON.stringify(payload.price);
      state.productsInitialValues.discount = JSON.stringify(payload.discount);
      state.productsInitialValues.discount_start_date =
        !payload.discount_start_date ||
        payload.discount_start_date === '0000-00-00'
          ? new Date()
          : moment(payload.discount_start_date).toDate();
      state.productsInitialValues.discount_end_date =
        !payload.discount_end_date || payload.discount_end_date === '0000-00-00'
          ? new Date()
          : moment(payload.discount_end_date).toDate();
      state.editMode = true;
    },
    deleteItemWithResponse: (state, {payload}) => {
      const {id, type} = payload;
      if (type === 'products') {
        const filtered_data = state?.products.filter(i => i.id !== id);
        state.products = filtered_data;
      } else {
        const filtered_data = state?.services.filter(i => i.id !== id);
        state.services = filtered_data;
      }
    },
    setServiceDetails: (state, {payload}) => {
      state.serviceInitialValues = payload;
      state.serviceInitialValues.employee_id =
        payload.employee_id === 0 ? null : payload.employee_id;
      state.selected_tags = payload.tags;
      state.serviceInitialValues.price = JSON.stringify(payload.price);
      state.serviceInitialValues.discount = JSON.stringify(payload.discount);
      state.serviceInitialValues.discount_start_date =
        !payload.discount_start_date ||
        payload.discount_start_date === '0000-00-00'
          ? new Date()
          : moment(payload.discount_start_date).toDate();
      state.serviceInitialValues.discount_end_date =
        !payload.discount_end_date || payload.discount_end_date === '0000-00-00'
          ? new Date()
          : moment(payload.discount_end_date).toDate();
      state.editMode = true;
    },
    resetForm: state => {
      state.productsInitialValues = {
        title: '',
        price: '',
        discount_available: 'N',
        taxable: 'N',
        discount: '',
        discount_type: 'FLAT',
        discount_start_date: new Date(),
        discount_end_date: new Date(),
        category_id: '',
        summary: '',
        images: [],
      };
      state.selected_colors = [];
      state.selected_sizes = [];
      state.selected_tags = [];
      state.serviceInitialValues = {
        title: '',
        price: '',
        discount_available: 'N',
        taxable: 'N',
        discount: '',
        discount_type: 'FLAT',
        discount_start_date: new Date(),
        discount_end_date: new Date(),
        location: 'home',
        require_appointment: 'Y',
        price_type: 'flat',
        category_id: '',
        summary: '',
        images: [],
        pick_up_availible: 'Y',
        delivery_availible: 'Y',
      };
    },
  },
});

export const {
  setLoading,
  setProduct,
  setService,
  setEditMode,
  setColors,
  setSizes,
  setTags,
  searchTags,
  setItemLoading,
  setProductDetails,
  setServiceDetails,
  removeImageFromState,
  updateItemWithResponse,
  ItemsReset,
  resetForm,
  deleteItemWithResponse,
} = userItemsSlice.actions;

export default userItemsSlice.reducer;
