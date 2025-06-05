import React, {useContext} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setOrderDetails} from '../../store/reducers/orders';
import AuthContext from '../../context/AuthContext';
import helpers from '../../constants/helpers';
import {translate} from '../../multiLang/translation';
import {ServiceOrderCard} from './ServiceOrderCard';
import {ServiceOrderStatus} from './ServiceOrderStatus';
import moment from 'moment';

export const ServiceCardContainer = ({item}) => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setOrderDetails(null));
        navigation.navigate(
          helpers.getRole(user?.role_id) === helpers.SERVICE_PROVIDER
            ? 'provider_service_delivery_status_details'
            : 'buyer_service_delivery_status_details',
          {id: item?.id},
        );
      }}
      activeOpacity={0.7}
      style={{
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: COLORS.gray,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: COLORS.white,
      }}>
      <View>
        <Text style={{...FONTS.h3, fontSize: 17, fontWeight: '600'}}>
          {helpers.getRole(user?.role_id) === helpers.BUYER
            ? item?.provider_name
            : item?.buyer_name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 5,
          }}>
          <View>
            <Text style={{...FONTS.body4, fontSize: 14, lineHeight: 18}}>
              {moment(item?.created_at).format('DD-MM-YYYY')}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.primary,
                fontSize: 14,
                lineHeight: 18,
              }}>
              {item?.order_nr}
            </Text>
          </View>

          <ServiceOrderStatus item={item} />

        </View>
          {item?.discount?
          <Text
              style={{
                  ...FONTS.body4,
                  color: "red",
                  fontWeight: 'bold',
                  fontSize: 11,
                  alignSelf:'flex-end',
                  marginBottom:-10

              }}>Discount : {item?.discount}
          </Text>
              :null}
      </View>
      <ServiceOrderCard data={item} />

        {/*{console.log("itemitemitemitem=====",item)}*/}
      <View style={{marginTop: 10}}>
        {/* <Text
          style={{
            ...FONTS.body4,
            color: COLORS.gray,
            textAlign: 'center',
          }}>
          View 3 more products
        </Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text
            style={{
              ...FONTS.h4,
              color: COLORS.primary,
              fontWeight: '500',
            }}>
            {item.refund_status==="requested"?translate("refundrequested"):item?.service_status==="Decline"?"Declined":translate(item?.service_status)}
          </Text>
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.black,
              fontWeight: '700',
            }}>
            {translate('total')}:
              {(item?.amount)<=0? 0 :
                  item?.extra_service_fee_status === 'paid' ?
                      ((item?.amount) + item?.extra_service_fee).toFixed(3)
                      :
                      (item?.amount).toFixed(3)

              }

            CAD
          </Text>
        </View>
        {item?.note ? (
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.black,
            }}>
            {item?.note}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
