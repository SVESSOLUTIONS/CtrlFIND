import React from 'react';
import {View, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

const Colours = {
  Pending: '#CC3333',
  Confirmed: '#218200',
  onTheWay: '#6fd5e3',
  Delivered: '#0d3a75',
  Decline: 'red',
  Cancelled: 'red',
};

export const OrderStatus = ({status, deliveryType,item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-end',
        backgroundColor: item.refund_status==="requested"?"red":Colours[status],
        borderRadius: 5,
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 10,
      }}>
      <View style={{flexDirection: 'column', paddingRight: 5}}>
        <Text
          style={{
            ...FONTS.body4,
            lineHeight: 12,
            color: COLORS.white,
            fontSize: 7,
          }}>
          {translate('orderType')}
        </Text>
        <Text
          style={{
            ...FONTS.body4,
            color: COLORS.white,
            fontWeight: 'bold',
            fontSize: 12,
          }}>
          {deliveryType==="standardDelivery"?translate("StandardDelivery"):deliveryType==="pickup"?translate("pickup"):deliveryType==="expressDelivery"?translate("expressDelivery"):null}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'column',
          borderLeftColor: COLORS.white,
          borderLeftWidth: 1,
          paddingLeft: 10,
        }}>
        <Text
          style={{
            ...FONTS.body4,
            lineHeight: 12,
            color: COLORS.white,
            fontSize: 8,
          }}>
          {translate('orderStatus')}
        </Text>
        <Text
          style={{
            ...FONTS.body4,
            color: COLORS.white,
            fontWeight: 'bold',
            fontSize: 10,
            textTransform: 'capitalize',
          }}>
          {item.refund_status==="requested"?translate("refundrequested"):status==="Decline"?translate("Declined"):status==="Cancel"?translate("Cancelled"):status === 'onTheWay' ? translate('onTheWay') : status==="Pending"?translate("pending"):status==="Confirmed"?translate("confirmed"):status==="Progress"?translate("progress"):status==="Delivered"?translate("Delivered"):status}
        </Text>
      </View>
    </View>
  );
};
