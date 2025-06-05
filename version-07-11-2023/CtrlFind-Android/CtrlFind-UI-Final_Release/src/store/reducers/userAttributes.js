import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apis from '../../server/apis';
import server from '../../server/server';
import toast from '../../server/toast';

const initialState = {
  colors: [],
  sizes: [],
  isEdit: false,
  colorInitialValues: {
    label: '',
    value: '',
  },
  sizeInitialValues: {
    label: '',
    value: '',
  },
  loading: false,
  initialLoading: false,
  isVisible: false,
};

// GET COLORS
export const getColors = createAsyncThunk(
  'userAttributes/getColors',
  async () => {
    return apis.getColors().then(response => response);
  },
);

// GET SIZES
export const getSizes = createAsyncThunk(
  'userAttributes/getSizes',
  async () => {
    return apis.getSizes().then(response => response);
  },
);

// ADD SIZE
export const addSize = createAsyncThunk(
  'userAttributes/addSize',
  async (values, {dispatch}) => {
    dispatch(setLoading(true));
    server.addSize(values).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) return;
      dispatch(setSizes(res.data));
      setTimeout(() => {
        dispatch(setIsVisible(false));
      }, 300);
    });
  },
);

// UPDATE SIZE
export const updateSize = createAsyncThunk(
  'userAttributes/updateColor',
  async ({id, values}, {dispatch}) => {
    dispatch(setLoading(true));
    server.updateSize(id, values).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) return;
      dispatch(updatedSizes(res.data));
      setTimeout(() => {
        dispatch(setIsVisible(false));
      }, 300);
    });
  },
);

// REMOVE SIZE
export const removeSize = createAsyncThunk(
  'userAttributes/removeSize',
  async ({id}, {dispatch}) => {
    dispatch(setLoading(true));
    server.removeSize(id).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) {
        toast.item_delete_failed(res.data?.message);
      } else {
        dispatch(onRemoveSize(id));
      }
      setTimeout(() => {
        dispatch(setIsVisible(false));
      }, 300);
    });
  },
);

// ADD COLOR
export const addColor = createAsyncThunk(
  'userAttributes/addColor',
  async (values, {dispatch}) => {
    dispatch(setLoading(true));
    server.addColor(values).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) return;
      dispatch(setColors(res.data));
      setTimeout(() => {
        dispatch(setIsVisible(false));
      }, 300);
    });
  },
);

// UPDATE COLOR
export const updateColor = createAsyncThunk(
  'userAttributes/updateColor',
  async ({id, values}, {dispatch}) => {
    dispatch(setLoading(true));
    server.updateColor(id, values).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) return;
      dispatch(updatedColors(res.data));
      setTimeout(() => {
        dispatch(setIsVisible(false));
      }, 300);
    });
  },
);

// REMOVE COLOR
export const removeColor = createAsyncThunk(
  'userAttributes/removeColor',
  async ({id}, {dispatch}) => {
    dispatch(setLoading(true));
    server.removeColor(id).then(res => {
      dispatch(setLoading(false));
      if (!res.ok) {
        toast.item_delete_failed(res.data?.message);
      } else {
        dispatch(onRemoveColors(id));
      }
      setTimeout(() => {
        dispatch(setIsVisible(false));
      }, 300);
    });
  },
);

export const userAttributesSlice = createSlice({
  name: 'userAttributes',
  initialState,
  extraReducers: {
    [getColors.pending]: state => {
      state.initialLoading = true;
    },
    [getColors.fulfilled]: (state, {payload}) => {
      state.colors = payload.data;
      state.initialLoading = false;
    },
    [getColors.rejected]: state => {
      state.initialLoading = false;
    },
    [getSizes.pending]: state => {
      state.initialLoading = true;
    },
    [getSizes.fulfilled]: (state, {payload}) => {
      state.sizes = payload.data;
      state.initialLoading = false;
    },
    [getSizes.rejected]: state => {
      state.initialLoading = false;
    },
  },
  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setColors: (state, {payload}) => {
      state.colors.unshift(payload);
    },
    setSizes: (state, {payload}) => {
      state.sizes.unshift(payload);
    },
    updatedColors: (state, {payload}) => {
      state.colors.map((c, i) =>
        c.id === payload.id ? (state.colors[i] = payload) : null,
      );
    },
    updatedSizes: (state, {payload}) => {
      state.sizes.map((s, i) =>
        s.id === payload.id ? (state.sizes[i] = payload) : null,
      );
    },
    onRemoveColors: (state, {payload}) => {
      const filteredColors = state.colors.filter(color => color.id !== payload);
      state.colors = filteredColors;
    },
    onRemoveSize: (state, {payload}) => {
      const filteredSizes = state.sizes.filter(size => size.id !== payload);
      state.sizes = filteredSizes;
    },
    onEditColor: (state, {payload}) => {
      state.isEdit = true;
      state.colorInitialValues = payload;
      state.isVisible = true;
    },
    onAddColor: (state, {payload}) => {
      state.isEdit = false;
      state.colorInitialValues = {
        label: '',
        value: '',
      };
      state.isVisible = true;
    },
    onAddSize: (state, {payload}) => {
      state.isEdit = false;
      state.sizeInitialValues = {
        label: '',
        value: '',
      };
      state.isVisible = true;
    },
    onEditSize: (state, {payload}) => {
      state.isEdit = true;
      state.sizeInitialValues = payload;
      state.isVisible = true;
    },

    setIsVisible: (state, {payload}) => {
      state.isVisible = payload;
    },
  },
});

export const {
  setIsVisible,
  setLoading,
  setColors,
  setSizes,
  onEditColor,
  onEditSize,
  onAddColor,
  onAddSize,
  updatedColors,
  updatedSizes,
  onRemoveColors,
  onRemoveSize,
} = userAttributesSlice.actions;

export default userAttributesSlice.reducer;
