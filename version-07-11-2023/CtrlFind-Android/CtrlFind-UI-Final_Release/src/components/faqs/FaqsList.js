import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';

export const FaqsList = ({onPress, faq, isExpended}) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.lightGray,
        }}>
        <Text
          style={{...FONTS.h3, flex: 1, fontWeight: '500', paddingRight: 10}}>
          {faq.title}
        </Text>
        <AppIcon
          icon={icons[isExpended ? 'arrow_down' : 'right_arrow']}
          size={15}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      {isExpended && (
        <Text
          style={{
            ...FONTS.body4,
            fontSize: 13,
            lineHeight: 18,
            marginVertical: 15,
          }}>
          {faq.body}
        </Text>
      )}
    </>
  );
};
