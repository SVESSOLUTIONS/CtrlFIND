import moment from 'moment';
import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {AppIcon} from '..';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {translate} from '../../multiLang/translation';
export const AppointmentCard = ({item, onPress}) => {
  const {user} = useContext(AuthContext);
  const slots = JSON.parse(item?.appointment_time) ?? [];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        borderColor: COLORS.gray,
        borderWidth: 1,
        borderRadius: 10,
        height: 120,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
      }}>
      <View
        style={{
          flex: 1.2,
          backgroundColor: item?.service_status==="Delivered"?COLORS.gray:COLORS.primary,
          borderTopLeftRadius: 9,
          borderBottomLeftRadius: 9,
          justifyContent: 'center',


        }}>
        <View style={{marginLeft: 10,}}>
          {item?.appointment_date && item?.appointment_date !== '0000-00-00' ? (
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.h3,
                fontWeight: '600',

              }}>
              {moment(item?.appointment_date).format('D MMMM')}
            </Text>
          ) : (
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.h3,
                fontWeight: '600',
              }}>
              --
            </Text>
          )}

          {item?.require_appointment === 'Y' ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  ...FONTS.body4,
                    justifyContent:'space-between',
                    paddingRight:10
                }}>
                <AppIcon icon={icons.clock} size={14} color={COLORS.white} />

                <Text
                  style={{color: COLORS.white, fontSize: 11, marginLeft: 5,}}>
                  {helpers.getAccurateTimeSlot(slots)}
                </Text>
              </View>
            </>
          ) : null}

          <View style={{flexDirection: 'row', marginTop: 10, ...FONTS.body4}}>
            <AppIcon icon={icons.addresses} size={15} color={COLORS.white} />

            <Text style={{color: COLORS.white, fontSize: 11, marginLeft: 5}}>
              {translate(item?.location)}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
          justifyContent: 'center',
          flexDirection: 'column',
          flex: 1.5,
          paddingLeft: 12,
          borderColor: COLORS.gray,
          borderWidth: 1,
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
          }}>
          {user.id === item?.provider_id ? item?.name : item?.provider_name}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            color: '#81848C',
            fontSize: 14,
            marginTop: 10,
          }}>
          {item?.service?.title}
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            fontWeight: 'bold',
            marginTop: 8,
          }}>
          ${item?.amount}
        </Text>
        {item?.service_status === 'Decline' ||
        item?.service_status === 'Cancelled' ? (
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              marginTop: 8,
              color: COLORS.error,
            }}>
            {item?.service_status}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
