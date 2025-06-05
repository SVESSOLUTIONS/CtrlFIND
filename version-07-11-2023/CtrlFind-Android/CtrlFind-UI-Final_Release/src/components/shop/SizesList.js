import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';

const itemSize = 85;
export const SizesList = ({title, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: itemSize,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.gray,
        marginTop: 10,
        marginRight: 5,
        borderRadius: 5,
      }}>
      <Text
        style={{
          ...FONTS.h2,
          fontSize: 14,
          textAlign: 'center',
          fontWeight: '700',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
