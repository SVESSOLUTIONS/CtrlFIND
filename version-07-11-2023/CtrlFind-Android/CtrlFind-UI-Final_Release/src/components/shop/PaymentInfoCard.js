import React, {useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {AppIcon} from '../base/AppIcon';
import moment from 'moment/moment';

export const PaymentInfoCard = ({item}) => {
  useEffect(() => {
    // console.log(JSON.stringify(item))
  });
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        marginBottom: 10,
      }}>
      <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
        <View
          style={{
            height: 60,
            width: 60,
            backgroundColor: '#E6E6E6',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {item?.user?.avatar ? (
            <Image
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
              }}
              source={{uri: helpers.get_image(item.user.avatar)}}
            />
          ) : (
            <AppIcon icon={icons.dollar} />
          )}
        </View>
        <View style={{marginLeft: 10}}>
          <Text style={{...FONTS.h4, color: COLORS.black}}>
            {item?.user?.name ? item?.user?.name : 'Buyer'}
          </Text>

          <Text style={{...FONTS.h4, color: COLORS.gray}}>
            {item?.item?.name ? item?.item?.name : 'unknown'}
          </Text>

          {item?.item?.order_nr ? (
            <Text style={{...FONTS.body4, color: COLORS.gray}}>
              Order{item.item.order_nr}
            </Text>
          ) : (
            <Text style={{...FONTS.body4, fontSize: 12, color: COLORS.gray}}>
              {item?.service_type}
            </Text>
          )}
          <Text style={{...FONTS.h4, color: COLORS.gray}}>
            {moment(item?.created_at).format('DD/MM hh:mm')}
          </Text>
        </View>
      </View>
        <View>
      <Text style={{...FONTS.h3, color: COLORS.primary}}>{`${
        item?.type === 'received' ? '+' : '-'
      }${item?.amount ? item?.amount : item?.item?.amount} CAD`}</Text>

            {item?.item?.extra_service_fee?
        <Text style={{...FONTS.h4, color:"red"}}>+ {item?.item?.extra_service_fee} CAD</Text>:
                null}
        </View>
    </View>
  );
};
