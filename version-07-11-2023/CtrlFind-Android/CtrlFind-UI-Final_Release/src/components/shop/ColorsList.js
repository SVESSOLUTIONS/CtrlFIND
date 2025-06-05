import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';

const ItemSize = 80;

export const ColorsList = ({item, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        borderColor: COLORS.gray,
        width: ItemSize,
        paddingVertical: 10,
        marginRight: 5,
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text numberOfLines={1} style={{...FONTS.h2, fontSize: 14}}>
        {item?.label}
      </Text>
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 20,
          backgroundColor: item?.value,
          borderWidth: 1,
          borderColor: COLORS.gray,
        }}
      />
    </TouchableOpacity>
  );
};
