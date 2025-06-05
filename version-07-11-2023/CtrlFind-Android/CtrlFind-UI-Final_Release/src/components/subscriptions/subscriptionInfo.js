import React from 'react';
import {Text, View} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
export const SubscriptionInfo = ({
  title,
  subtitle,
  isTax = false,
  otherStyles,
  titleStyles,
  subtitleStyles,
}) => {
  return (
    <View
      style={[
        {
          borderBottomColor: COLORS.gray,
          borderBottomWidth: 1,
          flexDirection: 'row',
          paddingBottom: 20,
          paddingTop: 10,
          justifyContent: 'space-between',
        },
        otherStyles,
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={[
            {...FONTS.h3, color: COLORS.black, fontWeight: '800'},
            titleStyles,
          ]}>
          {title}
        </Text>
        {isTax && (
          <Text style={{...FONTS.h3,  color: COLORS.primary, fontWeight: '800'}}>
            {isTax}
          </Text>
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          {
            ...FONTS.body4,
            marginLeft: 5,
            color: COLORS.black,
          },
          subtitleStyles,
        ]}>
        {subtitle}
      </Text>
    </View>
  );
};
