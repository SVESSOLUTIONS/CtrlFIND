import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  AppButton,
  AppHeader,
  AppointmentDatePicker,
  LocationInput,
  BaseView,
  ImageUpload,
} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

const loop = [1, 2, 3, 4, 5, 6];

export const ScheduleAppointmentScreen = ({navigation, route}) => {
  const {appointment} = route.params;
  return (
    <>
      <AppHeader title={translate('scheduleAppointment')} />
      <BaseView styles={styles.container}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <AppointmentDatePicker
            title={translate('selectDate')}
            icon={icons.date}
          />
          <AppointmentDatePicker
            title={translate('selectTime')}
            icon={icons.clock}
          />
          <Text
            style={{
              ...FONTS.h4,
              marginTop: 20,
              marginLeft: 5,
              color: COLORS.gray,
              fontWeight: '800',
            }}>
            {translate('upload')}
          </Text>
          <LocationInput location={'345, New York Business center.'} />
          <Text
            style={{
              ...FONTS.h4,
              marginTop: 20,
              marginLeft: 5,
              color: COLORS.gray,
              fontWeight: '800',
            }}>
            {translate('upload')}
          </Text>
          <ImageUpload onPress={() => alert(translate("onPressUpload"))} />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View style={{width: '48%'}}>
              <View>
                <Text style={{...FONTS.body4, color: COLORS.gray}}>Amount</Text>
                <Text style={{...FONTS.h2, fontWeight: '600'}}>
                  {appointment.price}
                </Text>
              </View>
            </View>
            <View style={{width: '48%'}}>
              <AppButton
                title={translate('continue')}
                onPress={() =>
                  navigation.navigate('appointment_confirmation', {appointment})
                }
              />
            </View>
          </View>
          <View style={{height: 40}} />
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
});
