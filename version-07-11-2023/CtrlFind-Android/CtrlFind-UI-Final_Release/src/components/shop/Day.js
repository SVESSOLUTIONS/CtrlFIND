import moment from 'moment';
import React from 'react';
import {Pressable, Platform, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../constants/theme';
import {onPressDate} from '../../store/reducers/schedule';

export const Day = ({date, state}) => {
  const {dates, current_date} = useSelector(state => state.schedule);

  const dispatch = useDispatch();

  const getBgColor = (pressed, date) => {
    if (pressed) {
      return Platform.OS === 'ios' ? 'rgb(210, 230, 255)' : COLORS.white;
    }
    if (
      moment(current_date).isBefore(date.dateString) ||
      moment(current_date).isSame(date.dateString)
    ) {
      if (dates.includes(date.dateString)) {
        return COLORS.primary;
      }
    } else {
      return COLORS.white;
    }
  };

  const getColor = (state, date) => {
    if (!moment(current_date).isBefore(date.dateString)) {
      if (moment(current_date).isSame(date.dateString)) {
        return dates.includes(date.dateString) ? COLORS.white : COLORS.black;
      }
      return COLORS.gray;
    }
    if (dates.includes(date.dateString)) {
      return COLORS.white;
    } else {
      COLORS.black;
    }
  };

  const checkIfPrveDates = () => {
    if (!moment(current_date).isBefore(date.dateString)) {
      if (moment(current_date).isSame(date.dateString)) {
        return false;
      }
      return true;
    }
  };

  return (
    <Pressable
      onPress={() => dispatch(onPressDate(date))}
      disabled={checkIfPrveDates()}
      android_ripple={{
        color: `rgba(${COLORS.primary_rgb} ,0.5)`,
        borderless: true,
      }}
      style={({pressed}) => [
        {
          backgroundColor: getBgColor(pressed, date),
        },
        styles.dayContainer,
      ]}>
      <Text
        style={[
          {
            color: getColor(state, date),
          },
          styles.day,
        ]}>
        {date.day}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  day: {
    textAlign: 'center',
    fontSize: 10,
  },
  dayContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
