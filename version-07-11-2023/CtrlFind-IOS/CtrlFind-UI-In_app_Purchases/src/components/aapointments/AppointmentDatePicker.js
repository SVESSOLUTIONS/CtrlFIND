import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';

export const AppointmentDatePicker = ({onPress, title, icon, value, mode}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        marginTop: 10,
        paddingBottom: 10,
        borderBottomColor: COLORS.lightGray,
        borderBottomWidth: 1,
      }}>
      <Text style={{...FONTS.h3, fontWeight: '500'}}>{title}</Text>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Text style={{...FONTS.body4, flex: 1}}>
          {typeof value == 'object'
            ? value?.map((i, index) => (
                <Text key={index}>
                  <Text
                    style={{
                      color: COLORS.primary,
                    }}>
                    {index + 1}
                  </Text>
                  <Text>{'(' + i + '), '}</Text>
                </Text>
              ))
            : value}
        </Text>
        <View
          style={{
            alignItems: 'flex-end',
            paddingHorizontal: 15,
          }}>
          <AppIcon icon={icon} color={COLORS.gray} size={28} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
