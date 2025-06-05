import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apis from '../../server/apis';
import server from '../../server/server';
import toast from '../../server/toast';
import {translate} from "../../multiLang/translation";

const initialState = {
  categories: [],
  providers_categories: [],
  provider_categories_ids: [],
  filterdCategories: [],
  filterdProviderCategories: [],
  searchServices: [],
  loading: false,
  searchLoading: false,
  loaded: false,
  isVisible: false,
  isRequestVisible: false,
  search: '',
};

// GETTING CATEGORIES
export const getCategories = createAsyncThunk(
  'categories/getCategories',
  async () => {
    return apis.getCategories().then(response => response);
  },
);

// GETTING PROVIDER CATEGORIES
export const getProviderCategories = createAsyncThunk(
  'categories/getProviderCategories',
  async () => {
    return apis.getProviderCategories().then(response => response);
  },
);

// ADDING PROVIDER CATEGORIES
export const addProviderCategories = createAsyncThunk(
  'categories/addProviderCategories',
  async values => {
    return apis
      .addProviderCategories({categories: JSON.stringify(values)})
      .then(response => response);
  },
);

// Search services
export const searchServices = createAsyncThunk(
  'categories/searchServices',
  async (payload, {dispatch}) => {
    const search = payload.search;
    if (!search) {
      return dispatch(setServices([]));
    }
    dispatch(setSearchLoading(true));
    server.searchService(search).then(resp => {
      dispatch(setSearchLoading(false));
      if (!resp.ok) return;
      dispatch(setServices(resp.data));
    });
  },
);

export const requestCategory = createAsyncThunk(
  'categories/requestCategory',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    server.requestCategory(payload).then(resp => {
      dispatch(setLoading(false));
      console.log(resp.data);
      if (!resp.ok) return alert(translate("errrequestingtryagian"));
      toast.request_sent(resp.data?.message);
      dispatch(setIsRequestVisible(false));
    });
  },
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  extraReducers: {
    [getCategories.pending]: state => {
      state.loading = true;
    },
    [getCategories.fulfilled]: (state, {payload}) => {
      state.categories = payload.data.categories;
      state.filterdCategories = payload.data.categories;
      state.filterdProviderCategories = payload.data.categories;
      state.loading = false;
    },
    [getCategories.rejected]: state => {
      state.loading = false;
    },
    [getProviderCategories.pending]: state => {
      state.loaded = true;
    },
    [getProviderCategories.fulfilled]: (state, {payload}) => {
      state.providers_categories = payload.data.provider_categories;
      state.provider_categories_ids = payload.data.provider_categories_ids;
      state.loaded = false;
    },
    [getProviderCategories.rejected]: state => {
      state.loaded = false;
    },
    [addProviderCategories.pending]: state => {
      state.loaded = true;
    },
    [addProviderCategories.fulfilled]: (state, {payload}) => {
      state.providers_categories = payload.data.provider_categories;
      state.provider_categories_ids = payload.data.provider_categories_ids;
      state.loaded = false;
      state.isVisible = false;
    },
    [addProviderCategories.rejected]: (state, {payload}) => {
      state.loaded = false;
    },
  },
  reducers: {
    setServices: (state, {payload}) => {
      state.searchServices = payload;
    },
    searchProviderCategories: (state, {payload}) => {
      const search = payload.search;
      if (search) {
        const newData = state.categories.filter(
          item => item.name.toUpperCase().indexOf(search.toUpperCase()) > -1,
        );
        state.filterdProviderCategories = newData;
      } else {
        state.filterdProviderCategories = state.categories;
      }
    },
    setProviderCategoriesId: (state, {payload}) => {
      if (state.provider_categories_ids.includes(payload)) {
        const filter_ids = state.provider_categories_ids.filter(
          id => id !== payload,
        );
        state.provider_categories_ids = filter_ids;
      } else {
        state.provider_categories_ids.push(payload);
      }
    },
    selectAllCategoriesForProvider: (state, {payload}) => {
      if (state.provider_categories_ids.length === payload.length) {
        state.provider_categories_ids = [];
      } else {
        state.provider_categories_ids = payload;
      }
    },
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setSearchLoading: (state, {payload}) => {
      state.searchLoading = payload;
    },

    setIsVisible: (state, {payload}) => {
      state.isVisible = payload;
    },
    setIsRequestVisible: (state, {payload}) => {
      state.isRequestVisible = payload;
    },
  },
});

export const {
  setServices,
  searchProviderCategories,
  selectAllCategoriesForProvider,
  setProviderCategoriesId,
  setIsVisible,
  setLoading,
  setSearchLoading,
  setIsRequestVisible,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
