import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
export const AppSubscriptions = ({item, onPress}) => {
  const {user} = useContext(AuthContext);

  const is_subscribed = user.is_subscribed?.package?.id;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        height: 150,
        backgroundColor:
          is_subscribed === item.id ? COLORS.primary : COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: is_subscribed === item.id ? COLORS.white : COLORS.gray,
        padding: 10,
        justifyContent: 'center',
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
      <View style={{flexDirection: 'column'}}>
        <Text
          style={{
            ...FONTS.h2,
            color: is_subscribed === item.id ? COLORS.white : COLORS.black,
          }}>
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              ...FONTS.h1,
              color: is_subscribed === item.id ? COLORS.white : COLORS.black,
              fontWeight: '800',
            }}>
            {'$' + item.price}
          </Text>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor:
                is_subscribed === item.id ? COLORS.white : COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <AppIcon
              icon={icons.right_arrow}
              size={30}
              color={is_subscribed === item.id ? COLORS.primary : COLORS.white}
            />
          </View>
        </View>
        <Text
          style={{
            ...FONTS.body3,
            color: is_subscribed === item.id ? COLORS.white : COLORS.black,
          }}>
          {`${item.expiry} Days`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
