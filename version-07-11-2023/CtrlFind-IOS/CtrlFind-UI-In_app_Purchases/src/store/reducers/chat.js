import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import labels from '../../constants/labels';
import apis from '../../server/apis';
import navigation from '../../navigations/rootNavigator';
import server from '../../server/server';
import helpers from '../../constants/helpers';

const initialState = {
  chatUsers: [],
  messages: [],
  serverLoading: false,
  loading: false,
};

// GETTING CHAT USERS
export const getUserFriendsList = createAsyncThunk(
  'chat/getUserFriendsList',
  async (_, {dispatch}) => {
    dispatch(setLoading(true));
    server.getUserFriendsList().then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(setChatUsers(resp?.data));
    });
  },
);

// GETTING CHAT MESSAGES
export const getChatMessages = createAsyncThunk(
  'chat/getChatMessages',
  async (payload, {dispatch}) => {
    dispatch(resetMessages());
    dispatch(setLoading(true));
    server.getChatMessages(payload).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(setMessages(resp?.data));
    });
  },
);

// CREATE MESSAGE
export const createMessage = createAsyncThunk(
  'chat/createMessage',
  async (payload, {dispatch}) => {
    dispatch(setServerLoading(true));
    server.createMessage(payload).then(resp => {
      dispatch(setServerLoading(false));
      if (!resp.ok) return;
    });
  },
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  extraReducers: {},
  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setServerLoading: (state, {payload}) => {
      state.serverLoading = payload;
    },
    setChatUsers: (state, {payload}) => {
      state.chatUsers = payload;
    },
    setMessages: (state, {payload}) => {
      if (payload) {
        const msgs = payload.map(msg => ({
          _id: msg?._id,
          createdAt: msg?.createdAt,
          text: msg?.text,
          user: {
            _id: msg?.user?._id,
            avatar: helpers.get_image(msg?.user?.avatar),
            name: msg?.user?.name,
          },
        }));
        state.messages = msgs;
      } else {
        state.messages = [];
      }
    },
    resetMessages: (state, {payload}) => {
      state.messages = [];
    },
    updateMessages: (state, {payload}) => {
      state.messages.unshift(payload);
    },
  },
});

export const {
  setLoading,
  setServerLoading,
  setChatUsers,
  setMessages,
  updateMessages,
  resetMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
