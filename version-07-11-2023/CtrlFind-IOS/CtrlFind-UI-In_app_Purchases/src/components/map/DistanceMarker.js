import React from 'react';
import {View, Text} from 'react-native';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {AppIcon} from '../base/AppIcon';

export const DistanceMarker = ({size = 40, distance}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: `rgba(${COLORS.primary_rgb},0.9)`,
        borderRadius: 4,
        paddingRight: 5,
      }}>
      <AppIcon icon={icons.point} color={COLORS.white} size={15} />
      <Text
        style={{
          ...FONTS.body5,
          color: COLORS.white,
          fontWeight: '800',
          fontSize: 10,
          lineHeight: 14,
        }}>
        {parseInt(distance)}
        <Text style={{fontSize: 5}}>KM </Text>
      </Text>
    </View>
  );
};
