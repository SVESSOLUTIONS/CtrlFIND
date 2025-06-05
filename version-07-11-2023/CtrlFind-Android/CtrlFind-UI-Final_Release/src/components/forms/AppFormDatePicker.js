import {useFormikContext} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {AppDatePicker} from '../base/AppDatePicker';
import {ErrorMessage} from './ErrorMessage';

export const AppFormDatePicker = ({name, ...otherProps}) => {
  const {values, errors, touched, setFieldValue, setFieldTouched} =
    useFormikContext();
  return (
    <View>
      <AppDatePicker
        {...otherProps}
        setDate={val => setFieldValue(name, val)}
        onBlur={() => setFieldTouched(name)}
        value={values[name]}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};
