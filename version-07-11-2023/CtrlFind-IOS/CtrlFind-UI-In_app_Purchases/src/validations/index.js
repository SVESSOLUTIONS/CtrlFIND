import * as Yup from 'yup';

const addProductValidationSchema = () => {
  return Yup.object().shape({
    title: Yup.string().required().label('Name'),
    price: Yup.string().required().label('Price'),
    color: Yup.string().label('Color').nullable(),
    size: Yup.string().label('Size').nullable(),
    category_id: Yup.string().required().label('Category'),
    summary: Yup.string().required().label('Summary and Specification'),
  });
};

const addServiceValidationSchema = () => {
  return Yup.object().shape({
    title: Yup.string().required().label('Name'),
    price: Yup.string().required().label('Price'),
    location: Yup.string().required().label('Location'),
    require_appointment: Yup.string().required().label('Require appointment'),
    category_id: Yup.string().required().label('Category'),
    summary: Yup.string().required().label('Summary and Specification'),
  });
};

const addColorsValidationschema = () => {
  return Yup.object().shape({
    label: Yup.string().required().label('Color Name'),
    value: Yup.string()
      .matches(['#'], 'Color value must start with #')
      .label('Value'),
  });
};

const addSizesValidationschema = () => {
  return Yup.object().shape({
    label: Yup.string().required().label('Size Name'),
  });
};

const addEmployeeValidation = () => {
  return Yup.object().shape({
    name: Yup.string().required().label('Name'),
    designation: Yup.string().required().label('Designation'),
    phone: Yup.string().required().label('Phone'),
    email: Yup.string().required().email().label('Email'),
  });
};

const addScheduleValidationSchema = () => {
  return Yup.object().shape({
    // total_slots: Yup.string().required().label('Slots'),
    category_id: Yup.string().required().label('Category'),
    employee_id: Yup.string().required().label('Employee'),
    radius: Yup.string().required().label('Radius'),
    timing: Yup.string().required().label('Slot Timing'),
    timing_type: Yup.string().required().label('type'),
  });
};

const cartFormValidationSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required().label('Name'),
    email: Yup.string().required().email().label('Email'),
    phone: Yup.string().required().label('Phone'),
    delivery_address_value: Yup.string().required().label('Address'),
  });
};

export {
  addProductValidationSchema,
  addServiceValidationSchema,
  addColorsValidationschema,
  addSizesValidationschema,
  addEmployeeValidation,
  addScheduleValidationSchema,
  cartFormValidationSchema,
};
