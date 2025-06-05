import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import {useDispatch} from 'react-redux';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {setTimeComponent, setTime} from '../../store/reducers/appointments';
import {AppIcon} from './AppIcon';

export const AppTimePicker = ({onClose, onTimeChange}) => {
  const dispatch = useDispatch();

  return (
    <>
      <View
        style={{
          height: 50,
          backgroundColor: COLORS.primary,
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.white,
            fontWeight: '500',
            flex: 1,
          }}>
          Select Time
        </Text>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            onClose ? onClose() : dispatch(setTimeComponent(false))
          }>
          <AppIcon icon={icons.close} size={15} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          padding: 20,
          backgroundColor: COLORS.white,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}>
        <DatePicker
            utcOffset={0}
          mode="time"
          minuteInterval={5}
          selected="08"
          options={{
            mainColor: COLORS.primary,
          }}
          onTimeChange={selectedTime =>
            onTimeChange
              ? onTimeChange(selectedTime)
              : dispatch(setTime(selectedTime))
          }
        />
      </View>
    </>
  );
};
