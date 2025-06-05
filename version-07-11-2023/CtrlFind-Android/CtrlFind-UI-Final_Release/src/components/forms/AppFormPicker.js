import {useFormikContext} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {AppPicker} from '../base/AppPicker';
import {ErrorMessage} from './ErrorMessage';

export const AppFormPicker = ({name, ...otherProps}) => {
  const {values, errors, touched, setFieldValue, setFieldTouched} =
    useFormikContext();

  return (
    <View>
      <AppPicker
        {...otherProps}
        setSelected={val => setFieldValue(name, val)}
        onBlur={() => setFieldTouched(name)}
        selected={values[name]}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};
