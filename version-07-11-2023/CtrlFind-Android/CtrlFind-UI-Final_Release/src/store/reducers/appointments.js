import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
import toast from '../../server/toast';
import navigation from '../../navigations/rootNavigator';
import server from '../../server/server';
import labels from '../../constants/labels';
import helpers from '../../constants/helpers';
import {Platform} from 'react-native';
import {translate} from "../../multiLang/translation";

const initialState = {
  appointments: [],
  schedules: [],
  booked_dates: [],
  availible_dates: [],
  filePath: null,
  appointment_details: null,
  current_date: moment(new Date()).format('YYYY-MM-DD'),
  appointment_initial_values: {
    provider_id: '',
    item_id: '',
    schedule_id: '',
    appointment_date: '',
    appointment_time: [],
    address_label: '',
    address: '',
    lat: '',
    lng: '',
    information: '',
    price: '',
    require_appointment: '',
    images: [],
    pickup: false,
    delivery: false,
  },
  slots: [],
  showDateComponent: false,
  showTimeComponent: false,
  initial_loading: false,
  loading: false,
};

// GETTING PROVIDER Appointments
export const getProviderAppointments = createAsyncThunk(
  'appointments/getProviderAppointments',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    server.getProviderAppointments().then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(setAppointments(resp?.data));
    });
  },
);

// GETTING BUYER Appointments
export const getBuyerAppointments = createAsyncThunk(
  'appointments/getBuyerAppointments',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    server.getBuyerAppointments().then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(setAppointments(resp?.data));
    });
  },
);

// GETTING Appointment details
export const getAppointmentDetails = createAsyncThunk(
  'appointments/getAppointmentDetails',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    server.getAppointmentDetails(payload).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(setAppointmentDetail(resp?.data));
    });
  },
);

// GETTING PROVIDER SCHEDULE DATES
export const getProviderScheduleDates = createAsyncThunk(
  'appointments/getProviderScheduleDates',
  async ({id, values}, {dispatch}) => {
    dispatch(setLoading(true));
    server.getProviderScheduleDates(id, values).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(onScheduleDates(resp?.data));
    });
  },
);

// CREATE APPOINTMENT
export const onAppointmentPayment = createAsyncThunk(
  'appointments/onAppointmentPayment',
  async (payload, {dispatch, getState}) => {
    dispatch(setLoading(true));
    server.createAppointment(payload).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) {
        toast.appointment_failed(
          resp?.data?.message ? resp?.data?.message : resp.data[0],
        );
      } else {
        navigation.navigate('appointment_success', {item: resp.data});
      }
    });
  },
);

// CREATE APPOINTMENT INSTANT
export const createAppointmentInstant = createAsyncThunk(
  'appointments/createAppointmentInstant',
  async (payload, {dispatch}) => {
    dispatch(setLoading(true));
    server.createAppointmentInstant(payload).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) {
        console.log(resp.data);
        toast.appointment_failed(
          resp?.data?.message ? resp?.data?.message : resp.data[0],
        );
      } else {
        navigation.navigate('appointment_success', {item: resp.data});
      }
    });
  },
);

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  extraReducers: {},
  reducers: {
    onPressDate: (state, {payload}) => {
      // console.log("dttatattattata===",payload)
      if (state.availible_dates.includes(payload?.dateString)) {
        const date = moment(payload.dateString).format('YYYY-MM-DD');
        const schedule = state.schedules.find(
          s => moment(s.booking_date).format('YYYY-MM-DD') === date,
        );
        if (schedule) {
          state.appointment_initial_values.schedule_id = schedule?.id;
          state.appointment_initial_values.appointment_date = date;
          state.showDateComponent = false;
        } else {
          alert(translate("scheduleerror"));
        }
      }
    },
    setDateComponent: (state, {payload}) => {
      state.showDateComponent = payload;
    },
    setTimeComponent: (state, {payload}) => {
      state.showTimeComponent = payload;

    },
    setTime: (state, {payload}) => {
      state.appointment_initial_values.appointment_time = payload;
      state.showTimeComponent = false;
    },
    setInitialLoading: (state, {payload}) => {
      state.initial_loading = payload;
    },
    onScheduleDates: (state, {payload}) => {
      state.schedules = payload.schedules;
      state.availible_dates = payload.availible;
      state.booked_dates = payload.booked;
    },
    setAddress: (state, {payload}) => {
      state.appointment_initial_values.address_label = labels.OTHERS;
      state.appointment_initial_values.address = payload?.address;
      state.appointment_initial_values.lat = payload?.lat;
      state.appointment_initial_values.lng = payload?.lng;
    },
    setImages: (state, {payload}) => {
      state.appointment_initial_values.images.push(payload);
    },
    onRmoveIMG: (state, {payload}) => {
      const filteredImages = state.appointment_initial_values.images.filter(
        img => img.uri !== payload,
      );
      state.appointment_initial_values.images = filteredImages;
    },
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setInformation: (state, {payload}) => {
      state.appointment_initial_values.information = payload;
    },
    onPressContinue: (state, {payload}) => {
      state.appointment_initial_values.require_appointment =
        payload?.service?.require_appointment;
      if (payload?.service?.require_appointment === 'Y') {
        if (!state.appointment_initial_values.appointment_date) {
          return toast.validation_error('date field is required.');
        }
        if (!state.appointment_initial_values.appointment_time) {
          return toast.validation_error('time field is required.');
        }
        if (!state.appointment_initial_values.appointment_time.length) {
          return toast.validation_error('time field is required.');
        }
      }
      if (payload?.service?.require_appointment === 'N') {
        state.appointment_initial_values.appointment_date = moment(
          new Date(),
        ).format('YYYY-MM-DD');
      }
      if (!state.appointment_initial_values.address) {
        return toast.validation_error('address field is required.');
      }
      state.appointment_initial_values.item_id = payload?.service?.id;
      state.appointment_initial_values.price =
        payload.service?.require_appointment === 'Y'
          ? helpers.getItemPrice(payload?.service) *
            state.appointment_initial_values?.appointment_time.length
          : helpers.getItemPrice(payload?.service);
      state.appointment_initial_values.provider_id = payload?.service?.UserId;
      // state.appointment_file = payload?.appointment_file;

      navigation.navigate('confirm_buyer_appointment', {
        appointment: payload,
        // appointment_file: payload?.appointment_file,
      });
    },
    setAppointmentAddress: (state, {payload}) => {
      const {label, user} = payload;
      if (label === labels.HOME_ADDRESS) {
        state.appointment_initial_values.address = user?.address_home;
        state.appointment_initial_values.lat = user?.home_lat
          ? user.home_lat
          : null;
        state.appointment_initial_values.lng = user?.home_lng
          ? user.home_lng
          : null;
      }
      if (label === labels.OFFICE_ADDRESS) {
        state.appointment_initial_values.address = user?.address_office;
        state.appointment_initial_values.lat = user?.office_lat
          ? user.office_lat
          : null;
        state.appointment_initial_values.lng = user?.office_lng
          ? user.office_lng
          : null;
      }
      if (label === labels.OTHERS) {
        state.appointment_initial_values.address = '';
        state.appointment_initial_values.lat = null;
        state.appointment_initial_values.lng = null;
      }
      state.appointment_initial_values.address_label = label;
    },
    onAppointmentConfirm: (state, {payload}) => {
      navigation.navigate('confirm_appointment_information', {
        appointment: payload,
      });
    },
    setAppointments: (state, {payload}) => {
      state.appointments = payload;
    },
    setSlots: (state, {payload}) => {
      if (state.slots.some(i => i === payload)) {
        const filters = state.slots.filter(i => i !== payload);
        state.slots = filters;
      } else {
        state.slots.push(payload);
      }
    },
    resetSlots: (state, {payload}) => {
      state.slots = typeof payload == 'object' ? payload : [];
      // console.log("Slots==",state.slots)
    },
    setAppointmentDetail: (state, {payload}) => {
      state.appointment_details = payload;
    },
    setPickup: (state, {payload}) => {
      state.appointment_initial_values.pickup = payload;
    },
    setDelivery: (state, {payload}) => {
      state.appointment_initial_values.delivery = payload;
    },
    onResetAppointment: (state, {payload}) => {
      state.appointment_initial_values.provider_id = '';
      state.appointment_initial_values.item_id = '';
      state.appointment_initial_values.schedule_id = '';
      state.appointment_initial_values.appointment_date = '';
      state.appointment_initial_values.appointment_time = [];
      state.appointment_initial_values.information = '';
      state.appointment_initial_values.price = '';
      state.appointment_initial_values.images = [];
      state.appointment_initial_values.pickup = false;
      state.appointment_initial_values.delivery = false;
      state.slots = [];

      if (payload?.home_lat) {
        state.appointment_initial_values.address_label = labels.HOME_ADDRESS;
        state.appointment_initial_values.address = payload?.address_home;
        state.appointment_initial_values.lat = payload?.home_lat
          ? payload.home_lat
          : null;
        state.appointment_initial_values.lng = payload?.home_lng
          ? payload.home_lng
          : null;
      }
      if (payload?.office_lat) {
        state.appointment_initial_values.address_label = labels.OFFICE_ADDRESS;
        state.appointment_initial_values.address = payload?.address_office;
        state.appointment_initial_values.lat = payload?.office_lat
          ? payload.office_lat
          : null;
        state.appointment_initial_values.lng = payload?.office_lng
          ? payload.office_lng
          : null;
      }
      if (!payload?.address_office && !payload?.address_home) {
        state.appointment_initial_values.address_label = labels.OTHERS;
        state.appointment_initial_values.address = '';
        state.appointment_initial_values.lat = null;
        state.appointment_initial_values.lng = null;
      }
    },
  },
});

export const {
  setDateComponent,
  setTimeComponent,
  setInitialLoading,
  setLoading,
  setInformation,
  onPressDate,
  onRmoveIMG,
  onScheduleDates,
  onPressContinue,
  setAddress,
  setAppointmentAddress,
  setTime,
  setImages,
  setAppointmentDetail,
  setPickup,
  setDelivery,
  setAppointments,
  onResetAppointment,
  onAppointmentConfirm,
  setSlots,
  resetSlots,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
