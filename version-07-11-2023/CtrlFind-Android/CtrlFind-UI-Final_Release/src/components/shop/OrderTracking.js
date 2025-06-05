import moment from 'moment';
import React, {useContext} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {AppButton, AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import helpers from "../../constants/helpers";
import AuthContext from "../../context/AuthContext";
import {useNavigation} from "@react-navigation/native";

const HEIGHT = 80;

const lineStyle = {width: 2, backgroundColor: '#9E9E9E', height: HEIGHT};

const getOrderStatus = (order, row) => {
  switch (order?.status) {
    case 'Pending':
      return row === 'Pending' ? true : false;
    case 'Confirmed':
      return row === 'Pending' || row === 'Confirmed' ? true : false;
    case 'onTheWay':
      return row === 'Pending' || row === 'Confirmed' || row === 'onTheWay'
        ? true
        : false;
    case 'Delivered':
      return row === 'Pending' ||
        row === 'Confirmed' ||
        row === 'onTheWay' ||
        row === 'Delivered'
        ? true
        : false;
    default:
      return false;
  }
};

const getOrderLineStatus = (order, row) => {
  switch (order?.status) {
    case 'Pending':
      return false;
    case 'Confirmed':
      return row === 'Confirmed' ? true : false;
    case 'onTheWay':
      return true;
    case 'Delivered':
      return true;
    default:
      return false;
  }
};

const TrackData = ({children, title, status, style, date,}) => {
  return (
    <View style={style}>
      <Text
        style={[
          styles.txt,
          {
            color: status ? COLORS.black : COLORS.gray,
          },
        ]}>
        {title}
      </Text>

      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {date ? (
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
        )}
      </View>
      {children}
    </View>
  );
};

export const OrderTracking = ({onPressTracking, orderdetail, orderStatus}) => {

    const {user} = useContext(AuthContext);
    const navigation = useNavigation();
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
            getOrderStatus(orderdetail, 'Pending')
              ? COLORS.primary
              : COLORS.gray
          }
        />
        <View
          style={[
            lineStyle,
            {
              backgroundColor: getOrderLineStatus(orderdetail, 'Confirmed')
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
              backgroundColor: getOrderLineStatus(orderdetail, 'onTheWay')
                ? COLORS.primary
                : COLORS.gray,
            },
          ]}
        />
        <AppIcon
          icon={icons.pin}
          size={25}
          color={
            getOrderStatus(orderdetail, 'onTheWay')
              ? COLORS.primary
              : COLORS.gray
          }
        />
        <View
          style={[
            lineStyle,
            {
              height: HEIGHT + 25,
              backgroundColor: getOrderStatus(
                orderdetail,
                translate('delivered'),
              )
                ? COLORS.primary
                : COLORS.gray,
            },
          ]}
        />
        <AppIcon
          icon={icons.products}
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
        {console.log(JSON.stringify(orderdetail))}
        <TrackData
          title={translate('orderReceived')}
          status={getOrderStatus(orderdetail, 'Pending')}
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
                            marginTop:5,
                            color:"red",
                            textTransform: 'uppercase',
                        }}>
                        {translate("paymentCurrentlyPending")}
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
          status={getOrderStatus(orderdetail, 'onTheWay')}
          date={
            orderdetail?.delivery_address
          }
          style={{
            height: HEIGHT + 50,
          }}>
          {orderdetail?.status === 'onTheWay' ? (
            <AppButton
              onPress={onPressTracking}
              title={translate('tracking')}
              disabled={
                orderStatus ? orderStatus : orderdetail?.status !== 'onTheWay'
              }
              textStyles={{fontWeight: '500', fontSize: 15}}
              otherStyles={[
                styles.btn,
                {
                  backgroundColor: orderStatus
                    ? COLORS.gray
                    : getOrderStatus(orderdetail, 'onTheWay')
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
        </TrackData>
        <TrackData
          title={translate('orderDelivered')}
          date={orderdetail?.delivered_at ? getDeliveredTime() : null}
          status={getOrderStatus(orderdetail, 'Delivered')}
        />

          {helpers.getRole(user?.role_id) === helpers.BUYER &&
          orderdetail?.payment_status === helpers.ORDER_PAYMENT_STATUS.CONFIRMED ? (
              <AppButton
                  title={"Pay Now"}
                  textStyles={{fontWeight: '500', fontSize: 15,}}
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
                          translate("Order")+` ${orderdetail?.order_nr}`+translate("thepayableamount") +` ${orderdetail?.amount}.`+ translate("confirmtoproceed"),

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
