import {useNavigation} from '@react-navigation/native';
import {translate} from '../../multiLang/translation';
import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {AppButton, AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import server from '../../server/server';
export const OrderTrackingBottomCard = ({time}) => {
  const navigation = useNavigation();
  const {trigger} = useContext(AuthContext);
  const {mapOrderDetail} = useSelector(state => state.orders);
  const [loading, setLoading] = useState(false);
  function timeConvert(n) {
    if (n < 60) {
      return Math.round(n) + ' minutes';
    }
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + 'h ' + rminutes + 'm';
  }

  onPressChat = () => {
    setLoading(true);
    server
      .getChatId({
        friend_id: mapOrderDetail?.provider_id,
      })
      .then(resp => {
        setLoading(false);
        if (!resp.ok) return;
        trigger.setRoute('chat');
        navigation.jumpTo('chat', {
          screen: 'user_chat',
          params: resp.data,
        });
      });
  };

  return (
    <View
      style={{
        width: '90%',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        padding: 10,
        position: 'absolute',
        bottom: 30,
      }}>
      <Text
        style={{
          ...FONTS.h2,
          color: COLORS.black,
          fontWeight: '700',
          letterSpacing: 1,
        }}>
        Tracking Order
      </Text>
      {mapOrderDetail.invoice_nr && (
        <Text
          style={{
            ...FONTS.body4,
            color: COLORS.primary,
            letterSpacing: 1,
            fontWeight: '600',
          }}>
          Invoice No:{mapOrderDetail?.invoice_nr}
        </Text>
      )}
      {time ? (
        <View>
          <Text
            style={{
              flexDirection: 'row',
              textAlign: 'center',
              marginTop: 5,
              paddingVertical: 10,
            }}>
            <Text style={{...FONTS.body4, color: COLORS.primary}}>
              Arrived in
            </Text>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.primary,
                fontWeight: 'bold',
              }}>
              {'  '}
              {timeConvert(time)}
              {'   '}
            </Text>
          </Text>
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 5,
        }}>
        <TouchableOpacity
          onPress={onPressChat}
          disabled={loading}
          activeOpacity={0.7}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}>
            {!loading ? (
              <AppIcon icon={icons.chat} size={20} color={COLORS.white} />
            ) : (
              <ActivityIndicator
                size={'small'}
                animating={loading}
                color={COLORS.white}
              />
            )}
          </View>
          <Text style={{...FONTS.body4, color: COLORS.primary}}>
            {translate('message')}
          </Text>
        </TouchableOpacity>
      </View>
      <AppButton
        title={translate('orderDetails')}
        otherStyles={{backgroundColor: '#333333'}}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};
