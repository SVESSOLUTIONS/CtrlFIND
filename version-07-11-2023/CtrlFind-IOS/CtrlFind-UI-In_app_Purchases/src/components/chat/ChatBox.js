import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
export const ChatBox = ({direction, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor:
          direction === 'right'
            ? `rgba(${COLORS.primary_rgb}, 0.1)`
            : COLORS.lightGray,
        padding: 10,
        marginLeft: direction === 'right' ? '20%' : '0%',
        marginRight: direction === 'right' ? '0%' : '20%',
        borderRadius: 10,
        borderTopRightRadius: direction === 'right' ? 0 : 10,
        borderTopLeftRadius: direction === 'right' ? 10 : 0,
        marginTop: 10,
      }}>
      <Text
        style={{
          ...FONTS.body4,
          fontSize: 13,
          lineHeight: 18,
          color: direction === 'right' ? COLORS.primary : COLORS.black,
        }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
        aliquam, lectus a eleifend commodo, eros augue blandit nibh, non mollis
        est lacus nec mauris.
      </Text>
      <Text
        style={{
          ...FONTS.body4,
          fontSize: 11,
          lineHeight: 18,
          color: COLORS.black,
          alignSelf: 'flex-end',
          textAlign: 'right',
          marginTop: 5,
          fontWeight: '300',
        }}>
        2:39 PM
      </Text>
    </TouchableOpacity>
  );
};
