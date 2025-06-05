import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {AppButton} from '../base/AppButton';

export const TimeSlot = ({
  data = [],
  onPressCancel,
  onSaveTemplate,
  onPressConfirm,
}) => {
  return (
    <View
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingVertical: 20,

      }}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{...FONTS.h3, marginBottom: 10}}>
                {translate('scheduleList')}
            </Text>

            <Text style={{...FONTS.h3, marginBottom: 10,color:COLORS.primary,fontWeight:"700"}}>
                Number of Slots: {data?.length}
            </Text>
        </View>

      <View
        style={{
          maxHeight: SIZES.height - 300,
        }}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: COLORS.white,
                paddingVertical: 5,
                borderColor: COLORS.lightGray,
                borderWidth: 1,
                marginBottom: 2,
                paddingHorizontal: 15,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  ...FONTS.body4,
                  color: COLORS.black,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View>
        <AppButton
          onPress={onPressConfirm}
          title={'Confirm'}
          otherStyles={{
            backgroundColor: COLORS.primary,
          }}
        />
        <AppButton
          onPress={onSaveTemplate}
          title={'Save as Template'}
          otherStyles={{
            backgroundColor: COLORS.black,
          }}
        />
        <AppButton
          onPress={onPressCancel}
          title={'Cancel'}
          otherStyles={{
            backgroundColor: COLORS.gray,
          }}
        />
      </View>
    </View>
  );
};
