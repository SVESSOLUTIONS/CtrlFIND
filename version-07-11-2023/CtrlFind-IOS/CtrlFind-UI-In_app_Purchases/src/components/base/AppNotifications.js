import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import helpers from '../../constants/helpers';
import AuthContext from '../../context/AuthContext';
import {onCancelOrder} from '../../store/reducers/orders';
import {AppButton} from "./AppButton";
import {translate} from "../../multiLang/translation";

const Colours = {
  Recieved: '#949400',
  Pending: '#949400',
  Confirmed: '#00b822',
  InProgress: '#165c23',
  ReadyForPickUp: '#ff9966',
  ReadyForDelivery: '#ff9966',
  onTheWay: '#6fd5e3',
  onTheWayPickUp: '#ffcc00',
  onTheWayDelivery: '#ffcc00',
  Delivered: '#0d3a75',
};

export const   AppNotifications = ({
  notification,
  hrl,
  onConfirmOrder,
  onCancelOrder,
  onDeclineOrder,
}) => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();

  const order = notification?.order ? JSON.parse(notification.order) : null;

  return (
    <TouchableOpacity
      onPress={() => {
        if (order) {
          if (order?.user_id === user?.id) {
            if (helpers.getRole(user?.role_id) === helpers.BUYER) {
              if (
                order?.payment_status === helpers.ORDER_PAYMENT_STATUS.PENDING
              )
                  if(!order?.service_status==="Cancelled")
                return Alert.alert(
                  translate("Areyousure"),
                  translate("cancelorder")+` ${order?.order_nr}.`,
                  [
                    {
                      text: translate("NO"),
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: translate("YES"),
                      onPress: () => onCancelOrder(order?.id),
                      style: 'default',
                    },
                  ],
                );
              if (
                order?.payment_status === helpers.ORDER_PAYMENT_STATUS.CONFIRMED
              )
                  // +(order?.gst+order?.pst)
                return Alert.alert(
                  translate("ConfirmPayment"),
                  translate("Order")+` ${order?.order_nr}`+ translate("thepayableamount")+` ${order?.amount}.`+ translate("confirmtoproceed"),

                  [
                      {
                          text: translate("ORDERDETAIL"),
                          onPress: () =>
                              navigation.navigate('buyer_delivery_status_details', {id: order?.id,}),
                          style: 'default',
                      },
                    {
                      text: translate("NO"),
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: translate("YES"),
                      onPress: () =>
                        navigation.navigate('productPayment', {order}),
                      style: 'default',
                    },

                  ],
                );

              if (order?.order_type === 'service') {
                navigation.navigate('buyer_service_delivery_status_details', {
                  id: order?.id,
                });
              } else {
                navigation.navigate('buyer_delivery_status_details', {
                  id: order?.id,
                });
              }
            }
          } else if (order?.provider_id === user?.id) {
            if (helpers.getRole(user?.role_id) === helpers.SERVICE_PROVIDER) {
              if (
                order?.status === 'Decline' ||
                order?.status === 'Cancelled' ||
                order?.service_status === 'Decline' ||
                order?.service_status === 'Cancelled'
              ) {
                if (order?.order_type === 'service') {
                  navigation.navigate(
                    'provider_service_delivery_status_details',
                    {
                      id: order?.id,
                    },
                  );
                } else {
                  navigation.navigate('delivery_status_details', {
                    id: order?.id,
                  });
                }
                return;
              }
              if (
                order?.payment_status === helpers.ORDER_PAYMENT_STATUS.PENDING
              ) {
                return Alert.alert(
                  translate("ConfirmOrder"),
                    translate("ConfirmOrder")+` ${order?.order_nr}`+translate("thepayableamount") +`${order?.amount}.`+ translate("confirmtoproceed"),
                  [
                    {
                      text: translate("cancel"),
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: translate("CONFIRM"),
                      onPress: () => onConfirmOrder(order?.id),
                      style: 'default',
                    },
                    {
                      text: translate("DECLINE"),
                      onPress: () => onDeclineOrder(order?.id),
                      style: 'default',
                    },
                  ],
                );
              }

              if (
                order?.payment_status === helpers.ORDER_PAYMENT_STATUS.CONFIRMED
              )
                return;

              if (order?.order_type === 'service') {
                navigation.navigate(
                  'provider_service_delivery_status_details',
                  {
                    id: order?.id,
                  },
                );
              } else {
                navigation.navigate('delivery_status_details', {
                  id: order?.id,
                });
              }
            }
            if (order?.payment_status === helpers.ORDER_PAYMENT_STATUS.PENDING)
              return alert(translate("SwitchtoPROVIDER"));
          }
        } else return;
      }}
      activeOpacity={0.7}
      style={{
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomWidth: hrl ? 1 : 0,
        borderColor: COLORS.lightGray,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:"space-between"}}>
        <Text textTransform={"capitalize"}
          style={{
            ...FONTS.h3,
            color: order
              ? Colours[
                  order?.order_type === 'service'
                    ? order?.service_status
                    : order?.status
                ]
              : COLORS.black,
              flex:1,
            fontWeight: '600',

          }}>
            {notification?.title==="Order Update"?translate("Order Update"):notification?.title==="Order Confirmed"?translate("Order Confirmed"):notification?.title==="New Order"?translate("New Order"):notification?.title}
          {/*{translate()}*/}
        </Text>
          {/*{console.log("notification?.title"+notification?.title)}*/}
        {helpers.getRole(user?.role_id) === helpers.BUYER &&
        order?.payment_status === helpers.ORDER_PAYMENT_STATUS.CONFIRMED ? (
          <Text
            style={{
              fontSize: 12,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 10,
              marginLeft: 10,
              color: COLORS.primary,
            }}>
              {translate("Paynow")}
          </Text>
        ) : null}
        {helpers.getRole(user?.role_id) === helpers.SERVICE_PROVIDER &&
        order?.payment_status === helpers.ORDER_PAYMENT_STATUS.PENDING ? (
          <Text
            style={{
              fontSize: 12,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: COLORS.error,
              borderRadius: 10,
              marginLeft: 10,
              color: COLORS.error,
            }}>
            {order?.status === 'Decline' || order?.service_status === 'Decline'
              ? translate("Declined")
              : order?.status === 'Cancelled' ||
                order?.service_status === 'Cancelled'
              ? translate("Cancelled")
              : translate("Confirmnow")}
          </Text>
        ) : null}

        {helpers.getRole(user?.role_id) === helpers.SERVICE_PROVIDER &&
        order?.payment_status === helpers.ORDER_PAYMENT_STATUS.CONFIRMED ? (
          <Text
            style={{
              fontSize: 12,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: COLORS.error,
              borderRadius: 10,
              marginLeft: 10,
              color: COLORS.error,
                flex:1
            }}>
              {translate("paymentcurrentlypending")}
          </Text>
        ) : null}
      </View>
        {/*{console.log("order==="+JSON.stringify(order))}*/}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'space-between',
        }}>
        <View style={{flex: 2.5}}>
          <Text  textTransform={"capitalize"} style={{color: COLORS.gray}}>{notification?.message}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
          }}>
          <Text style={{color: COLORS.gray}}>
            {moment(notification?.created_at).format('DD/MM hh:mm')}
          </Text>
            {helpers.getRole(user?.role_id) === helpers.BUYER &&
            order?.payment_status === helpers.ORDER_PAYMENT_STATUS.CONFIRMED ? (
            <Text style={{color: COLORS.primary}}>
                {order?.amount} CAD
            </Text>
                ):null}

        </View>
      </View>
    </TouchableOpacity>
  );
};
