import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import server from '../../server/server';

const initialState = {
  faqs: null,
  contactUs: null,
  about: null,
  addresses: null,
  terms: null,
  loading: false,
  privacy:null,

};

// GETTING USER PAYMENTS

export const getPage = createAsyncThunk(
  'pages/getPage',

  async (payload, {dispatch}) => {
    let lang = 'en';
    let lng = await AsyncStorage.getItem('language');
    if (lng !== null) {
      lang = lng;
    }
    console.log("slug"+payload);
    dispatch(setLoading(true));
    server.getPage(payload).then(resp => {
      console.log("resp==>"+JSON.stringify(resp?.data))
      dispatch(setLoading(false));
      if (!resp.ok) return;
      if (payload === 'faq?lang=' + lang) {
        dispatch(setFaqs(resp?.data));
      }
      if (payload === 'contact-us?lang=' + lang) {
        dispatch(setContactUs(resp?.data));
      }
      if (payload === 'about-us?lang=' + lang) {
        dispatch(setAbout(resp?.data));
      }
      if (payload === 'addresses?lang=' + lang) {
        dispatch(setAddresses(resp?.data));
      }
      if (payload === 'terms-and-conditions?lang=' + lang) {
        dispatch(setTerms(resp?.data));
      }
      if (payload === 'privacy-policy?lang=' + lang) {
        dispatch(setPrivacy(resp?.data));
      }
    });
  },
);

export const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  extraReducers: {},
  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setFaqs: (state, {payload}) => {
      state.faqs = payload.page;
    },
    setContactUs: (state, {payload}) => {
      state.contactUs = payload.page;
    },
    setAbout: (state, {payload}) => {
      state.about = payload.page;
    },
    setAddresses: (state, {payload}) => {
      state.addresses = payload.page;
    },
    setTerms: (state, {payload}) => {
      state.terms = payload.page;
    },
    setPrivacy: (state, {payload}) => {
      state.privacy = payload.page;
    },
  },
});

export const {
  setLoading,
  setFaqs,
  setContactUs,
  setAbout,
  setAddresses,
  setTerms,
  setPrivacy,
} = pagesSlice.actions;

export default pagesSlice.reducer;
