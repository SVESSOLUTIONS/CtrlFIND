import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useContext} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {AppButton, AppIcon} from '..';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import AuthContext from '../../context/AuthContext';

const HEIGHT = 70;

const lineStyle = {width: 2, backgroundColor: '#9E9E9E', height: HEIGHT};

const getOrderStatus = (order, row) => {
  switch (order?.service_status) {
    case 'Recieved':
      return row === 'Recieved' ? true : false;
    case 'Confirmed':
      return row === 'Recieved' || row === 'Confirmed' ? true : false;
    case 'onTheWayPickUp':
      return row === 'Recieved' ||
        row === 'Confirmed' ||
        row === 'onTheWayPickUp'
        ? true
        : false;

    case 'InProgress':
      return row === 'Recieved' ||
        row === 'Confirmed' ||
        row === 'onTheWayPickUp' ||
        row === 'InProgress'
        ? true
        : false;
    case 'ReadyForPickUp':
      return row === 'Recieved' ||
        row === 'Confirmed' ||
        row === 'onTheWayPickUp' ||
        row === 'InProgress' ||
        row === 'ReadyForPickUp'
        ? true
        : false;
    case 'Delivered':
      return row === 'Recieved' ||
        row === 'Confirmed' ||
        row === 'onTheWayPickUp' ||
        row === 'InProgress' ||
        row === 'ReadyForPickUp' ||
        row === 'Delivered'
        ? true
        : false;
    default:
      return false;
  }
};

const TrackData = ({children, title, status, style, date,title2,onPressTitle2}) => {
  return (
    <View style={style}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <Text
        style={[
          styles.txt,
          {
            color: status ? COLORS.black : COLORS.gray,
          },
        ]}>
        {title}
      </Text>
        <Text style={{color:COLORS.primary}} onPress={onPressTitle2}>{title2}</Text>
    </View>
      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {!children ? (
          date ? (
            <>
              <AppIcon
                icon={icons.clock}
                size={18}
                color={status ? COLORS.primary : COLORS.gray}
              />
              <Text
                style={{
                  color: status ? COLORS.black : COLORS.gray,
                  marginLeft: 5,
                }}>
                {date}
              </Text>
            </>
          ) : (
            <Text>---</Text>
          )
        ) : null}
      </View>
      {children}
    </View>
  );
};

export const ServiceOrderPickupTracking = ({
  onPressTracking,
  orderdetail,
  orderStatus,
}) => {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  const getDeliveredTime = () => {
    return (
      translate('finishTime') + ` ${moment(orderdetail?.updated_at).fromNow()}`
    );
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 10,
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <AppIcon
          icon={icons.clock}
          size={25}
          color={
            getOrderStatus(orderdetail, 'Recieved')
              ? COLORS.primary
              : COLORS.gray
          }
        />
        <View
          style={[
            lineStyle,
            {
              backgroundColor: getOrderStatus(orderdetail, 'Confirmed')
                ? COLORS.primary
                : COLORS.gray,
            },
          ]}
        />
        <AppIcon
          icon={icons.tick}
          size={25}
          color={
            getOrderStatus(orderdetail, 'Confirmed')
              ? COLORS.primary
              : COLORS.gray
          }
        />
        <View
          style={[
            lineStyle,
            {
              backgroundColor: getOrderStatus(orderdetail, 'onTheWayPickUp')
                ? COLORS.primary
                : COLORS.gray,
            },
          ]}
        />
        <AppIcon
          icon={icons.pin}
          size={25}
          color={
            getOrderStatus(orderdetail, 'onTheWayPickUp')
              ? COLORS.primary
              : COLORS.gray
          }
        />
        <View
          style={[
            lineStyle,
            {
              height: HEIGHT + 25,
              backgroundColor: getOrderStatus(orderdetail, 'InProgress')
                ? COLORS.primary
                : COLORS.gray,
            },
          ]}
        />
        <AppIcon
          icon={icons.progress}
          size={25}
          color={
            getOrderStatus(orderdetail, 'InProgress')
              ? COLORS.primary
              : COLORS.gray
          }
        />
        <View
          style={[
            lineStyle,
            {
              backgroundColor: getOrderStatus(orderdetail, 'ReadyForPickUp')
                ? COLORS.primary
                : COLORS.gray,
            },
          ]}
        />
        <AppIcon
          icon={icons.clock_done}
          size={25}
          color={
            getOrderStatus(orderdetail, 'ReadyForPickUp')
              ? COLORS.primary
              : COLORS.gray
          }
        />
        <View
          style={[
            lineStyle,
            {
              backgroundColor: getOrderStatus(orderdetail, 'Delivered')
                ? COLORS.primary
                : COLORS.gray,
            },
          ]}
        />
        <AppIcon
          icon={icons.delivery}
          size={25}
          color={
            getOrderStatus(orderdetail, 'Delivered')
              ? COLORS.primary
              : COLORS.gray
          }
        />
      </View>
      <View
        style={{
          marginLeft: 30,
          flexDirection: 'column',
          flex: 1,
        }}>
        <TrackData
          title={translate('orderReceived')}
          status={getOrderStatus(orderdetail, 'Recieved')}
          date={moment(orderdetail?.created_at).format('hh:mm:A , D MMM YYYY')}
          style={{
            height: HEIGHT + 25,
          }}
        >

            {orderdetail?.payment_status === helpers.ORDER_PAYMENT_STATUS.CONFIRMED?
                (
                    <Text
                        style={{
                            ...FONTS.h4,
                            fontSize: 9,
                            paddingHorizontal: 5,
                            letterSpacing: 2,
                            fontWeight: 'bold',
                            color:"red",
                            textTransform: 'uppercase',
                        }}>
                        Payment currently pending
                    </Text>)
                :null}
        </TrackData>
        <TrackData
          title={translate('orderConfirmed')}
          status={getOrderStatus(orderdetail, 'Confirmed')}
          style={{
            height: HEIGHT + 25,
          }}
          date={
            orderdetail?.confirmed_at
              ? moment(orderdetail?.confirmed_at).format('hh:mm:A , D MMM YYYY')
              : null
          }
        />

        <TrackData
          title={translate('onTheWay')}
          status={getOrderStatus(orderdetail, 'onTheWayPickUp')}
          date={
            orderdetail?.onPickup_at
              ? moment(orderdetail?.onPickup_at).format('hh:mm:A , D MMM YYYY')
              : null
          }
          style={{
            height: HEIGHT + 50,
          }}>
          {orderdetail?.service_status === 'onTheWayPickUp' ? (
            <AppButton
              onPress={onPressTracking}
              title={translate('tracking')}
              disabled={
                orderStatus
                  ? orderStatus
                  : orderdetail?.service_status !== 'onTheWayPickUp'
              }
              textStyles={{fontWeight: '500', fontSize: 15}}
              otherStyles={[
                styles.btn,
                {
                  backgroundColor: orderStatus
                    ? COLORS.gray
                    : getOrderStatus(orderdetail, 'onTheWayPickUp')
                    ? COLORS.primary
                    : COLORS.gray,
                },
              ]}
              Righticon={icons.clock}
              iconSize={15}
              iconColor={COLORS.white}
              iconStyles={styles.icon}
            />
          ) : null}
          <Text
            numberOfLines={2}
            style={{
              ...FONTS.body3,
              marginTop: 5,
            }}>
              {(orderdetail?.provider?.apartment_number?(orderdetail?.provider?.apartment_number+" - "):"")+orderdetail?.delivery_address}
          </Text>
        </TrackData>

        <TrackData
            title2={helpers.checkOrderExtraFees(orderdetail) === 'pending' ?"More":""}
            onPressTitle2={()=>{
                Alert.alert(
                    translate('extraPaymentdescription'),
                    orderdetail?.payment_discription??"Description not added",
                    [
                        {
                            text: translate('cancel'),
                            onPress: () => {},
                            style: 'cancel',
                        },

                    ],
                )
            }}
          title={translate('OrderInProgress')}
          status={getOrderStatus(orderdetail, 'InProgress')}
          style={{
            height: HEIGHT + 25,
          }}
          date={
            orderdetail?.inProgress_at
              ? moment(orderdetail?.inProgress_at).format(
                  'hh:mm:A , D MMM YYYY',
                )
              : null
          }>
          {helpers.checkOrderExtraFees(orderdetail) === 'pending' ? (
            <View>
              {helpers.getRole(user?.role_id) === helpers.BUYER ? (
                <AppButton
                  onPress={() =>
                    helpers.checkOrderExtraFees(orderdetail) === 'pending'
                      ? navigation.navigate('pay_extra_service_fee', {
                          order: orderdetail,
                        })
                      : null
                  }
                  title={`Pay extra fees ${orderdetail?.extra_service_fee} CAD`}
                  otherStyles={{
                    backgroundColor: COLORS.error,
                  }}
                  textStyles={{
                    fontSize: 16,
                  }}
                />
              ) : (
                <Text
                  style={{
                    ...FONTS.h4,
                    fontSize: 9,
                    paddingHorizontal: 5,
                    letterSpacing: 2,
                    fontWeight: 'bold',
                    color: COLORS.primary,
                    textTransform: 'uppercase',
                  }}>
                  Wait for client to pay extra fees.
                </Text>
              )}
            </View>
          ) : helpers.checkOrderExtraFees(orderdetail) === 'paid' ? (
            <Text
              style={{
                ...FONTS.h4,
                fontSize: 9,
                paddingHorizontal: 5,
                letterSpacing: 2,
                fontWeight: 'bold',
                color: COLORS.primary,
                textTransform: 'uppercase',
              }}>
              Extra Fees Paid
            </Text>
          ) : null}
        </TrackData>

        <TrackData
          title={translate('OrderReadyForPickUp')}
          status={getOrderStatus(orderdetail, 'ReadyForPickUp')}
          style={{
            height: HEIGHT + 25,
          }}
          date={
            orderdetail?.pickup_at
              ? moment(orderdetail?.pickup_at).format('hh:mm:A , D MMM YYYY')
              : null
          }
        />

        <TrackData
          title={translate('orderCompleted')}
          date={orderdetail?.delivered_at ? getDeliveredTime() : null}
          status={getOrderStatus(orderdetail, 'Delivered')}
        />



          {helpers.getRole(user?.role_id) === helpers.BUYER &&
          orderdetail?.payment_status === helpers.ORDER_PAYMENT_STATUS.CONFIRMED ? (
              <AppButton
                  title={"Pay Now"}
                  textStyles={{fontWeight: '500', fontSize: 15}}
                  otherStyles={[
                      styles.btn,
                      {
                          backgroundColor:  COLORS.primary,
                          width:"100%",
                          marginHorizontal:-30,
                          height:45,
                          borderRadius: 30
                      },
                  ]}
                  onPress={()=>{
                      Alert.alert(
                          translate("ConfirmPayment"),
                          translate("Order")+`${orderdetail?.order_nr}`+ translate("thepayableamount")+` ${orderdetail?.amount}.`+ translate("confirmtoproceed"),

                          [
                              {
                                  text: translate("NO"),
                                  onPress: () => {},
                                  style: 'cancel',
                              },
                              {
                                  text: translate("YES"),
                                  onPress: () =>
                                      navigation.navigate('productPayment', {order:orderdetail}),
                                  style: 'default',
                              },
                          ],
                      );
                  }}

              />
          ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  txt: {
    ...FONTS.h3,
    fontSize: 18,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  btn: {
    height: 30,
    width: 120,
    borderRadius: 10,
  },
  icon: {
    position: 'absolute',
    right: 8,
  },
});
