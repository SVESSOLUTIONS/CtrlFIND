import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
export const CategoriesList = ({title}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
      }}>
      <Text style={{...FONTS.h2, fontSize: 18, marginLeft: 10}}>{title} </Text>
    </TouchableOpacity>
  );
};
