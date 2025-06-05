import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {AppButton, AppHeader, AppIcon, BaseView} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {translate} from '../../multiLang/translation';

export const AppointmentBooked = ({navigation, route}) => {
  const {trigger} = React.useContext(AuthContext);
  const {item} = route.params;
  return (
    <>
      <AppHeader title={'Appointment Booked'} isMenu />
      <BaseView styles={styles.container}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}>
          <AppIcon icon={icons.tick} color={COLORS.primary} size={100} />
          <Text
            style={{
              ...FONTS.h1,
              textAlign: 'center',
              fontWeight: '700',
              marginTop: 30,
              letterSpacing: 1,
            }}>
            {translate('bookedTitle')}
          </Text>
          <Text
            style={{
              ...FONTS.body2,
              textAlign: 'center',
              fontWeight: '400',
              marginTop: 10,
              letterSpacing: 1,
            }}>
            {translate('booked')}
          </Text>
          <AppButton
            title={translate('home')}
            onPress={() => {
              trigger.setRoute('home');
              navigation.navigate('items_screen');
            }}
            otherStyles={{
              backgroundColor: COLORS.white,
              borderWidth: 1,
              borderColor: COLORS.primary,
            }}
            textStyles={{color: COLORS.black}}
          />
          <View style={{height: 40}} />
        </View>
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
