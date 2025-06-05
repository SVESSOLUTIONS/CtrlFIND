import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apis from '../../server/apis';

const initialState = {
  packages: [],
  loading: false,
};

// GET PACKAGES
export const getPackages = createAsyncThunk(
  'subscriotions/getPackages',
  async () => {
    return apis.getPackages().then(response => response);
  },
);

export const subscriotionsSlice = createSlice({
  name: 'subscriotions',
  initialState,
  extraReducers: {
    [getPackages.pending]: state => {
      state.loading = true;
    },
    [getPackages.fulfilled]: (state, {payload}) => {
      state.packages = payload?.data?.packages;
      state.loading = false;
    },
    [getPackages.rejected]: state => {
      state.loading = false;
    },
  },
});

export const {} = subscriotionsSlice.actions;

export default subscriotionsSlice.reducer;
