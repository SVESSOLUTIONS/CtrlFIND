import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {AppIcon} from '../base/AppIcon';
import {Day} from '../aapointments/Day';
import {useDispatch, useSelector} from 'react-redux';
import {setDateComponent} from '../../store/reducers/appointments';
import {translate} from "../../multiLang/translation";

export const DateComponent = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.appointments);
  if (loading) {
    return (
      <View>
        <ActivityIndicator
          animating={loading}
          color={COLORS.primary}
          size="large"
        />
      </View>
    );
  }
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
            {translate("selectDate")}
        </Text>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => dispatch(setDateComponent(false))}>
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
        <Calendar
          style={styles.calendar}
          dayComponent={({date, state}) => <Day date={date} state={state} />}
        />
        <View style={styles.bottomInfo}>
          <View style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.title}>{translate("availableSlots")}</Text>
          </View>
          <View style={styles.row}>
            <View style={[styles.dot, {backgroundColor: COLORS.error}]} />
            <Text style={[styles.title, {color: COLORS.error}]}>
                {translate("bookedSlots")}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  row: {flexDirection: 'row', alignItems: 'center', marginRight: 20},
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 5,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  title: {
    ...FONTS.h4,
    fontWeight: '400',
    letterSpacing: 0.2,
    color: COLORS.primary,
  },
});
