import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {AppIcon} from '..';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';

export const ItemsList = ({item, onPress, rightIcon}) => {
  return (

    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 20,
      }}>
        {console.log("item==>>"+JSON.stringify(item))}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: COLORS.gray,
          borderBottomWidth: 0.5,
          paddingVertical: 15,
        }}>
        <View style={{flexDirection: 'row', flex: 1, marginRight: 5}}>
          <View
            style={{
              height: 70,
              width: 70,
              marginRight: 15,
              borderRadius: 5,
              backgroundColor: COLORS.white,
            }}>
            {item?.image && (
              <Image
                source={{uri: helpers.get_image(item?.image?.file_path)}}
                style={{
                  height: 70,
                  width: 70,
                  marginRight: 15,
                  borderRadius: 5,
                }}
              />
            )}
          </View>

          <View style={{flex: 1}}>
            <Text
              style={{
                ...FONTS.h3,
                fontWeight: '500',
                color: COLORS.primary,
              }}>
              {item?.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                  fontWeight: '600',
                  fontSize: 15,
                  marginRight: 7,
                }}>
                {helpers.getRating(item?.rating?.avg)}
              </Text>
              <AppIcon icon={icons.reviews} size={15} color={COLORS.primary} />
              <Text
                style={{
                  ...FONTS.body4,
                  fontSize: 12,
                  color: COLORS.gray,
                  marginLeft: 7,
                }}>
                ({item?.rating?.total})
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            marginRight: 5,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.black,
              textAlign: 'right',
            }}>
            {`${parseFloat(item?.price).toFixed(1)} CAD`}
          </Text>
          <Text
            style={{
              ...FONTS.h3,
              color: 'red',
              marginTop: 5,
            }}>
            {helpers.getDiscountPrice(item)}
          </Text>
        </View>
        {rightIcon && (
          <View
            style={{
              height: 30,
              marginLeft: 10,
              width: 30,
              backgroundColor: COLORS.primary,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppIcon icon={rightIcon} color={COLORS.white} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
