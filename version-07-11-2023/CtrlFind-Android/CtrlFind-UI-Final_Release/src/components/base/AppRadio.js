import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';

export const AppRadio = ({
  size = 18,
  title,
  otherStyles,
  status,
  textStyle,
  onValueChange,
  radioBorderColor = COLORS.gray,
  radioCircleColor = COLORS.primary,
  radioColor = COLORS.white,
}) => (
  <TouchableOpacity
    style={[
      {
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
      },
      otherStyles,
    ]}
    onPress={onValueChange}
    activeOpacity={0.7}>
    <View
      style={{
        height: size,
        width: size,
        backgroundColor: status ? radioColor : COLORS.lightGray,
        borderWidth: 1.5,
        borderColor: radioBorderColor,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: size / 1.4,
          height: size / 1.4,
          backgroundColor: status ? radioCircleColor : null,
          borderRadius: size,
        }}
      />
    </View>
    <Text
      style={[
        {
          ...FONTS.body4,
          fontWeight: '600',
          marginLeft: 5,
          color: status ? COLORS.primary : COLORS.black,
        },
        textStyle,
      ]}>
      {title}
    </Text>
  </TouchableOpacity>
);
