import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  AppButton,
  AppHeader,
  AppointmentConfirmationTrack,
  AppointmentImage,
  BaseView,
} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

const loop = [1, 2, 3, 4, 5, 6];

export const AppointmentConfirmationScreen = ({navigation, route}) => {
  const {appointment} = route.params;
  return (
    <>
      <AppHeader title={translate('confirmation')} />
      <BaseView styles={styles.container}>
        <View style={{marginVertical: 10, marginLeft: 5}}>
          <Text style={{...FONTS.body4, color: COLORS.gray}}>
            {translate('appointmentFor')}
          </Text>
          <Text style={{...FONTS.h2, color: COLORS.black, fontWeight: '600'}}>
            {appointment.title}
          </Text>
          <Text style={{...FONTS.body4, color: COLORS.gray}}>
            {appointment.subtitle}
          </Text>
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <AppointmentConfirmationTrack />
          <Text
            style={{
              ...FONTS.h4,
              marginTop: 20,
              marginLeft: 10,
              color: COLORS.black,
              fontWeight: '800',
            }}>
            Images
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            {loop.map(l => (
              <AppointmentImage key={l} />
            ))}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View style={{width: '48%'}}>
                <View>
                  <Text style={{...FONTS.body4, color: COLORS.gray}}>
                    {translate('amount')}
                  </Text>
                  <Text style={{...FONTS.h2, fontWeight: '600'}}>
                    {appointment.price}
                  </Text>
                </View>
              </View>
              <View style={{width: '48%'}}>
                <AppButton
                  title={translate('payment')}
                  onPress={() =>
                    navigation.navigate('appointment_booked', {appointment})
                  }
                />
              </View>
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
