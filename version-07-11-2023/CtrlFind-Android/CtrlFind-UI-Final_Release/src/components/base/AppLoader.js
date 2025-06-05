import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {COLORS} from '../../constants/theme';

export const AppLoader = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 11,
      }}>
      <ActivityIndicator size="large" color={COLORS.white} />
    </View>
  );
};
