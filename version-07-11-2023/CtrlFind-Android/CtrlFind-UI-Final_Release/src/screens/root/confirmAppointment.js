import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {
  AppButton,
  AppHeader,
  AppIcon,
  AppointmentImage,
  AppointmentTrack,
  BaseView,
  LoginForm,
} from '../../components';
import helpers from '../../constants/helpers';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {translate} from '../../multiLang/translation';
import {onAddToCart} from '../../store/reducers/cart';
import icons from '../../constants/icons';

export const ConfirmAppointment = ({navigation, route}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {user, trigger} = useContext(AuthContext);
  const {appointment} = route.params;
  const {appointment_file} = route.params;
  const dispatch = useDispatch();
  const {item_details, categoryProviders} = useSelector(
    state => state.buyerDashboard,
  );
  const {appointment_initial_values, loading} = useSelector(
    state => state.appointments,
  );

  const PICKUP = translate('PickupService');
  const DELIVERY = translate('DeliveryService');

  return (
    <>
      <AppHeader title={translate('appointmentInfoTitle')} showCart />
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
          {appointment_initial_values.pickup ? (
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
                Picked up by the provider from this location
              </Text>
              <AppIcon
                icon={
                  appointment_initial_values.pickup ? icons.tick : icons.close
                }
                size={13}
              />
            </View>
          ) : null}
          {appointment_initial_values.delivery ? (
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
                Delivered by the provider from this location
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
          <AppointmentTrack values={appointment_initial_values} />
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
              }}>
              <View style={{width: '48%'}}>
                <AppButton
                  onPress={() => {
                    Alert.alert(
                      translate('cancelAppointment'),
                      translate('cancelAppointmentText'),
                      [
                        {
                          text: translate('no'),
                          onPress: () => {},
                          style: 'cancel',
                        },
                        {
                          text: translate('yes'),
                          onPress: () => navigation.navigate('items_screen'),
                          style: 'destructive',
                        },
                      ],
                    );
                  }}
                  title={translate('cancel')}
                  otherStyles={{backgroundColor: COLORS.lightGray}}
                  textStyles={{color: COLORS.primary}}
                />
              </View>
              <View style={{width: '48%'}}>
                <AppButton
                  title={translate('addToCart')}
                  loading={loading}
                  onPress={() => {
                    if (helpers.getRole(user?.role_id) === helpers.GUEST) {
                      setIsVisible(true);
                    } else {
                      dispatch(
                        onAddToCart({
                          provider_id: item_details?.UserId,
                          provider_name: categoryProviders.find(
                            p => p?.id === item_details?.UserId,
                          )?.name,
                          order_type: 'service',
                          schedule_id: appointment_initial_values?.schedule_id,
                          appointment_date: appointment_initial_values?.appointment_date,
                          appointment_time:
                            appointment_initial_values?.appointment_time,
                          product_id: item_details?.id,
                          product_name: item_details?.title,
                          taxable: item_details?.taxable,
                          product_color: {label: '#ffffff', value: '#ffffff'},
                          product_size: {label: 'xs', value: 'xs'},

                          product_price: appointment_initial_values?.appointment_time?.length ? appointment_initial_values?.appointment_time?.length * helpers.getItemPrice(item_details)
                            : helpers.getItemPrice(item_details),


                          product_img:
                            item_details?.images[0]?.file_path ?? null,
                          images: appointment_initial_values?.images,
                          pickup: appointment_initial_values?.pickup,
                          delivery: appointment_initial_values?.delivery,
                          require_appointment:
                            appointment_initial_values?.require_appointment,
                          information: appointment_initial_values?.information,
                          address_label:
                            appointment_initial_values?.address_label,
                          address: appointment_initial_values?.address,
                          lat: appointment_initial_values?.lat,
                          lng: appointment_initial_values?.lng,
                          location: item_details?.location,
                        }),
                      );
                    }
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{height: 40}} />
        </ScrollView>
      </BaseView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <LoginForm onClose={() => setIsVisible(false)} />
      </Modal>
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
