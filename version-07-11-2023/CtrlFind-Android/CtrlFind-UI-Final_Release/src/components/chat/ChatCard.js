import moment from 'moment';
import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import helpers from '../../constants/helpers';
import images from '../../constants/images';
import {COLORS, FONTS} from '../../constants/theme';
export const ChatCard = ({onPress, item}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: COLORS.white,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        paddingVertical: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderWidth: 1,
            borderColor: COLORS.gray,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{uri: helpers.get_image(item?.friend?.avatar)}}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginHorizontal: 15,
            flex: 1,
          }}>
          <Text style={{...FONTS.h3}}>{item?.friend?.name}</Text>

          <Text
            numberOfLines={1}
            style={{
              ...FONTS.body4,
              fontSize: 12,
              lineHeight: 16,
              color: COLORS.black,
            }}>
            {item?.message?.text}
          </Text>
        </View>
      </View>
      <View>
        <Text
          style={{
            ...FONTS.body4,
            fontSize: 10,
            color: COLORS.gray,
          }}>
          {moment(item?.message?.createdAt).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
