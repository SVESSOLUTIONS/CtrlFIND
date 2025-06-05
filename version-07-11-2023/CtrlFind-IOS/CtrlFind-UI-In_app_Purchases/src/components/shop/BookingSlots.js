import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {setSlots, setTimeComponent} from '../../store/reducers/appointments';
import {getScheduleTiming} from '../../store/reducers/schedule';
import {AppButton} from '../base/AppButton';

export const BookingSlots = ({onPressCancel, onPressConfirm,serviceData}) => {
  const dispatch = useDispatch();
  const {appointment_initial_values, schedules, slots} = useSelector(
    state => state.appointments,
  );
  const {timings, server_loading} = useSelector(state => state.schedule);
  const {isSchedule, setIsSchedule} = useState("");

  useEffect(() => {
      console.log("schedules===",schedules)
      console.log("appointment_initial_values======",appointment_initial_values)

    const date = appointment_initial_values?.appointment_date;
    const employee_id = serviceData?.service?.employee_id;

    const date_id = schedules.find(
      item => (moment(item.booking_date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'))&&(item?.employee_id===employee_id),)?.id;

    if (date_id) dispatch(getScheduleTiming(date_id));

    else {
        dispatch(setTimeComponent(false));
        alert(translate("errorwhilegettingslots"));
    }
  }, []);

  if (server_loading) {
    return (
      <View>
        <ActivityIndicator
          animating={server_loading}
          color={COLORS.primary}
          size="large"
        />
      </View>
    );
  }
  return (
    <View
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingVertical: 20,
      }}>
      <Text style={{...FONTS.h3, fontWeight: 'bold', marginBottom: 10}}>
        {translate('scheduleList')}
        {'  '}{' '}
        <Text
          style={{fontWeight: 'normal', fontSize: 14, color: COLORS.primary}}>
          {timings ? translate('YouCanBookMultipleSlots') : null}
        </Text>
      </Text>
      <View
        style={{
          maxHeight: SIZES.height - 300,
        }}>
          {/*{alert("timings==,timings==",timings)}*/}
        <FlatList
          data={timings}
          keyExtractor={(_, index) => index}
          renderItem={({item}) => (
            <TouchableOpacity
              disabled={item === 'BOOKED' ? true : false}
              onPress={() => dispatch(setSlots(item))}
              activeOpacity={0.7}
              style={{
                backgroundColor:
                  item === 'BOOKED'
                    ? COLORS.error
                    : slots.some(i => i === item)
                    ? COLORS.primary
                    : COLORS.white,
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
                  color:
                    item === 'BOOKED'
                      ? COLORS.white
                      : slots.some(i => i === item)
                      ? COLORS.white
                      : COLORS.black,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View>
        <AppButton
          onPress={onPressCancel}
          title={translate('close')}
          otherStyles={{
            backgroundColor: COLORS.gray,
          }}
        />
        <AppButton
          onPress={() => onPressConfirm(slots)}
          title={translate('confirmTitle')}
          otherStyles={{
            backgroundColor: COLORS.primary,
          }}
        />
      </View>
    </View>
  );
};
