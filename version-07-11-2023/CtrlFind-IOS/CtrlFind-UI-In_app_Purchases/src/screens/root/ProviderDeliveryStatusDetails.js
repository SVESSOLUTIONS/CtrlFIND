import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert,Text} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppHeader,
  BaseView,
  OrderTracking,
  ServiceOrderDeliveryTracking,
  ServiceOrderHomeTracking,
  ServiceOrderPickupDeliveryTracking,
  ServiceOrderPickupTracking,
  ServiceOrderTracking,
  TrackLocation,
} from '../../components';
import {COLORS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {
  changeServiceOrderStatus,
  onConfirmOrder,
  onDeclineOrder,
  onPressChat,
  orderDetails,
  orderTrackingState,
} from '../../store/reducers/orders';
import {translate} from '../../multiLang/translation';
import icons from '../../constants/icons';
import helpers from '../../constants/helpers';
import toast from '../../server/toast';
import {DeclineOrder} from '../../components/notifications/DeclineOrder';
export const ProviderDeliveryStatusDetails = ({navigation, route}) => {
  const {trigger} = useContext(AuthContext);
  const {id} = route.params;
  const dispatch = useDispatch();
  const {loading, serverLoading, orderdetail} = useSelector(
    state => state.orders,
  );
  const [orderId, setOrderId] = useState(null);
  const [isDecline, setIsDecline] = useState(false);

  useEffect(() => {
    dispatch(orderDetails(id));
  }, []);

  const onUpdateTrackingState = async values => {
    const response = await dispatch(
      orderTrackingState({id: orderdetail?.id, values}),
    );
    if (response?.payload) {
      trigger.updateUser(response.payload);
    }
    setIsVisible(false);
  };

  function getDeliveryTitle() {
    if (orderdetail?.location !== 'home') {
      if (orderdetail?.pickup && orderdetail?.delivery) {
        switch (orderdetail?.service_status) {
          case 'Recieved':
            return 'Confirm Delivery';
          case 'Confirmed':
            return 'Dispatched';
          case 'onTheWayPickUp':
            return 'In Progress';
          case 'InProgress':
            return 'Ready For Delivery';
          case 'ReadyForDelivery':
            return 'Dispatched';
          default:
            return 'COMPLETED';
        }
      }
      if (!orderdetail?.pickup && !orderdetail?.delivery) {
        switch (orderdetail?.service_status) {
          case 'Recieved':
            return 'Confirm Delivery';
          case 'Confirmed':
            return 'In Progress';
          case 'InProgress':
            return 'Ready For Pickup';
          default:
            return 'COMPLETED';
        }
      }
      if (orderdetail?.pickup) {
        switch (orderdetail?.service_status) {
          case 'Recieved':
            return 'Confirm Delivery';
          case 'Confirmed':
            return 'Dispatched';
          case 'onTheWayPickUp':
            return 'In Progress';
          case 'InProgress':
            return 'Ready For Pickup';
          default:
            return 'COMPLETED';
        }
      }
      if (orderdetail?.delivery) {
        switch (orderdetail?.service_status) {
          case 'Recieved':
            return 'Confirm Delivery';
          case 'Confirmed':
            return 'In Progress';
          case 'InProgress':
            return 'Ready For Pickup';
          case 'ReadyForDelivery':
            return 'Dispatched';
          default:
            return 'COMPLETED';
        }
      }
    } else {
      switch (orderdetail?.service_status) {
        case 'Recieved':
          return 'Confirm Delivery';
        case 'Confirmed':
          return 'In Progress';
        case 'InProgress':
          return 'Dispatched';
        case 'onTheWay':
          return 'COMPLETED';
        default:
          return 'COMPLETED';
      }
    }
  }

  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <>
      <AppHeader
        title={translate('orderStatus')}
        subtitle={'order no: ' + orderdetail?.order_nr}
        onPressChat={() => dispatch(onPressChat(orderdetail?.user_id))}
        loading={serverLoading}
        onPressRight={() =>
          helpers.checkOrderExtraFees(orderdetail) === 'no'
            ? navigation.navigate('extra_payment', {
                order: orderdetail,
              })
            : null
        }
        rightIcon={
          helpers.checkOrderExtraFees(orderdetail) === 'no'
            ? icons.dollar
            : null
        }
        iconTitle={
          helpers.checkOrderExtraFees(orderdetail) === 'no'
            ? 'Extra Fees'
            : null
        }
      />
      <BaseView styles={styles.container} loading={loading}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{marginTop: 10, paddingHorizontal: 10}}
          showsVerticalScrollIndicator={false}>
          {orderdetail?.location !== 'home' ? (
            <>
              {orderdetail?.pickup && orderdetail?.delivery ? (

                <ServiceOrderPickupDeliveryTracking
                  onPressTracking={() => setIsVisible(true)}
                  orderdetail={orderdetail}
                />

              ) : !orderdetail?.pickup && !orderdetail?.delivery ? (
                <ServiceOrderTracking
                  onPressTracking={() => setIsVisible(true)}
                  orderdetail={orderdetail}
                />

              ) : orderdetail?.pickup ? (
                <ServiceOrderPickupTracking
                  onPressTracking={() => setIsVisible(true)}
                  orderdetail={orderdetail}
                />
              ) : (
                <ServiceOrderDeliveryTracking
                  onPressTracking={() => setIsVisible(true)}
                  orderdetail={orderdetail}
                />
              )}
            </>
          ) : (
            <ServiceOrderHomeTracking
              onPressTracking={() => setIsVisible(true)}
              orderdetail={orderdetail}
            />
          )}
          <View
            style={{
              height: 2,
              backgroundColor: COLORS.lightGray,
              marginVertical: 10,
            }}
          />
          {/*{console.log("orderdata",JSON.stringify(orderdetail))}*/}

          {/*{alert(orderdetail?.extra_service_fee_status)}*/}
          {orderdetail?.payment_status === 'paid' ? (
            <AppButton
              onPress={() =>
                Alert.alert(
                  translate('confirmOrderStatus'),
                  translate("Changeorderstatus")+` \n"${getDeliveryTitle()}"\n `+translate("confirmtoproceed"),
                  [
                    {
                      text: translate('cancel'),
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: translate('yes'),
                      onPress: () => dispatch(changeServiceOrderStatus(id)),
                      style: 'default',
                    },
                  ],
                )
              }
              title={getDeliveryTitle()}
              disabled={orderdetail?.service_status === 'Delivered'||orderdetail?.extra_service_fee_status==="pending"}
              loading={serverLoading}
              otherStyles={{
                marginTop: 20,
                width: '90%',
                alignSelf: 'center',
                backgroundColor:
                  orderdetail?.service_status === 'Delivered'||orderdetail?.extra_service_fee_status==="pending"
                    ? COLORS.gray
                    : COLORS.primary,
              }}
            />
          ) : orderdetail?.service_status ===
            'Decline' ? null : orderdetail?.service_status ===
            'Cancelled' ? null : (
            <AppButton
              onPress={() => {
                Alert.alert(
                  translate("ConfirmOrder"),
                  translate("ConfirmOrder")+` ${orderdetail?.order_nr}. `+translate("thepayableamount")+ ` ${orderdetail?.amount}. `+translate("confirmtoproceed"),

                  [
                    {
                      text: translate("cancel"),
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: translate("CONFIRM"),
                      onPress: () => dispatch(onConfirmOrder(orderdetail?.id)),
                      style: 'default',
                    },
                    {
                      text: translate("DECLINE"),
                      onPress: () => {
                        setOrderId(orderdetail?.id);
                        setIsDecline(true);
                      },
                      style: 'default',
                    },
                  ],
                );
              }}
              title={translate("ConfirmOrder")}
              disabled={orderdetail?.payment_status === 'confirmed'}
              loading={serverLoading}
              otherStyles={{
                marginTop: 20,
                width: '90%',
                alignSelf: 'center',
                backgroundColor:
                  orderdetail?.payment_status === 'confirmed'
                    ? COLORS.gray
                    : COLORS.primary,
              }}
            />
          )}

          <View style={{height: 30}} />
        </ScrollView>
        <Modal
          isVisible={isVisible}
          hideModalContentWhileAnimating
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}
          animationOutTiming={300}
          useNativeDriver>
          <TrackLocation
            onPress={() => setIsVisible(false)}
            onUpdateTrackingState={onUpdateTrackingState}
          />
        </Modal>
      </BaseView>
      <Modal
        isVisible={isDecline}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <DeclineOrder
          onClose={() => setIsDecline(false)}
          onSubmit={values => {
            setIsDecline(false);
            dispatch(onDeclineOrder({id: orderId, values}));
          }}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
});
