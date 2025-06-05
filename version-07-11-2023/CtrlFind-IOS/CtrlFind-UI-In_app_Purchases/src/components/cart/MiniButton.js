import React from 'react';
import {Pressable, Platform} from 'react-native';
import {COLORS} from '../../constants/theme';
import {AppIcon} from '../base/AppIcon';

export const MiniButton = ({onPress, icon}) => (
  <Pressable
    android_ripple={{color: 'rgba(255,255,255,0.3)'}}
    onPress={onPress}
    activeOpacity={0.7}
    style={({pressed}) => [
      {
        opacity: pressed ? (Platform.OS === 'ios' ? 0.7 : 1) : 1,
      },
      {
        height: 25,
        width: 25,
        backgroundColor: COLORS.primary,
        borderRadius: 15,
        marginHorizontal: 7,
        alignItems: 'center',
        justifyContent: 'center',
      },
    ]}>
    <AppIcon icon={icon} color={COLORS.white} size={10} />
  </Pressable>
);
