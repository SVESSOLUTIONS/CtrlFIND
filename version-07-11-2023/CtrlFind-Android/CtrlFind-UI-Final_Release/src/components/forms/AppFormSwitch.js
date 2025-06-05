import {useFormikContext} from 'formik';
import React from 'react';
import {Switch, Text, View} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
import {ErrorMessage} from './ErrorMessage';
import {translate} from "../../multiLang/translation";

export const AppFormSwitch = ({name, onValueChange, ...otherProps}) => {
  const {values, errors, touched, setFieldValue, setFieldTouched} =
    useFormikContext();

  return (
    <View>
      <Text
        style={{
          ...FONTS.h4,
          fontWeight: 'bold',
        }}>
          {translate("payingTaxes")}(
        <Text style={{fontSize: 12}}>GST/HST - PST/RST/QST</Text>)
      </Text>
      <View style={{marginRight: 'auto', marginTop: 5}}>
        <Switch
          trackColor={{false: '#767577', true: COLORS.primary}}
          thumbColor={values[name] ? COLORS.white : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={val => {
            setFieldValue(name, val);
            onValueChange && onValueChange(val);
          }}
          onBlur={() => setFieldTouched(name)}
          value={values[name]}
          {...otherProps}
        />
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};
