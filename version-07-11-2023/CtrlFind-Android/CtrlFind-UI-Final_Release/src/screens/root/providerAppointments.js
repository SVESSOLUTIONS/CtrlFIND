import React, {useEffect} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppHeader,
  AppNoDataFound,
  AppointmentCard,
  BaseView,
} from '../../components';
import {getProviderOrders, setTitle} from '../../store/reducers/orders';
import {translate} from "../../multiLang/translation";

const Servicestatus = [
  '',
  'Recieved',
  'Confirmed',
  'InProgress',
  'ReadyForPickUp',
  'ReadyForDelivery',
  'onTheWay',
  'onTheWayPickUp',
  'onTheWayDelivery',
  'Delivered',
];

export const AppointmentScreen = ({navigation}) => {
  const {loading, serviceIndex, orders, services, title} = useSelector(
    state => state.orders,
  );
  const dispatch = useDispatch();

  function gettingOrders(i) {
    dispatch(getProviderOrders(Servicestatus[i]));
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(setTitle('Services'));
      gettingOrders(serviceIndex);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      {console.log("services===========",JSON.stringify(services))}
      <AppHeader title={translate("appointmentTitle")} isMenu shadow={false} />
      <BaseView loading={loading} styles={styles.container}>
        <FlatList
          data={services}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <AppointmentCard
              item={item}
              onPress={() =>
                navigation.navigate('provider_appointment_details', {
                  id: item?.id,
                })
              }
            />
          )}
          ListEmptyComponent={() => <AppNoDataFound title="No appointments." />}
        />
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
