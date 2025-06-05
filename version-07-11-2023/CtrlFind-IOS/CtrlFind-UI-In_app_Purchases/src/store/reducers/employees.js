import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apis from '../../server/apis';
import server from '../../server/server';
import toast from '../../server/toast';
import navigation from '../../navigations/rootNavigator';

const initialState = {
  employees: [],
  employee_services: [],
  isVisible: false,
  employeesInitialValues: {
    name: '',
    designation: '',
    phone: '',
    email: '',
    image: '',
  },
  loading: false,
  initial_loading: false,
  isEdit: false,
};

// GET EMPLOYEES
export const getEmployees = createAsyncThunk(
  'employees/getEmployees',
  async () => {
    return apis.getEmployees().then(response => response);
  },
);

// ADDING EMPLOYEES
export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (values, {dispatch}) => {
    dispatch(setLoading(true));
    server.addEmploye(values).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) {
        if (resp.status === 402) {
          toast.item_add_failed(resp.data[0]);
        } else {
          toast.item_add_failed(resp.data?.message);
        }
      } else {
        dispatch(setEmployee(resp.data));
        setTimeout(() => {
          dispatch(setIsVisible(false));
        }, 300);
      }
    });
  },
);

// UPDATE EMPLOYEES
export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({id, values}, {dispatch}) => {
    dispatch(setLoading(true));
    server.updateEmploye(id, values).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) {
        if (resp.status === 402) {
          toast.item_update_failed(resp.data[0]);
        }
      } else {
        dispatch(updateEmployeeWithResponse(resp.data));
        setTimeout(() => {
          dispatch(setIsVisible(false));
        }, 300);
      }
    });
  },
);

// DELETE EMPLOYEES
export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, {dispatch}) => {
    dispatch(setLoading(true));
    server.deleteEmploye(id).then(resp => {
      dispatch(setLoading(false));
      if (!resp.ok) return;
      dispatch(deleteEmployeeWithResponse(id));
      navigation.goBack();
    });
  },
);

// REMOVE EMPLOYEE SERVICE
export const removeEmployeeService = createAsyncThunk(
  'employees/removeEmployeeService',
  async (id, {dispatch}) => {
    dispatch(setInitialLoading(true));
    server.removeEmployeeService(id).then(resp => {
      dispatch(setInitialLoading(false));
      if (!resp.ok) return;
      dispatch(removeEmployeeServiceWithResponse(id));
    });
  },
);

// GET EMPLOYEES
export const getEmployeeServices = createAsyncThunk(
  'employees/getEmployeeServices',
  async id => {
    return apis.getEmployeeServices(id).then(response => response);
  },
);

export const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  extraReducers: {
    [getEmployees.pending]: state => {
      state.initial_loading = true;
    },
    [getEmployees.fulfilled]: (state, {payload}) => {
      state.employees = payload.data;
      state.initial_loading = false;
    },
    [getEmployees.rejected]: state => {
      state.initial_loading = false;
    },
    [getEmployeeServices.pending]: state => {
      state.initial_loading = true;
    },
    [getEmployeeServices.fulfilled]: (state, {payload}) => {
      state.employee_services = payload.data;
      state.initial_loading = false;
    },
    [getEmployeeServices.rejected]: state => {
      state.initial_loading = false;
    },
  },
  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload;
    },
    setInitialLoading: (state, {payload}) => {
      state.initial_loading = payload;
    },
    setIsVisible: (state, {payload}) => {
      state.isVisible = payload;
    },
    setEmployee: (state, {payload}) => {
      state.employees.unshift(payload);
    },
    onAddEmployee: (state, {payload}) => {
      state.employeesInitialValues.name = '';
      state.employeesInitialValues.designation = '';
      state.employeesInitialValues.phone = '';
      state.employeesInitialValues.email = '';
      state.employeesInitialValues.image = '';
      state.isEdit = false;
    },
    onEditEmployee: (state, {payload}) => {
      state.employeesInitialValues = payload;
      state.isEdit = true;
    },
    updateEmployeeWithResponse: (state, {payload}) => {
      state.employees.map((e, i) =>
        e.id === payload.id ? (state.employees[i] = payload) : null,
      );
    },
    deleteEmployeeWithResponse: (state, {payload}) => {
      const filtered_data = state.employees.filter(e => e.id !== payload);
      state.employees = filtered_data;
    },
    removeEmployeeServiceWithResponse: (state, {payload}) => {
      const filtered_data = state.employee_services.filter(
        s => s.id !== payload,
      );
      state.employee_services = filtered_data;
    },
  },
});

export const {
  setLoading,
  setInitialLoading,
  setIsVisible,
  setEmployee,
  onAddEmployee,
  onEditEmployee,
  updateEmployeeWithResponse,
  deleteEmployeeWithResponse,
  removeEmployeeServiceWithResponse,
} = employeesSlice.actions;

export default employeesSlice.reducer;
