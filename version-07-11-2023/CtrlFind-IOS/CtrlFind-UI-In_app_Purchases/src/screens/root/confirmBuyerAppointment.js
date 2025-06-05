import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppHeader,
  AppIcon,
  AppointmentConfirmationTrack,
  AppointmentImage,
  BaseView,
} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {onAppointmentConfirm} from '../../store/reducers/appointments';

export const ConfirmBuyerAppointmentScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {appointment} = route.params;
  const {appointment_file} = route.params;
  const {appointment_initial_values} = useSelector(state => state.appointments);

  const PICKUP = translate('PickupService');
  const DELIVERY = translate('DeliveryService');

  return (
    <>
      <AppHeader title={translate('confirmation')} />
      <BaseView styles={styles.container}>
        <View style={{marginVertical: 10, marginLeft: 5}}>
          <Text style={{...FONTS.body4, color: COLORS.gray}}>
            {translate('appointmentFor')}
          </Text>
          <Text style={{...FONTS.h2, color: COLORS.black, fontWeight: '600'}}>
            {appointment?.category}
          </Text>
          <Text style={{...FONTS.body4, color: COLORS.gray}}>
            {appointment?.service?.title}
          </Text>
          {appointment_initial_values?.pickup ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 3,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.black,
                  marginRight: 5,
                }}>
                Picked
              </Text>
              <AppIcon
                icon={
                  appointment_initial_values.pickup ? icons.tick : icons.close
                }
                size={13}
              />
            </View>
          ) : null}
          {appointment_initial_values?.delivery ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 3,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.black,
                  marginRight: 5,
                }}>
                Delivered
              </Text>
              <AppIcon
                icon={
                  appointment_initial_values.delivery ? icons.tick : icons.close
                }
                size={13}
              />
            </View>
          ) : null}
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <AppointmentConfirmationTrack />
          {appointment_initial_values?.images.length ? (
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
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            {appointment_initial_values?.images.map((img, i) => (
              <AppointmentImage key={i} uri={img?.uri} />
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
                    {`${appointment_initial_values?.price} CAD`}
                  </Text>
                </View>
              </View>
              <View style={{width: '48%'}}>
                <AppButton
                  title={translate('confirmTitle')}
                  onPress={() =>
                    dispatch(
                      onAppointmentConfirm({
                        ...appointment,
                        appointment_file: appointment_file,
                      }),
                    )
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
