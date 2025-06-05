import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {AppHeader, BaseView} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {Day} from '../../components/shop/Day';
import {getAllScheduleDates} from '../../store/reducers/schedule';
import {useDispatch, useSelector} from 'react-redux';
import {translate} from '../../multiLang/translation';

export const MyScheduleScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {initial_loading} = useSelector(state => state.schedule);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getAllScheduleDates());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch(getAllScheduleDates());
  }, []);

  return (
    <>
      <AppHeader title={translate('scheduleTitle')} />
      <BaseView styles={styles.container} loading={initial_loading}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}>
          <View>
            <Calendar
              style={styles.calendar}
              dayComponent={({date, state}) => (
                <Day date={date} state={state} />
              )}
            />
            <View style={styles.bottomInfo}>
              <View style={styles.row}>
                <View style={styles.dot} />
                <Text style={styles.title}>{translate('availableDates')}</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.dot} />
                <Text style={[styles.title, {color: COLORS.primary}]}>
                  {translate('bookingDates')}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  row: {flexDirection: 'row', alignItems: 'center', marginRight: 20},
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 5,
  },
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
    color: COLORS.black,
  },
});
