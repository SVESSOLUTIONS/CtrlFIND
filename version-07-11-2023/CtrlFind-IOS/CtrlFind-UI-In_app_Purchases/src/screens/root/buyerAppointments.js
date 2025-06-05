import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  AppHeader,
  AppNoDataFound,
  AppointmentCard,
  BaseView,
} from '../../components';
import {getBuyerOrders, setTitle} from '../../store/reducers/orders';
import {COLORS, FONTS} from "../../constants/theme";
import {translate} from "../../multiLang/translation";

const active_color = '#5cf7ed';

const status = ['', 'pending', 'Confirmed', 'onTheWay', 'Delivered'];

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

export const BuyerAppointmentScreen = ({navigation}) => {
  const {loading, serviceIndex, orders, services, title} = useSelector(
    state => state.orders,
  );

  const dispatch = useDispatch();
    // const pastAppointments = []


    // useEffect(()=>{
    //     services.forEach((item, i) => {
    //         if (item.service_status === "Delivered") {
    //             pastAppointments.push(item);
    //         }
    //     });
    // },)
  function gettingOrders(i) {
    title === 'Products'
      ? dispatch(getBuyerOrders(status[i]))
      : dispatch(getBuyerOrders(Servicestatus[i]));
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
      <AppHeader title={translate("appointmentTitle")} isMenu shadow={false} />
      <BaseView loading={loading} styles={styles.container}>
        {/*{console.log(JSON.stringify(pastAppointments))}*/}
        <FlatList
          data={services}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (

            <AppointmentCard
              item={item}
              onPress={() =>
                navigation.navigate('buyer_appointment_details', {
                  id: item?.id,
                })
              }
            />


          )}
          ListEmptyComponent={() => <AppNoDataFound title={translate("noAppointments")} />}
        />
        {/*<Text*/}
        {/*    style={{*/}
        {/*      ...FONTS.h3,*/}
        {/*      fontWeight: '600',*/}
        {/*      marginTop: 20,*/}
        {/*        borderBottomWidth:1,*/}
        {/*        borderBottomColor:COLORS.gray,*/}
        {/*        paddingBottom: 6,*/}
        {/*        marginBottom:10*/}
        {/*    }}>*/}
        {/* Past Appointments*/}
        {/*</Text>*/}
        {/*  <FlatList*/}
        {/*      data={pastAppointments}*/}
        {/*      keyExtractor={i => i.id}*/}
        {/*      showsVerticalScrollIndicator={false}*/}
        {/*      renderItem={({item}) => (*/}

        {/*          <AppointmentCard*/}
        {/*              item={item}*/}
        {/*              onPress={() =>*/}
        {/*                  navigation.navigate('buyer_appointment_details', {*/}
        {/*                      id: item?.id,*/}
        {/*                  })*/}
        {/*              }*/}
        {/*          />*/}


        {/*      )}*/}
        {/*      ListEmptyComponent={() => <AppNoDataFound title="No appointments." />}*/}
        {/*  />*/}
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
