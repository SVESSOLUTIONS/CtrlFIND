import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Linking, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {AppButton} from '../base/AppButton';

export const BuyerTrackModal = ({onPress}) => {
  const navigation = useNavigation();
  const {serverLoading, orderdetail} = useSelector(state => state.orders);

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 10,
        overflow: 'hidden',
      }}>
      <View
        style={{
          height: 50,
          backgroundColor: COLORS.primary,
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.white,
            fontWeight: '500',
            flex: 1,
          }}>
          Track Driver's Location
        </Text>

        <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
          <AppIcon icon={icons.close} size={15} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={{padding: 10}}>
        {orderdetail?.tracking_url === null &&
        orderdetail?.is_tracking === 0 ? (
          <Text
            style={{
              ...FONTS.h3,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {translate('trackingDisabled')}
          </Text>
        ) : null}

        {orderdetail?.tracking_url ? (
          <TouchableOpacity
            style={{
              marginVertical: 10,
            }}
            onPress={() => Linking.openURL(orderdetail?.tracking_url)}>
            <Text
              style={{
                ...FONTS.body4,
                color: 'blue',
              }}>
              {orderdetail?.tracking_url}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text
            style={{
              ...FONTS.body4,
              color: 'blue',
            }}>
            ---
          </Text>
        )}
        {orderdetail?.is_tracking !== 0 ? (
          <AppButton
            onPress={() => {
              onPress();
              setTimeout(() => {
                navigation.navigate('buyer_tracking_order');
              }, 300);
            }}
            icon={icons.map}
            title={translate('map')}
            otherStyles={{
              width: 120,
              alignSelf: 'center',
            }}
          />
        ) : null}
      </View>
    </View>
  );
};
