import React from 'react';
import {Formik} from 'formik';

const AppForm = ({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  ...otherProps
}) => (
  <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
    {...otherProps}>
    {() => children}
  </Formik>
);

export {AppForm};
