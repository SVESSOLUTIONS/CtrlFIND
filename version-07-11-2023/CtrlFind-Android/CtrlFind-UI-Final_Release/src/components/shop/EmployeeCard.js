import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {AppIcon} from '..';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';

const renderUserInfo = (icon, info) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
      }}>
      <AppIcon icon={icon} size={15} color={COLORS.black} />
      <Text
        style={{...FONTS.body4, lineHeight: 14, fontSize: 13, marginLeft: 7}}>
        {info}
      </Text>
    </View>
  );
};

export const EmployeeCard = ({item, onPress, onPressIcon}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={{
        backgroundColor: COLORS.white,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderWidth: 1,
            borderColor: COLORS.gray,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{uri: helpers.get_image(item?.image)}}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
            }}
          />
        </View>
        <View style={{marginLeft: 15}}>
          <Text
            style={{
              ...FONTS.h3,
              fontWeight: '500',
              marginBottom: 3,
              color: COLORS.black,
            }}>
            {item?.name}
          </Text>
          {renderUserInfo(icons.phone, item?.phone)}
          {renderUserInfo(icons.email, item?.email)}
        </View>
      </View>

      <TouchableOpacity
        onPress={onPressIcon}
        activeOpacity={0.7}
        style={{
          width: 30,
          height: 30,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 25,
        }}>
        <AppIcon icon={icons.pencil} size={15} color={COLORS.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
