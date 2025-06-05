import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';

export const PaymentCard = ({item, onPress, selectedIndex}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderRadius: 10,
        marginBottom: 10,
      }}>
      <Image
        source={item?.icon}
        style={{
          height: 30,
          width: 30,
        }}
      />
      <View style={{flex: 1, marginHorizontal: 10}}>
        <Text
          style={{
            ...FONTS.body4,
            fontWeight: '600',
          }}>
          {item?.name}
        </Text>
        <Text
          style={{
            ...FONTS.body4,
            fontWeight: '300',
            fontSize: 12,
            lineHeight: 13,
          }}>
          {item?.subtitle}
        </Text>
      </View>
      {selectedIndex ? (
        selectedIndex === item.id ? (
          <AppIcon icon={icons.tick} color={COLORS.success} />
        ) : (
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              borderColor: COLORS.gray,
              borderWidth: 1,
            }}
          />
        )
      ) : (
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            borderColor: COLORS.gray,
            borderWidth: 1,
          }}
        />
      )}
    </TouchableOpacity>
  );
};
