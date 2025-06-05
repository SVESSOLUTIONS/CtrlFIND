import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {AppIcon} from '..';
import {COLORS, FONTS, SIZES} from '../../constants/theme';

const size = SIZES.width / 2 - 20;

export const ShopCard = ({icon, title, active, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: active ? COLORS.primary : COLORS.white,
        width: size,
        height: size,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
        marginTop: 15,
      }}>
      <AppIcon
        icon={icon}
        size={size / 2.5}
        color={active ? COLORS.white : COLORS.primary}
      />
      <Text
        style={{
          ...FONTS.h2,
          fontWeight: '500',
          marginTop: 5,
          fontSize: 18,
          color: active ? COLORS.white : COLORS.primary,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
