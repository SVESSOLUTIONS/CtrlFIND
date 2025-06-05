import React from 'react';
import {View, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

const Colours = {
  Recieved: '#949400',
  Confirmed: '#00b822',
  InProgress: '#165c23',
  ReadyForPickUp: '#ff9966',
  ReadyForDelivery: '#ff9966',
  onTheWay: '#6fd5e3',
  onTheWayPickUp: '#ffcc00',
  onTheWayDelivery: '#ffcc00',
  Delivered: '#0d3a75',
    Decline:"red",
    Cancelled:"red",

};

export const ServiceOrderStatus = ({item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-end',
        backgroundColor: item.refund_status==="requested"?"red":Colours[item?.service_status],
        alignItems: 'center',
        borderRadius: 5,
      }}>
      {item?.pickup ? (
              <View
                  style={{
                      flexDirection: 'column',
                      borderLeftColor: COLORS.white,
                      borderLeftWidth: 1,
                      paddingHorizontal: 5,
                      alignSelf:'center',
                      alignItems:'center'

                  }}>
                  <Text
                      style={{
                          ...FONTS.body4,
                          color: COLORS.white,
                          lineHeight: 14,
                          fontWeight: 'bold',
                          fontSize: 10,
                          textTransform: 'capitalize',

                      }}>
                      {translate("Pickup")}
                  </Text>
                  <Text
                      style={{
                          ...FONTS.body4,
                          color: COLORS.white,
                          fontSize: 8,
                      }}>
                      {translate("fromclient")}
                  </Text>
              </View>

      ) : null}
      {item?.delivery ? (
          <View
              style={{
                  flexDirection: 'column',
                  borderLeftColor: COLORS.white,
                  borderLeftWidth: 1,
                  paddingHorizontal: 5,
                  alignSelf:'center',
                  alignItems:'center'
              }}>
              <Text
                  style={{
                      ...FONTS.body4,
                      lineHeight: 14,
                      fontWeight: 'bold',
                      color: COLORS.white,
                      fontSize: 10,

                  }}>
                  {translate("Deliver")}
              </Text>
              <Text
                  style={{
                      ...FONTS.body4,
                      color: COLORS.white,
                      fontSize: 8,

                  }}>
                  {translate("toclient")}
              </Text>
          </View>
      ) : null}

      <View
        style={{
          flexDirection: 'column',
          borderLeftColor: COLORS.white,
          borderLeftWidth: 1,
          paddingHorizontal: 5,
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

          {item.refund_status==="requested"?translate("refundrequested"):item.service_status==="Decline"?translate("Declined"):translate(item?.service_status)}
        </Text>
      </View>

    </View>
  );
};
