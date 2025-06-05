import React from 'react';
import {} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';
import {AppButton} from '..';

export const AppGradientButton = ({...otherProps}) => {
  return (
    <LinearGradient
      colors={[
        'rgba(213, 219, 214, 0)',
        'rgba(213, 219, 214, 0.1)',
        'rgba(213, 219, 214, 0.3)',
        'rgba(213, 219, 214, 0.5)',
        'rgba(213, 219, 214, 0.7)',
        'rgba(213, 219, 214, 0.9)',
      ]}
      style={{
        position: 'absolute',
        paddingBottom: getBottomSpace(),
        bottom: 0,
        right: 0,
        left: 0,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppButton otherStyles={{width: '90%'}} {...otherProps} />
    </LinearGradient>
  );
};
