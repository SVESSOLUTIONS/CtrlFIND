import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';

export const AppFakeInput = ({otherStyles, onPress, placeholder, title}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        {
          height: 50,
          borderWidth: 1,
          borderColor: COLORS.gray,
          borderRadius: 5,
          marginTop: 3,
          paddingHorizontal: 15,
          justifyContent: 'center',
        },
        otherStyles,
      ]}>
      <Text
        numberOfLines={2}
        style={{
          ...FONTS.body4,
        }}>
        {title ? title : placeholder}
      </Text>
    </TouchableOpacity>
  );
};
