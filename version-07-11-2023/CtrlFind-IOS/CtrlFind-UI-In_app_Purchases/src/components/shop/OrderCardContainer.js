import React, {useContext} from 'react';
import {View, TouchableOpacity, Text, FlatList} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
import {OrderCard} from './OrderCard';
import {OrderStatus} from './OrderStatus';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setOrderDetails} from '../../store/reducers/orders';
import AuthContext from '../../context/AuthContext';
import helpers from '../../constants/helpers';
import {translate} from '../../multiLang/translation';
import moment from 'moment';

export const OrderCardContainer = ({item}) => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setOrderDetails(null));
        navigation.navigate(
          helpers.getRole(user?.role_id) === helpers.SERVICE_PROVIDER
            ? 'delivery_status_details'
            : 'buyer_delivery_status_details',
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
          {/*{console.log(JSON.stringify(item))}*/}
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
          <OrderStatus
            status={item?.status}
            deliveryType={item?.delivery_type}
            item={item}
          />
        </View>
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

      {item?.items?.map(i => (
        <OrderCard key={i.id} data={i} provider={item?.provider}  />
      ))}


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
            {item.refund_status==="requested"?translate("refundrequested"):item?.status==="Decline"?"Declined":item?.status === 'onTheWay' ? translate('onTheWay') : item?.status}
          </Text>

          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.black,
              fontWeight: '700',
            }}>
            {translate('total')}:{
              (item?.amount)<=0? 0:
                  (item?.amount)===0?
                      (item?.amount).toFixed(3):
                      (item?.amount).toFixed(3)


          } CAD
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
