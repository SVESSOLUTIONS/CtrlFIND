import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';

export const TimePickerUi = ({onPress, title, value,disabled}) => {
  return (
    <>
      <Text style={{...FONTS.h4, color: COLORS.gray, marginTop: 10}}>
        {title}
      </Text>
      <TouchableOpacity
          disabled={disabled}
        activeOpacity={0.7}
        onPress={onPress}
        style={{
          borderColor: COLORS.gray,
          marginTop: 2,
          borderWidth: 1,
          height: 45,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{...FONTS.body4, textAlign: 'center', letterSpacing: 1}}>
          {value}
        </Text>
      </TouchableOpacity>
    </>
  );
};
