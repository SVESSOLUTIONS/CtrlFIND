import {useFormikContext} from 'formik';
import React from 'react';
import {AppButton} from '../base/AppButton';

export const SubmitButton = ({...otherProps},addProduct=false) => {
  // alert(JSON.stringify(addProduct))
  const {handleSubmit} = useFormikContext();
  return <AppButton  {...otherProps} onPress={handleSubmit} />;
};
