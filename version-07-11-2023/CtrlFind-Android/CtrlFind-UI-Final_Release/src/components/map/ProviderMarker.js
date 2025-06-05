import React from 'react';
import {View} from 'react-native';
import {COLORS} from '../../constants/theme';
import {AppIcon} from '../base/AppIcon';

export const ProviderMarker = ({img, size = 30}) => {
  return (
    <View
      style={
        {
          // // backgroundColor: COLORS.primary,
          // width: size,
          // height: size,
          // borderRadius: 10,
          // // borderWidth: 5,
          // // borderColor: COLORS.white,
          // alignItems: 'center',
          // justifyContent: 'center',
        }
      }>
      <AppIcon icon={img} size={size} orgColor />
    </View>
  );
};
