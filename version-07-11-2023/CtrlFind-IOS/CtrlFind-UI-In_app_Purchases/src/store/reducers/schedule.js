import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';
import toast from '../../server/toast';
import navigation from '../../navigations/rootNavigator';
import server from '../../server/server';
import {setTime} from "./appointments";

const initialState = {
  dates: [],
  timings: [],
  schedules: [],
  templates: [],
  current_date: moment(new Date()).format('YYYY-MM-DD'),
  scheduleInitialValues: {
    id: '',
    total_slots: '',
    category_id: '',
    employee_id: '',
    timing: '',
    timing_type: 'm',
    opening_time: '',
    closing_time: '',
    slots_data: [],
    area: '',
    area_lat: '',
    area_lng: '',
    radius: '',
  },
  booking_date: '',
  initial_loading: false,
  server_loading: false,
  showOpeningTime: false,
  showClosingTime: false,
  isEdit: false,
  isVisible: false,
};

// GETTING SCHEDULE DATES
export const getScheduleDates = createAsyncThunk(
  'employees/getScheduleDates',
  async (payload, {dispatch}) => {
    dispatch(setInitialLoading(true));
    server.getScheduleDates(payload).then(resp => {
      console.log(resp.data);
      dispatch(setInitialLoading(false));
      if (!resp.ok) return;
      dispatch(onScheduleDates(resp?.data));
    });
  },
);

// GETTING ALL SCHEDULE DATES
export const getAllScheduleDates = createAsyncThunk(
  'employees/getAllScheduleDates',
  async (payload, {dispatch}) => {
    dispatch(setInitialLoading(true));
    server.getAllScheduleDates(payload).then(resp => {
      dispatch(setInitialLoading(false));
      if (!resp.ok) return;
      dispatch(onScheduleDates(resp?.data));
    });
  },
);

// GETTING SCHEDULE TIMINGS
export const getScheduleTiming = createAsyncThunk(
  'employees/getScheduleTiming',
  async (payload, {dispatch}) => {
    console.log("payload==",payload)
    dispatch(setServerLoading(true));
    server.getScheduleTiming(payload).then(resp => {
      dispatch(setServerLoading(false));
      if (!resp.ok) return;
      dispatch(onScheduleTiming(resp?.data));
      console.log(resp.data)
    });
  },
);

// GETTING SCHEDULE LIST BY DATE
export const onPressDate = createAsyncThunk(
  'employees/onPressDate',
  async (date, {getState, dispatch}) => {
    console.log("date after delete call"+JSON.stringify(date))
    const {schedule} = getState();
    if (
      moment(schedule.current_date).isBefore(date.dateString) ||
      moment(schedule.current_date).isSame(date.dateString)
    ) {
      navigation.navigate('schedule_list', {date: date});
      dispatch(setInitialLoading(true));
      server.getSchedule({booking_date: date.dateString}).then(resp => {
        // console.log("booking_date: date.dateString====  ",date.dateString)
        // console.log("get all date  ",date)
        dispatch(setInitialLoading(false));
        if (!resp.ok) return;
        dispatch(setBookingDate(date?.dateString));
        dispatch(setSchedules(resp.data));
      });
    }
  },
);

export const onDeleteSchedule = createAsyncThunk(
    'employees/onDeleteSchedule',
    async ({date,id}, { dispatch}) => {
        dispatch(setInitialLoading(true));
      let response =await  server.deleteSchedule(id)
      dispatch(setInitialLoading(false));
        return response
    },
);

// CREATE SCHEDULE
export const createSchedule = createAsyncThunk(
  'employees/createSchedule',
  async (values, {dispatch}) => {
    dispatch(setServerLoading(true));
    server.createSchedule(values).then(resp => {
      dispatch(setServerLoading(false));
      dispatch(setIsVisible(false));
      if (!resp.ok) {
        toast.item_add_failed(resp?.data[0]);
      } else {
        dispatch(onCreateSchedule(resp?.data));
        setTimeout(() => {
              navigation.goBack()
            },

            200,)
      }
    });
  },
);

// SAVE TEMPLATE
export const saveTemplate = createAsyncThunk(
  'employees/saveTemplate',
  async (values, {dispatch}) => {
    dispatch(setServerLoading(true));
    server.saveTemplate(values).then(resp => {
      dispatch(setServerLoading(false));
      dispatch(setIsVisible(false));
      if (!resp.ok) {
        toast.item_add_failed(resp?.data[0]);
      } else {
        navigation.goBack();
      }
    });
  },
);

// GET TEMPLATES
export const getTemplates = createAsyncThunk(
  'employees/getTemplates',
  async (values, {dispatch}) => {
    dispatch(setServerLoading(true));
    server.getTemplates(values).then(resp => {
      dispatch(setServerLoading(false));
      if (!resp.ok) {
        toast.item_add_failed(resp?.data[0]);
      } else {
        dispatch(setTemplates(resp.data));
      }
    });
  },
);
// UPDATE SCHEDULE
export const updateSchedule = createAsyncThunk(
  'employees/updateSchedule',
  async ({values,id}, {dispatch}) => {
    console.log("Values=======",values)
    dispatch(setServerLoading(true));
    server.updateSchedule(id, values).then(resp => {
      console.log("ok====",resp.data)
      dispatch(setServerLoading(false));
      dispatch(setIsVisible(false));
      if (!resp.ok) {
        toast.item_update_failed(resp?.data[0]);
      } else {
          dispatch(afterScheduleSuccessfulEdit(resp?.data));

        setTimeout(() => {
          navigation.goBack()
            },

            200,)


      }
    });
  },
);

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  extraReducers: {},
  reducers: {
    onScheduleDates: (state, {payload}) => {
      state.dates = payload;
    },
    onScheduleTiming: (state, {payload}) => {
      state.timings = JSON.parse(payload?.slots_data);
    },
    onAddSchedule: state => {
      state.scheduleInitialValues.total_slots = '';
      state.scheduleInitialValues.category_id = '';
      state.scheduleInitialValues.employee_id = '';
      state.scheduleInitialValues.area = '';
      state.scheduleInitialValues.area_lat = '';
      state.scheduleInitialValues.area_lng = '';
      state.scheduleInitialValues.radius = '';
      state.scheduleInitialValues.timing = '';
      state.scheduleInitialValues.slots_data = [];
      state.scheduleInitialValues.timing_type = 'm';
      state.scheduleInitialValues.opening_time = '';
      state.scheduleInitialValues.closing_time = '';
      state.isEdit = false;
      navigation.navigate('add_schedule',{isEdit:false,id:""});
      // state.isVisible = true;
    },

    onEditSchedule: (state, {payload}) => {
      state.scheduleInitialValues.id = payload.id;
      state.scheduleInitialValues.category_id = payload.category_id;
      state.scheduleInitialValues.total_slots =
        payload?.total_slots?.toString();
      state.isEdit = true;
    },
    setBookingDate: (state, {payload}) => {
      state.booking_date = payload;
    },
    setIsVisible: (state, {payload}) => {
      state.isVisible = payload;
    },
    setSchedules: (state, {payload}) => {
      state.schedules = payload;
    },
    setInitialLoading: (state, {payload}) => {
      state.initial_loading = payload;
    },
    setServerLoading: (state, {payload}) => {
      state.server_loading = payload;
    },
    setShowOpeningTime: (state, {payload}) => {
      state.showOpeningTime = payload;
    },
    setOpeningTiming: (state, {payload}) => {
      state.scheduleInitialValues.opening_time = payload;
    },
    setSlotsDataReset: state => {
      state.scheduleInitialValues.slots_data = [];
    },
    setSlotsData: (state, {payload}) => {
      state.scheduleInitialValues.slots_data = payload;
    },
    setShowClosingTime: (state, {payload}) => {
      state.showClosingTime = payload;
    },
    setClosingTiming: (state, {payload}) => {
      state.scheduleInitialValues.closing_time = payload;
    },
    setTemplates: (state, {payload}) => {
      state.templates = payload;
    },

    onLoadTemplate: (state, {payload}) => {
      state.scheduleInitialValues.total_slots = JSON.stringify(
        payload?.total_slots,
      );
      state.scheduleInitialValues.category_id = payload?.category_id;
      state.scheduleInitialValues.employee_id = payload?.employee_id;
      state.scheduleInitialValues.area = payload?.area;
      state.scheduleInitialValues.area_lat = payload?.area_lat;
      state.scheduleInitialValues.area_lng = payload?.area_lng;
      state.scheduleInitialValues.radius = JSON.stringify(payload?.radius);
      state.scheduleInitialValues.timing = JSON.stringify(payload?.timing);
      state.scheduleInitialValues.slots_data = [];
      state.scheduleInitialValues.timing_type = payload?.timing_type;
      state.scheduleInitialValues.opening_time = payload?.opening_time;
      state.scheduleInitialValues.closing_time = payload?.closing_time;
      state.isEdit = false;
    },
    onScheduleEdit: (state,{payload}) => {
      state.scheduleInitialValues.total_slots = JSON.stringify(payload?.total_slots,);
      state.scheduleInitialValues.category_id = payload?.category_id;
      state.scheduleInitialValues.employee_id = payload?.employee_id;
      state.scheduleInitialValues.area = payload?.area;
      state.scheduleInitialValues.area_lat = payload?.area_lat;
      state.scheduleInitialValues.area_lng = payload?.area_lng;
      state.scheduleInitialValues.radius = typeof payload?.radius==="string"?payload.radius:JSON.stringify(payload?.radius);
      state.scheduleInitialValues.timing = typeof payload?.radius==="string"?payload.timing:JSON.stringify(payload?.timing);
      state.scheduleInitialValues.slots_data = [];
      state.scheduleInitialValues.timing_type = payload?.timing_type;
      state.scheduleInitialValues.opening_time = payload?.opening_time;
      state.scheduleInitialValues.closing_time = payload?.closing_time;
      state.isEdit = true;
      navigation.navigate('add_schedule',{isEdit:true,id:payload?.id});
      // state.isVisible = true;
    },
    SetArea: (state, {payload}) => {
      state.scheduleInitialValues.area = payload?.address;
      state.scheduleInitialValues.area_lat = payload?.lat;
      state.scheduleInitialValues.area_lng = payload?.lng;
    },
    onCreateSchedule: (state, {payload}) => {
      state.schedules.unshift(payload);
    },
    afterScheduleSuccessfulEdit:(state , {payload}) => {
      state.schedules.map(((s , index) => s.id === payload.id ? state.schedules[index] = {
        ...payload,
        id: payload?.id,
        user_id: payload?.user_id,
        category_id: payload?.category_id,
        total_slots: Number(payload?.total_slots),
        booked_slots: payload?.booked_slots,
        availible_slots: payload?.availible_slots,
        booking_date: payload?.booking_date,
        is_deleted: payload?.is_deleted,
        created_at: payload?.created_at,
        updated_at: payload?.updated_at,
        employee_id: payload?.employee_id,
        area: payload?.area,
        area_lat: payload?.area_lat,
        area_lng: payload?.area_lng,
        closing_time: payload?.closing_time,
        opening_time: payload?.opening_time,
        radius: Number(payload?.radius),
        slots_data: payload?.slots_data,
        timing: Number(payload?.timing),
        timing_type: payload?.timing_type
      } : null));
    } ,
    onUpdateSchedule: (state, {payload}) => {
      state.schedules.map((s, i) => {
        if (s.id === payload.id) {
          state.scheduleInitialValues.total_slots = JSON.stringify(payload?.total_slots,);
          state.scheduleInitialValues.category_id = payload?.category_id;
          state.scheduleInitialValues.employee_id = payload?.employee_id;
          state.scheduleInitialValues.area = payload?.area;
          state.scheduleInitialValues.area_lat = payload?.area_lat;
          state.scheduleInitialValues.area_lng = payload?.area_lng;
          state.scheduleInitialValues.radius = JSON.stringify(payload?.radius);
          state.scheduleInitialValues.timing = JSON.stringify(payload?.timing);
          state.scheduleInitialValues.slots_data = [];
          state.scheduleInitialValues.timing_type = payload?.timing_type;
          state.scheduleInitialValues.opening_time = payload?.opening_time;
          state.scheduleInitialValues.closing_time = payload?.closing_time;
        }
      });
    },
  },
});

export const {
  setIsVisible,
  setBookingDate,
  onScheduleDates,
  onScheduleTiming,
  onAddSchedule,
  onScheduleEdit,
  onEditSchedule,
  setSchedules,
  setInitialLoading,
  setServerLoading,
  setShowOpeningTime,
  setShowClosingTime,
  setOpeningTiming,
  setClosingTiming,
  setSlotsDataReset,
  setTemplates,
  onCreateSchedule,
  onUpdateSchedule,
  setSlotsData,
  SetArea,
  onLoadTemplate,
  afterScheduleSuccessfulEdit
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
