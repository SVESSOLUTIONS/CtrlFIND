import React, {useEffect} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppHeader,
  AppNoDataFound,
  BaseView,
  PaymentInfoCard,
} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {getPaymentsHistory} from '../../store/reducers/payments';

export const PaymentsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, payments} = useSelector(state => state.payments);
  useEffect(() => {
    const serverPayload = dispatch(getPaymentsHistory());
    return () => serverPayload;
    console.log("skdfhksjd======",JSON.stringify(payments))
  }, []);

  return (
    <>
      <AppHeader title={translate('paymentsTitle')} />
      <BaseView styles={styles.container} loading={loading}>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 40,
          }}
          keyExtractor={item => item.id}
          data={payments}
          renderItem={({item}) => <PaymentInfoCard item={item} />}
          ListEmptyComponent={() => (
            <AppNoDataFound title={translate('noPayments')} />
          )}
        />
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  title: {
    ...FONTS.h2,
    fontSize: 20,
    color: COLORS.black,
    fontWeight: '500',
    marginVertical: 10,
  },
  subtitle: {
    ...FONTS.h3,
    color: COLORS.gray,
    marginBottom: 5,
    fontWeight: '500',
  },
});
