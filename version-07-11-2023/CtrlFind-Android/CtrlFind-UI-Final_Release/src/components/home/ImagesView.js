import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../constants/theme';

export const ImagesView = ({uri, active, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={{
      height: 70,
      width: 70,
      borderRadius: 5,
      marginRight: 5,
      backgroundColor: COLORS.lightGray,
    }}>
    <Image
      source={{uri}}
      style={{
        height: 70,
        width: 70,
        borderRadius: 5,
        borderWidth: active ? 5 : 0,
        borderColor: COLORS.primary,
      }}
    />
  </TouchableOpacity>
);
