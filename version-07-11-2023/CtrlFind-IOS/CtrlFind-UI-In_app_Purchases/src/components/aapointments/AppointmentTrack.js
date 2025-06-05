import React from 'react';
import {View, Text} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from "../../multiLang/translation";

const HEIGHT = 90;

export const AppointmentTrack = ({values}) => {
  return (
    <View style={{flexDirection: 'row', marginTop: 15, width: '100%'}}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <AppIcon icon={icons.clock} size={25} color={COLORS.primary} />
        <View
          style={{
            width: 2,
            height: HEIGHT + values?.appointment_time?.length * 14,
            backgroundColor: '#9E9E9E',
          }}
        />
        <AppIcon icon={icons.addresses} size={25} color={COLORS.primary} />
        <View style={{width: 2, height: HEIGHT, backgroundColor: '#9E9E9E'}} />
        <AppIcon icon={icons.about} size={25} color={COLORS.primary} />
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginLeft: 10,
          flex: 1,
        }}>
        <View
          style={{
            height: HEIGHT + 25 + values?.appointment_time?.length * 14,
            marginTop: 5,
            overflow: 'hidden',
          }}>
          <Text style={{color: COLORS.black, fontWeight: '600', fontSize: 15}}>{"confirmedFor"}</Text>
          <Text
            style={{
              color: COLORS.gray,
              fontSize: 15,
              fontWeight: 'bold',
              marginTop: 5,
            }}>
            {values?.appointment_date}
          </Text>
          <Text
            style={{
              color: COLORS.gray,
              fontSize: 15,
              fontWeight: 'bold',
              marginTop: 5,
            }}>
            {typeof values?.appointment_time == 'object'
              ? values?.appointment_time?.map((i, index) => (
                  <Text key={index}>
                    <Text
                      style={{
                        color: COLORS.primary,
                      }}>
                      {index + 1}
                    </Text>
                    <Text>{'-' + i + '\n'}</Text>
                  </Text>
                ))
              : values?.appointment_time}
          </Text>
        </View>
        <View
          style={{
            height: HEIGHT + 25,
            overflow: 'hidden',
          }}>
          <Text
            style={{
              color: COLORS.black,
              fontWeight: '600',
              fontSize: 15,
            }}>
              {translate("locationat")}
          </Text>

          <Text
            style={{
              color: '#393A49',
              fontSize: 14,
              marginTop: 5,
            }}>
            {values?.address}
          </Text>
        </View>

        <Text
          style={{
            color: COLORS.black,
            fontWeight: '600',
            fontSize: 15,

          }}>
            {translate("additionalInformation")}
        </Text>
        <Text
          style={{
            ...FONTS.body4,
            paddingVertical: 5,
            paddingRight: 10,
          }}>
          {values?.information}
        </Text>
      </View>
    </View>
  );
};
