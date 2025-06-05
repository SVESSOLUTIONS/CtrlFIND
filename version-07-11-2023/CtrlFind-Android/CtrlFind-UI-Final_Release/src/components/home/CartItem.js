import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {MiniButton} from '..';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

export const CartItem = ({
  item,
  border = true,
  onIncreament,
  onDecreament,
  type = 'product',
  provider_id,
}) => {
  return (
    <View
      activeOpacity={0.9}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 15,
        borderBottomWidth: border ? 1 : 0,
        borderBottomColor: COLORS.gray,
      }}>
      {/* <AppCheckBox
        isChecked={state.oneIsChecked}
        setIsChecked={setIsCheckedOne}
      /> */}
      <View
        style={{
          height: 80,
          width: 80,
          borderRadius: 10,
          marginRight: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: COLORS.lightGray,
        }}>
        {item?.img ? (
          <Image
            source={{uri: helpers.get_image(item?.img)}}
            style={{
              height: 80,
              width: 80,
              borderRadius: 10,
            }}
          />
        ) : (
          <Text
            style={{
              ...FONTS.body4,
              fontSize: 9,
            }}>
            {translate('noImage')}
          </Text>
        )}
      </View>
      <View style={{flex: 1}}>
        <Text
          style={{
            ...FONTS.h4,
            lineHeight: 14,
            fontWeight: '600',
            marginBottom: 2,
          }}>
          {item?.name}
        </Text>
        {type === 'product' ? (
          <>
            <Text
              style={{
                ...FONTS.body4,
                fontSize: 12,
                lineHeight: 14,
                color: COLORS.gray,
              }}>
              {translate('size')}
              {item?.size}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                fontSize: 12,
                lineHeight: 14,
                color: COLORS.gray,
              }}>
              {translate('color')} {item?.color}
            </Text>
          </>
        ) : (
          <>
            {/* <Text
              style={{
                ...FONTS.body4,
                fontSize: 12,
                lineHeight: 14,
                color: COLORS.gray,
              }}>
              slots:
              {item?.appointment_time?.length}
            </Text> */}
            {/* <Text
              style={{
                ...FONTS.body4,
                fontSize: 12,
                lineHeight: 14,
                color: COLORS.gray,
              }}>
              {translate('color')} {item?.color}
            </Text> */}
          </>
        )}
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.black,
            fontWeight: '600',
            marginTop: 2,
          }}>
          ${item?.price}
        </Text>
      </View>

      {type === 'product' ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MiniButton icon={icons.minus} onPress={onDecreament} />
          <Text
            style={{
              ...FONTS.h3,
              width: 22,
              textAlign: 'center',
            }}>
            {item?.qty}
          </Text>
          <MiniButton icon={icons.plus} onPress={onIncreament} />
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onDecreament}
          style={{
            backgroundColor: COLORS.error,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}>
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.white,
              fontSize: 10,
              letterSpacing: 1,
            }}>
            Remove
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
