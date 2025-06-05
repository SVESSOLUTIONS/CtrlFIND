import React from 'react';
import {View, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
export const ItemSummary = ({summary}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}>
      <View
        style={{
          borderBottomWidth: 1,
          paddingBottom: 10,
          borderBottomColor: COLORS.gray,
        }}>
        <Text
          style={{
            ...FONTS.h3,
            fontWeight: 'bold',
            color: COLORS.primary,
          }}>
          {translate('summary')}
        </Text>
      </View>

      {/* <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <View>
          <Text
            style={{
              ...FONTS.body4,
            }}>
            BlastProof:
          </Text>
          <Text style={{...FONTS.body4, color: COLORS.gray}}>Yes</Text>
        </View>
        <View
          style={{
            ...FONTS.body4,
          }}>
          <Text>WaterProof:</Text>
          <Text style={{...FONTS.body4, color: COLORS.gray}}>No</Text>
        </View>
      </View> */}
      {/* <Text
        style={{
          ...FONTS.h3,
          color: COLORS.primary,
          marginTop: 20,
        }}>
        Provider Name
      </Text> */}
      <Text style={{color: COLORS.gray, marginTop: 10}}>{summary}</Text>
    </View>
  );
};
