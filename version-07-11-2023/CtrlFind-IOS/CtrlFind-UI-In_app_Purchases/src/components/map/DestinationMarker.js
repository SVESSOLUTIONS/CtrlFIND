import React from 'react';
import {View} from 'react-native';
import {COLORS} from '../../constants/theme';
import {AppIcon} from '../base/AppIcon';

export const DestinationMarker = ({img, size = 40}) => {
  return (
    <View
      style={{
        backgroundColor: `rgba(${COLORS.primary_rgb} , 0.7)`,
        width: size,
        height: size,
        borderRadius: 10,
        borderWidth: 5,
        borderColor: `rgba(${COLORS.primary_rgb} , 0.3)`,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <AppIcon icon={img} size={size / 1.5} color={COLORS.white} />
    </View>
  );
};
