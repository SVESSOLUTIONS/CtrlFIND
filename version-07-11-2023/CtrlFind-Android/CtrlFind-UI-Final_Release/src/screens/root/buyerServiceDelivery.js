import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, Linking, Alert} from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppHeader,
  BaseView,
  ServiceOrderDeliveryTracking,
  ServiceOrderHomeTracking,
  ServiceOrderPickupDeliveryTracking,
  ServiceOrderPickupTracking,
  ServiceOrderTracking,
  WriteUserReview,
} from '../../components';
import {COLORS} from '../../constants/theme';
import {
  onCancelOrder,
  onPressChat,
  orderDetails,
  orderDetailsWithProvider,
  setIsVisible,
} from '../../store/reducers/orders';
import {translate} from '../../multiLang/translation';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {useFocusEffect} from "@react-navigation/native";

export const BuyerServiceDeliveryScreen = ({navigation, route}) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const {loading, serverLoading, orderdetail, isVisible} = useSelector(
    state => state.orders,
  );


  useEffect(() => {

    dispatch(orderDetails(id));
  }, []);

  function checkOrderStatus() {
    if (!orderdetail?.tracking_url && orderdetail?.is_tracking === 0) {
      return true;
    }
    if (!orderdetail?.lat && !orderdetail?.lng) {
      return true;
    }
    return false;
  }

  const onPressTracking = async () => {
    if (orderdetail?.is_tracking) {
      const resp = await dispatch(orderDetailsWithProvider(orderdetail.id));
      if (resp.payload) {
        return setTimeout(() => {
          navigation.navigate('buyer_tracking_order');
        }, 200);
      }
    }
    if (orderdetail?.tracking_url) {
      Linking.openURL(orderdetail?.tracking_url);
    }
  };

  return (
    <>
      <AppHeader
        title={translate('orderStatus')}
        subtitle={'order no: ' + orderdetail?.order_nr}
        onPressRight={() =>
          helpers.checkOrderExtraFees(orderdetail) === 'pending'
            ? navigation.navigate('pay_extra_service_fee', {
                order: orderdetail,
              })
            : null
        }
        onPressChat={() => dispatch(onPressChat(orderdetail?.provider_id))}
        loading={serverLoading}
        rightIcon={
          helpers.checkOrderExtraFees(orderdetail) === 'pending'
            ? icons.dollar
            : null
        }
        iconTitle={
          helpers.checkOrderExtraFees(orderdetail) === 'pending'
            ? `PAY ${orderdetail?.extra_service_fee} CAD   `
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
                  onPressTracking={onPressTracking}
                  orderdetail={orderdetail}
                  orderStatus={checkOrderStatus()}
                />
              ) : !orderdetail?.pickup && !orderdetail?.delivery ? (
                <ServiceOrderTracking
                  onPressTracking={onPressTracking}
                  orderdetail={orderdetail}
                  orderStatus={checkOrderStatus()}
                />
              ) : orderdetail?.pickup ? (
                <ServiceOrderPickupTracking
                  onPressTracking={onPressTracking}
                  orderdetail={orderdetail}
                  orderStatus={checkOrderStatus()}
                />
              ) : (
                <ServiceOrderDeliveryTracking
                  onPressTracking={onPressTracking}
                  orderdetail={orderdetail}
                  orderStatus={checkOrderStatus()}
                />
              )}
            </>
          ) : (
            <ServiceOrderHomeTracking
              onPressTracking={onPressTracking}
              orderdetail={orderdetail}
              orderStatus={checkOrderStatus()}
            />
          )}

          <View
            style={{
              height: 2,
              backgroundColor: COLORS.lightGray,
              marginVertical: 10,
            }}
          />
          {orderdetail?.service_status === 'Delivered' ? (
            <AppButton
              disabled={orderdetail?.review}
              loading={orderdetail?.review}
              title={translate('writeReview')}
              onPress={() => dispatch(setIsVisible(true))}
            />
          ) : null}
          {orderdetail?.service_status === 'Delivered' ? (
            <AppButton
              disabled={orderdetail?.refund_status}
              title={orderdetail?.refund_status ?translate('refundrequested'):translate("refund")}
              otherStyles={{
                backgroundColor: orderdetail?.refund_status
                  ? COLORS.gray
                  : COLORS.primary,
              }}
              onPress={() =>
                navigation.navigate('refund', {details: orderdetail})
              }
            />
          ) : null}
          {orderdetail?.service_status === 'Recieved' &&
          orderdetail?.payment_status ===
            helpers.ORDER_PAYMENT_STATUS.PENDING ? (
            <AppButton
              title={translate("cancelOrder")}
              onPress={() =>
                Alert.alert(
                    translate("Areyousure"),
                    translate("cancelorder")+` ${orderdetail?.order_nr}.`,

                  [
                    {
                      text: translate("NO"),
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: translate("CONFIRM"),
                      onPress: () => dispatch(onCancelOrder(orderdetail?.id)),
                      style: 'default',
                    },
                  ],
                )
              }
            />
          ) : null}
          <View style={{height: 30}} />
        </ScrollView>
        <Modal
          isVisible={isVisible}
          hideModalContentWhileAnimating
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}
          animationOutTiming={300}
          useNativeDriver>
          <WriteUserReview />
        </Modal>
      </BaseView>
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
