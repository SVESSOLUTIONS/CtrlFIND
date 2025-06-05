import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppHeader,
  AppIcon,
  AppointmentImage,
  AppointmentTrack,
  BaseView,
} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {getAppointmentDetails} from '../../store/reducers/appointments';
import {translate} from '../../multiLang/translation';
const loop = [1, 2, 3, 4, 5, 6];

export const AppointmentInformationScreen = ({navigation, route}) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const {appointment_details, loading} = useSelector(
    state => state.appointments,
  );

  useEffect(() => {
    dispatch(getAppointmentDetails(id));
  }, []);

  return (
    <>
      <AppHeader title={translate('appointmentInfoTitle')} />
      <BaseView styles={styles.container} loading={loading}>
        <View style={{marginVertical: 10, marginLeft: 5}}>
          <Text style={{...FONTS.body4, color: COLORS.gray}}>
            {translate('appointmentFor')}
          </Text>
          <Text style={{...FONTS.h2, color: COLORS.black, fontWeight: '600'}}>
            {appointment_details?.category?.name}
          </Text>
          <Text style={{...FONTS.body4, color: COLORS.gray}}>
            {appointment_details?.item?.title}
          </Text>
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <AppointmentTrack values={appointment_details} />
          {appointment_details?.images.lenght > 0 ? (
            <>
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
                {appointment_details.images.map(img => (
                  <AppointmentImage key={img.id} uri={img?.file_path} />
                ))}
              </View>
            </>
          ) : null}
          {/* <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '48%'}}>
              <AppButton
                title="Cancel"
                otherStyles={{backgroundColor: COLORS.lightGray}}
                textStyles={{color: COLORS.primary}}
              />
            </View>
            <View style={{width: '48%'}}>
              <AppButton
                title="Reschedule"
                onPress={() =>
                  navigation.navigate('schedule_appointment', {appointment})
                }
              />
            </View>
          </View> */}
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
