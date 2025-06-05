import React from 'react';
import {View, Text, Image} from 'react-native';
import {AppIcon} from '..';
import {COLORS, FONTS} from '../../constants/theme';
export const List = ({title, subtitle, icon}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingVertical: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        borderColor: COLORS.lightGray,
      }}>
      <Text style={{...FONTS.h4, color: COLORS.gray, flex: 1}}>{title}</Text>
      {icon && (
        <View
          style={{
            marginRight: 5,
            marginLeft: 15,
            height: 20,
            width: 20,
            backgroundColor: COLORS.white,
            borderWidth: 2,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#F5B755',
          }}>
          <AppIcon icon={icon} size={15} color={'#F5B755'} />
        </View>
      )}
      <Text
        style={{
          flex: 1,
          ...FONTS.h3,
          fontSize: 14,
          fontWeight: 'bold',
        }}>
        {subtitle}
      </Text>
    </View>
  );
};
