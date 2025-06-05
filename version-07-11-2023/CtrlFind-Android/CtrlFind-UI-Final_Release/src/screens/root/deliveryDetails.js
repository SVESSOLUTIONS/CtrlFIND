
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppHeader,
  BaseView,
  OrderTracking,
  TrackLocation,
} from '../../components';
import {COLORS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import useLocation from '../../hooks/useLocation';
import {
  changeOrderStatus,
  onConfirmOrder,
  onDeclineOrder,
  onPressChat,
  orderDetails,
  orderTrackingState,
} from '../../store/reducers/orders';
import {translate} from '../../multiLang/translation';
import server from '../../server/server';
import {DeclineOrder} from '../../components/notifications/DeclineOrder';
export const DeliveryDetailsScreen = ({navigation, route}) => {
  const {getLocationUpdates, removeLocationUpdates} = useLocation();
  const {trigger,} = useContext(AuthContext);
  const {id} = route.params;
  const dispatch = useDispatch();
  const {loading, serverLoading, orderdetail} = useSelector(
      state => state.orders,
  );

  const [orderId, setOrderId] = useState(null);
  const [isDecline, setIsDecline] = useState(false);

  useEffect(() => {
    dispatch(orderDetails(id));
    console.log(JSON.stringify(orderdetail))

  }, []);

  const onUpdateTrackingState = async (values) => {
    console.log("value",values)
    const response = await dispatch(
        orderTrackingState({id: orderdetail?.id, values}),
    );
    if (response?.payload) {
      trigger.updateUser(response.payload);
    }
    setIsVisible(false);
  };

  function getDeliveryTitle() {
    switch (orderdetail?.status) {
      case 'Pending':
        return 'Confirm Pickup';
      case 'Confirmed':
        return 'Dispatched';
      case 'onTheWay':
        return 'Delivered';
      default:
        return 'COMPLETED';
    }
  }

  const [isVisible, setIsVisible] = React.useState(false);
  return (
      <>
        <AppHeader
            title={translate('orderStatus')}
            onPressChat={() => dispatch(onPressChat(orderdetail?.user_id))}
            loading={serverLoading}
            subtitle={'order no: ' + orderdetail?.order_nr}
        />
        <BaseView styles={styles.container} loading={loading}>
          <ScrollView
              style={{flex: 1}}
              contentContainerStyle={{marginTop: 10, paddingHorizontal: 10}}
              showsVerticalScrollIndicator={false}>
            <OrderTracking
                onPressTracking={() => setIsVisible(true)}
                orderdetail={orderdetail}
            />
            <View
                style={{
                  height: 2,
                  backgroundColor: COLORS.lightGray,
                  marginVertical: 10,
                }}
            />
            {orderdetail?.payment_status === 'paid' ? (
                <AppButton
                    onPress={() =>
                        Alert.alert(
                            translate('confirmOrderStatus'),
                            translate("Changeorderstatus")+` \n"${getDeliveryTitle()}"\n `+translate("confirmproceedorder"),
                            [
                              {
                                text: translate('cancel'),
                                onPress: () => {},
                                style: 'cancel',
                              },
                              {
                                text: translate('yes'),
                                onPress: () => dispatch(changeOrderStatus(id)),
                                style: 'default',
                              },
                            ],
                        )
                    }
                    title={getDeliveryTitle()}
                    disabled={orderdetail?.status === 'Delivered'}
                    loading={serverLoading}
                    otherStyles={{
                      marginTop: 20,
                      width: '90%',
                      alignSelf: 'center',
                      backgroundColor:
                          orderdetail?.status === 'Delivered'
                              ? COLORS.gray
                              : COLORS.primary,
                    }}
                />
            ) : orderdetail?.status === 'Decline' ? null : orderdetail?.status ===
            'Cancelled' ? null : (
                <AppButton
                    onPress={() => {
                      Alert.alert(
                          translate("ConfirmOrder"),
                          translate("ConfirmOrder")+`${orderdetail?.order_nr}.`+translate("thepayableamount")+` ${orderdetail?.amount}.`+translate("confirmtoproceed"),

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
