import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import labels from '../../constants/labels';
import apis from '../../server/apis';
import navigation from '../../navigations/rootNavigator';
import server from '../../server/server';

const initialState = {
  categoryProviders: [],
  isFilter: false,
  filteredCategoryProviders: [],
  providers_coords: [],
  provider_filter: {
    max_distance: 0,
    min_distance: 0,
    total_counts: 0,
    search_count: 0,
    max_price: 0,
    min_price: 0,
  },
  provider_filter_state: {
    distance: 0,
    rating: 50,
    price: 0,
    is_featured: 0,
    is_trusted: 1,
    search: '',
  },
  services: [],
  filteredServices: [],
  provider_item_price_order: {
    high: 0,
    low: 0,
  },
  products: [],
  filteredProducts: [],
  item_details: null,
  userCoordinates: {
    lat: '',
    lng: '',
  },
  initial_loading: true,
  loading: false,
  permission: false,
  providersSortIndex: -1,
  itemsSortIndex: -1,
  itemsFilteredPrice: 0,
};


// // GETTING TAGS LIST
// export const getTagList = createAsyncThunk(
//     'getTagList',
//     async ({id, params}, {dispatch}) => {
//       dispatch(onResetFilters());
//       return apis
//           .getDashboardProviderByCategory(id, params)
//           .then(response => response);
//     },
// );
// GETTING DASHBOARD PROVIDERS
export const getDashboardProvidersByCategory = createAsyncThunk(
  'categories/getDashboardProvidersByCategory',
  async ({id, params}, {dispatch}) => {
    dispatch(onResetFilters());
    return apis
      .getDashboardProviderByCategory(id, params)
      .then(response => response);
  },
);

// GETTING DASHBOARD PROVIDERS SERVICES
export const getDashboardProviderServices = createAsyncThunk(
  'categories/getDashboardProviderServices',
  async ({id, values}) => {
    return apis
      .getDashboardProviderServices(id, values)
      .then(response => response);
  },
);

// GETTING DASHBOARD PROVIDERS PRODUCTS
export const getDashboardProviderProducts = createAsyncThunk(
  'categories/getDashboardProviderProducts',
  async ({id, values}) => {
    return apis
      .getDashboardProviderProducts(id, values)
      .then(response => response);
  },
);

// GETTING DASHBOARD ITEMS DETAILS
export const getProviderItemDetails = createAsyncThunk(
  'categories/getProviderItemDetails',
  async id => {
    return apis.getProviderItemDetails(id).then(response => response);
  },
);

// Provider Sort by
export const ProvidersSortBy = createAsyncThunk(
  'categories/ProvidersSortBy',
  async (payload, {dispatch}) => {
    dispatch(setInitialLoading(true));
    dispatch(SetProvidersSortBy(payload));
    setTimeout(() => {
      dispatch(setInitialLoading(false));
    }, 200);
  },
);

// provider products Sort by
export const ItemsSortBy = createAsyncThunk(
  'categories/ProductsSortBy',
  async (payload, {dispatch}) => {
    dispatch(setInitialLoading(true));
    dispatch(setitemsSortBy(payload));
    setTimeout(() => {
      dispatch(setInitialLoading(false));
    }, 200);
  },
);

// Add item review
export const addItemreview = createAsyncThunk(
  'categories/addItemreview',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    server.addItemreview(payload).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(setItemReviews(resp.data));
    });
  },
);

export const buyerDashboardSlice = createSlice({
  name: 'buyerDashboard',
  initialState,
  extraReducers: {
    [getDashboardProvidersByCategory.pending]: state => {
      state.initial_loading = true;
    },
    [getDashboardProvidersByCategory.fulfilled]: (state, {payload}) => {
      state.categoryProviders = payload.data.providers;
      state.filteredCategoryProviders = payload.data.providers;
      state.provider_filter.total_counts = payload.data.providers.length;
      state.provider_filter.search_count = payload.data.providers.length;
      state.providersSortIndex = -1;
      state.provider_filter.max_distance =
        payload.data?.user_distance_order?.max;
      state.provider_filter.min_distance =
        payload.data?.user_distance_order?.min;
      state.provider_filter.max_price = payload.data?.item_price_order?.high;
      state.provider_filter.min_price = payload.data?.item_price_order?.low;
      // filter state
      state.provider_filter_state.distance =
        payload.data?.user_distance_order?.max / 1000;
      state.provider_filter_state.price = payload.data?.item_price_order?.high;

      state.initial_loading = false;
    },
    [getDashboardProvidersByCategory.rejected]: state => {
      state.initial_loading = false;
      state.services = [];
    },
    [getDashboardProviderServices.pending]: state => {
      state.initial_loading = true;
      state.itemsSortIndex = -1;
      state.services = [];
    },
    [getDashboardProviderServices.fulfilled]: (state, {payload}) => {
      state.services = payload.data.services;
      state.filteredServices = payload.data.services;
      state.provider_item_price_order = payload.data.service_price_order;
      state.itemsFilteredPrice = payload.data.service_price_order?.high;
      state.initial_loading = false;
    },
    [getDashboardProviderServices.rejected]: state => {
      state.initial_loading = false;
    },
    [getDashboardProviderProducts.pending]: state => {
      state.initial_loading = true;
      state.itemsSortIndex = -1;
      state.products = [];
    },
    [getDashboardProviderProducts.fulfilled]: (state, {payload}) => {
      state.products = payload.data.products;
      state.filteredProducts = payload.data.products;
      state.provider_item_price_order = payload.data.product_price_order;
      state.itemsFilteredPrice = payload.data.product_price_order?.high;
      state.initial_loading = false;
    },
    [getDashboardProviderProducts.rejected]: state => {
      state.initial_loading = false;
    },
    [getProviderItemDetails.pending]: state => {
      state.item_details = null;
      state.initial_loading = true;
    },
    [getProviderItemDetails.fulfilled]: (state, {payload}) => {
      state.item_details = payload.data;
      state.initial_loading = false;
    },
    [getProviderItemDetails.rejected]: state => {
      state.initial_loading = false;
    },
  },
  reducers: {
    setCoordinates: (state, {payload}) => {
      state.userCoordinates = payload;
      state.permission = true;
    },
    setPermission: (state, {payload}) => {
      state.permission = payload;
    },

    setInitialLoading: (state, {payload}) => {
      state.initial_loading = payload;
    },

    // Execute when press on show result in privders filter
    SetProviderFilterBy: (state, {payload}) => {
      const {distance, rating, is_featured, search, is_trusted, price} =
        state.provider_filter_state;
      const filteredProviders = state.categoryProviders.filter(provider => {
        return (
          Math.floor(provider.distance) <= (distance + 1) * 1000 &&
          Math.floor(provider.price_order?.low) <= price + 1 &&
          Math.floor(provider.rating?.avg) <= rating / 10 &&
          provider.is_trusted === is_trusted &&
          provider.is_featured === is_featured &&
          provider.name.toUpperCase().indexOf(search.toUpperCase()) > -1
        );
      });

      state.provider_filter.search_count = filteredProviders.length;
      state.isFilter = true;
      if (payload?.navigate) {
        state.filteredCategoryProviders = filteredProviders;
        navigation.goBack();
      }
      if (payload?.modal) {
        state.filteredCategoryProviders = filteredProviders;
      }
    },
    // Ececute when distance filter changed
    setProviderFilterDistance: (state, {payload}) => {
      state.provider_filter_state.distance = payload;
    },
    // Ececute when rating filter changed
    setProviderFilterRating: (state, {payload}) => {
      state.provider_filter_state.rating = payload;
    },
    // Ececute when price filter changed
    setProviderFilterPrice: (state, {payload}) => {
      state.provider_filter_state.price = payload;
    },

    // Ececute when isFeatured filter changed
    setProviderFilterIsFeatured: (state, {payload}) => {
      state.provider_filter_state.is_featured = payload ? 1 : 0;
    },

    // Ececute when isTrusted filter changed
    setProviderFilterTrusted: (state, {payload}) => {
      state.provider_filter_state.is_trusted = payload ? 1 : 0;
    },

    // Ececute when search
    setProviderFilterSearch: (state, {payload}) => {
      state.provider_filter_state.search = payload;
    },

    // Ececute when item price filter changed
    setItemFilterPrice: (state, {payload}) => {
      const {type, value} = payload;
      state.itemsFilteredPrice = value;
      if (type === 'Products') {
        const filteredProducts = state.products.filter(
          product => Math.floor(product.price) <= value + 1,
        );
        state.filteredProducts = filteredProducts;
      } else {
        const filteredServices = state.services.filter(
          service => Math.floor(service.price) <= value + 1,
        );
        state.filteredServices = filteredServices;
      }
    },

    // Sort By Setup For Providers
    SetProvidersSortBy: (state, {payload}) => {
      const filterdItems = state.categoryProviders.sort((a, b) => {
        switch (payload?.value) {
          case labels.CUSTOMER_HIGH_RATING:
            return parseInt(b.rating?.avg) - parseInt(a.rating?.avg);
          case labels.CUSTOMER_LOW_RATING:
            return parseInt(a.rating?.avg) - parseInt(b.rating?.avg);
          case labels.PRICE_HIGH_TO_LOW:
            return (
              parseInt(b.price_order?.high) - parseInt(a.price_order?.high)
            );
          case labels.PRICE_LOW_TO_HIGH:
            return (
              parseInt(a.price_order?.high) - parseInt(b.price_order?.high)
            );
          default:
            return;
        }
      });
      state.providersSortIndex = payload?.index + 1;
      state.filteredCategoryProviders = filterdItems;
    },

    // Sort by provider products

    setitemsSortBy: (state, {payload}) => {
      const {type} = payload;
      console.log(type);
      const filterdItems = state[
        type === 'Products' ? 'products' : 'services'
      ].sort((a, b) => {
        switch (payload?.value) {
          case labels.CUSTOMER_HIGH_RATING:
            return parseInt(b.rating?.avg) - parseInt(a.rating?.avg);
          case labels.CUSTOMER_LOW_RATING:
            return parseInt(a.rating?.avg) - parseInt(b.rating?.avg);
          case labels.PRICE_HIGH_TO_LOW:
            return parseInt(b?.price) - parseInt(a?.price);
          case labels.PRICE_LOW_TO_HIGH:
            return parseInt(a?.price) - parseInt(b?.price);
          default:
            return;
        }
      });
      state.itemsSortIndex = payload?.index + 1;
      state[type === 'Products' ? 'filteredProducts' : 'filteredServices'] =
        filterdItems;
    },

    setProvidersCoordinates: state => {
      const coords = state.categoryProviders.map(p => {
        if (!isNaN(parseFloat(p.provider_lat))) {
          return {
            latitude: parseFloat(p.provider_lat),
            longitude: parseFloat(p.provider_lng),
          };
        }
      });
      state.providers_coords = coords;
    },

    resetItemFilters: (state, {payload}) => {
      state.itemsSortIndex = -1;
      state.itemsFilteredPrice = state.provider_item_price_order.high;
    },
    onResetFilters: (state, {payload}) => {
      state.filteredCategoryProviders = state.categoryProviders;
      state.provider_filter.search_count = state.categoryProviders.length;
      state.provider_filter.total_counts = state.categoryProviders.length;
      state.provider_filter_state.distance = state.provider_filter.max_distance;
      state.provider_filter_state.price = state.provider_filter.max_price;
      state.provider_filter_state.is_featured = 0;
      state.provider_filter_state.is_trusted = 1;
      state.provider_filter_state.search = '';
      state.provider_filter_state.rating = 50;
      state.isFilter = false;
    },
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setIsFilter: (state, {payload}) => {
      state.isFilter = payload;
    },
    setItemReviews: (state, {payload}) => {
      const {rating, review} = payload;
      console.log(rating);
      if (state.item_details) {
        state.item_details['reviews'].unshift(review);
        state.item_details['rating'] = rating;
        if (state.item_details.item_type === 'product') {
          state.products.forEach((item, i) => {
            if (item.id === state.item_details.id) {
              state.filteredProducts[i].rating = rating;
              state.products[i].rating = rating;
            }
          });
        } else {
          state.services.forEach((item, i) => {
            if (item.id === state.item_details.id) {
              state.filteredServices[i].rating = rating;
              state.services[i].rating = rating;
            }
          });
        }
      }
    },
  },
});

export const {
  setCoordinates,
  setPermission,
  setInitialLoading,
  SetProvidersSortBy,
  setProviderFilterDistance,
  setProviderFilterRating,
  setProviderFilterPrice,
  SetProviderFilterBy,
  setitemsSortBy,
  setProviderFilterIsFeatured,
  setProviderFilterTrusted,
  setProviderFilterSearch,
  setProvidersCoordinates,
  onResetFilters,
  setItemFilterPrice,
  resetItemFilters,
  setLoading,
  setIsFilter,
  setItemReviews,
} = buyerDashboardSlice.actions;

export default buyerDashboardSlice.reducer;
