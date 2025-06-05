import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/theme';


const size = SIZES.width / 2 - 15;
export const ServicesCard = ({image, onPress, title}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 10,
      }}>
      <Image
        source={{uri: image}}
        style={{width: size, height: size, borderRadius: 10}}
      />
      <View
        style={{
          backgroundColor: 'rgba(83,127,190,0.78)',
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          borderRadius: 10,
          overflow: 'hidden',
          padding: 10,
          justifyContent: 'flex-end',
        }}>
        <Text
          style={{
            ...FONTS.h2,
            fontWeight: '800',
            letterSpacing: 0.7,
            color: COLORS.white,
            textTransform: 'capitalize',
          }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
