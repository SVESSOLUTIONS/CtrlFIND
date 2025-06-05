import React from 'react';
import {Image} from 'react-native';
import {COLORS} from '../../constants/theme';

export const AppIcon = ({icon, size, color, orgColor,extraStyle}) => {
  return (
    <Image
      source={icon}
      style={[{
        height: size ? size : 20,
        width: size ? size : 20,
        tintColor: color ? color : orgColor ? null : COLORS.black,

      },extraStyle]}
    />
  );
};
