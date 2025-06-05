import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {AppButton, AppHeader, AppIcon, BaseView, List} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

export const OrderFailedScreen = ({navigation, route}) => {
  const {order} = route.params;
  return (
    <>
      <AppHeader title={translate('failed')} />
      <BaseView styles={styles.container}>
        <ScrollView
          style={{flex: 1, marginTop: 15}}
          showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center'}}>
            <AppIcon icon={icons.cancel} size={80} color={COLORS.error} />
            <Text
              style={{
                ...FONTS.h2,
                fontWeight: '600',
                textAlign: 'center',
                marginTop: 20,
              }}>
              {order?.payment_type === 'CARD'
                ? translate('paymentFailed')
                : translate('orderFailed')}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                fontWeight: '300',
                textAlign: 'center',
              }}>
              {translate('noInternet')}
            </Text>
          </View>
          {/* <List title="Error Code" subtitle="EP2003" />
          <List title="Payment ID" subtitle="34234234" /> */}

          <AppButton
            onPress={() => navigation.navigate('notification_stack')}
            title={translate('done')}
            otherStyles={{
              marginTop: 40,
            }}
          />

          <View style={{height: 40}} />
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  txt: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '300',
    marginRight: 5,
  },
});
