import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {AppHeader, BaseView, PaymentInfoCard} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';

export const AllPaymentsScreen = ({navigation}) => {
  return (
    <>
      <AppHeader title={translate('paymentsTitle')} />
      <BaseView styles={styles.container}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}>
          <View>
            <Text style={styles.subtitle}>25 December 2021</Text>
            <PaymentInfoCard />
            <PaymentInfoCard />
          </View>
          <View>
            <Text style={styles.subtitle}>20 December 2021</Text>
            <PaymentInfoCard />
            <PaymentInfoCard />
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
  subtitle: {
    ...FONTS.h3,
    color: COLORS.gray,
    marginBottom: 5,
    fontWeight: '500',
  },
});
