import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import auth, {firebase} from '@react-native-firebase/auth';
import navigation from '../../navigations/rootNavigator';
import apis from '../../server/apis';
import authApis from '../../server/auth';
import toast from '../../server/toast/auth';
import {translate} from "../../multiLang/translation";
import Toast from "react-native-toast-message";
import {useContext} from "react";
import AuthContext from "../../context/AuthContext";

const initialState = {
  confirm: null,
  code: '',
  loading: false,
  phoneNumber: '',
  verificationProvider: '',
  email: '',
  token: '',
  isTimeFinish: false,
  running: true,
  register_data: null,
};


// SENDING OTP TO USERS PHONE
export const sendOtp = createAsyncThunk(
  'forgetPassword/sendOtp',
  async ({previousScreen}, {getState, dispatch}) => {
    const {forgetPassword} = getState();
    dispatch(setLoading(true));
    dispatch(setRunning(true));
    dispatch(otpTimeout(false));
    if (firebase.auth().currentUser) firebase.auth().signOut();
    return auth()
      .signInWithPhoneNumber(forgetPassword.phoneNumber, true)
      .then(confirmation => {
        dispatch(setConfirm(confirmation));
        dispatch(setLoading(false));
        toast.otp_send_success('phone');
        setTimeout(() => {
          navigation.navigate('verification', {
            previousScreen,
          });
        }, 300);
        return confirmation;
      })
      .catch(err => {
        toast.otp_send_failed(err?.message);
        dispatch(setLoading(false));
        return err;
      });
  },
);


// deleteAccount
export const deleteAccount = createAsyncThunk(
    'cart/deleteAccount',
    async (data, {dispatch}) => {
        dispatch(setLoading(true));
        // console.log("data"+JSON.stringify(data))

       await authApis.deleteAccount({phone:data}).then(resp => {
           console.log("response=="+JSON.stringify(resp))
           dispatch(setLoading(false));
           if (!resp.ok) return;
           Toast.show({
               type: 'success',
               text1: translate('DeleteAccount'),
               text2: translate('DeleteSuccessfully'),
           })


       });
    },
);
// SENDING OTP TO USERS EMAIL
export const sendEmailVerificationCode = createAsyncThunk(
  'forgetPassword/sendEmailVerificationCode',
  async ({previousScreen}, {getState, dispatch}) => {
    const {forgetPassword} = getState();
    dispatch(setLoading(true));
    dispatch(setRunning(true));
    dispatch(otpTimeout(false));
    return authApis
      .sendEmailVerificationCode({email: forgetPassword.email})
      .then(response => {
        if (response.ok) {
          dispatch(setLoading(false));
          toast.otp_send_success('email');
          setTimeout(() => {
            navigation.navigate('verification', {
              previousScreen,
            });
          }, 300);
          return response;
        } else {
          toast.otp_send_failed(
            response.data[0] ? response.data[0] : response.data?.message,
          );
          dispatch(setLoading(false));
          return response;
        }
      });
  },
);

// VALIDATE USER PHONE NUMBDER
export const validatePhone = createAsyncThunk(
  'forgetPassword/validatePhone',
  async ({phoneNumber}, {dispatch}) => {
    dispatch(savePhoneNumber({phoneNumber}));
    dispatch(setLoading(true));
    apis
      .forgetPassword({
        phone: phoneNumber,
      })
      .then(response => {
        dispatch(saveForgetPasswordToken(response.data));
        dispatch(sendOtp({previousScreen: 'reset'}));
      })
      .catch(err => {
        dispatch(setLoading(false));
        toast.forget_password_failed();
      });
  },
);

// VALIDATE USER EMAIL FOR RESET PASSWORD
export const validateEmail = createAsyncThunk(
  'forgetPassword/validateEmail',
  async ({email}, {dispatch}) => {
    dispatch(setLoading(true));
    dispatch(saveEmail({email}));
    apis
      .forgetPassword({
        email,
      })
      .then(response => {
        dispatch(saveForgetPasswordToken(response.data));
        dispatch(sendEmailVerificationCode({previousScreen: 'reset'}));
      })
      .catch(err => {
        dispatch(setLoading(false));
        toast.forget_password_failed();
      });
  },
);

// RESET USER PASSWORD
export const resetPassword = createAsyncThunk(
  'forgetPassword/resetPassword',
  async ({password, password_confirmation}, {getState, dispatch}) => {
    const {forgetPassword} = getState();
    return apis
      .resetPassword({
        email: forgetPassword.email,
        phone: forgetPassword.phoneNumber,
        token: forgetPassword.token,
        password,
        password_confirmation,
      })
      .then(response => response);
  },
);

// CONFIRM OTP API
export const ConfirmOtp = createAsyncThunk(
  'forgetPassword/ConfirmOtp',
  async ({code}, {dispatch, getState}) => {
    const {forgetPassword} = getState();
    dispatch(setLoading(true));
    dispatch(setRunning(false));
    forgetPassword.confirm
      .confirm(code)
      .then(response => {
        dispatch(setLoading(false));
        if (response) {
          setTimeout(() => {
            navigation.navigate('reset');
          }, 300);
        } else toast.otp_failed();
      })
      .catch(err => {
        dispatch(setLoading(false));
        dispatch(otpTimeout(true));
        toast.otp_failed(err[0]);
      });
  },
);

// CONFIRM EMAIL CODE
export const ConfirmEmailCode = createAsyncThunk(
  'forgetPassword/ConfirmEmailCode',
  async ({code}, {dispatch}) => {
    dispatch(setLoading(true));
    dispatch(setRunning(false));
    authApis.VerifyEmailCode({otp: code}).then(response => {
      dispatch(setLoading(false));
      if (response.ok) {
        setTimeout(() => {
          navigation.navigate('reset');
        }, 300);
      } else {
        dispatch(otpTimeout(true));
        toast.otp_failed();
      }
    });
  },
);

export const forgetPasswordSlice = createSlice({
  name: 'forgetPassword',
  initialState,
  extraReducers: {
    [resetPassword.pending]: state => {
      state.loading = true;
    },
    [resetPassword.fulfilled]: state => {
      toast.reset_password_success();
      state.loading = false;
      setTimeout(() => {
        navigation.navigate('login');
      }, 300);
    },
    [resetPassword.rejected]: (state, {payload}) => {
      toast.reset_password_failed(translate("resetError"));
      state.loading = false;
    },
  },

  reducers: {
    savePhoneNumber: (state, {payload}) => {
      state.phoneNumber = payload.phoneNumber;
      state.verificationProvider = 'phone';
    },
    saveEmail: (state, {payload}) => {
      state.email = payload.email;
      state.verificationProvider = 'email';
    },

    saveRegisterData: (state, {payload}) => {
      state.register_data = payload;
    },
    saveForgetPasswordToken: (state, {payload}) => {
      state.email = payload.user.email;
      state.token = payload.token;
    },
    otpTimeout: (state, {payload}) => {
      state.isTimeFinish = payload;
    },
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setConfirm: (state, {payload}) => {
      state.confirm = payload;
    },
    setRunning: (state, {payload}) => {
      state.running = payload;
    },
      deleteData: (state, {payload}) => {
          state.running = payload;
      },
  },
});

export const {
  savePhoneNumber,
  saveEmail,
  saveRegisterData,
  otpTimeout,
  setLoading,
  setConfirm,
  setRunning,
  saveForgetPasswordToken,
    deleteData,
} = forgetPasswordSlice.actions;

export default forgetPasswordSlice.reducer;
