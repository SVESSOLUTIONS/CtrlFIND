import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {addUserReview, setIsVisible} from '../../store/reducers/orders';
import {ItemWriteReview} from '../home/ItemWriteReview';

export const WriteUserReview = () => {
  const dispatch = useDispatch();
  const {serverLoading, orderdetail} = useSelector(state => state.orders);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            {translate('providerReview')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => dispatch(setIsVisible(false))}>
            <AppIcon icon={icons.close} size={15} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 10,
          }}>
          <ItemWriteReview
            reviews={[]}
            placeholder={translate("providerReviewText")}
            onReview={values =>
              dispatch(
                addUserReview({
                  ...values,
                  user_id: orderdetail?.provider_id,
                  order_id: orderdetail?.id,
                }),
              )
            }
            loading={serverLoading}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
