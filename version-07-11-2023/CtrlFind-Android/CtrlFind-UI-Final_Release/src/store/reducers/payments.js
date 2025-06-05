import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import server from '../../server/server';

const initialState = {
  payments: [],
  loading: false,
};

// GETTING USER PAYMENTS
export const getPaymentsHistory = createAsyncThunk(
  'payments/getPaymentsHistory',
  async (_, {dispatch}) => {
    dispatch(setLoading(true));
    server.getPaymentsHistory().then(resp => {
      dispatch(setLoading(false));
      // console.log(resp.data);
      if (!resp.ok) return;
      dispatch(setPayments(resp?.data));
      // console.log("new check payment issue"+JSON.stringify(resp.data))
    });
  },
);

export const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  extraReducers: {},
  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setPayments: (state, {payload}) => {
      state.payments = payload;
    },
  },
});

export const {setLoading, setPayments} = paymentsSlice.actions;

export default paymentsSlice.reducer;
