import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import {Rating} from 'react-native-ratings';
import {useImmer} from 'use-immer';
import helpers from '../../constants/helpers';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {translate} from '../../multiLang/translation';
import {AppButton} from '../base/AppButton';
import {AppInput} from '../base/AppInput';

export const ItemWriteReview = ({
  onReview,
  reviews,
  loading,
  placeholder = translate("addyourthoughts"),
}) => {
  const {user} = useContext(AuthContext);

  if (reviews.length) {
    if (helpers.getRole(user?.role_id) === helpers.GUEST) return null;
    if (reviews.some(review => review.creator_id === user.id)) return null;
  }

  const [state, setState] = useImmer({
    rating: 3,
    comment: '',
  });
  return (
    <View
      style={{
        marginBottom: 10,
      }}>
      <AppInput
        placeholder={placeholder}
        onChangeText={val =>
          setState(draft => {
            draft.comment = val;
          })
        }
        inputStyles={{
          textAlignVertical: 'top',
          justifyContent: 'flex-start',
          height: 100,
          paddingTop: 10,
        }}
        otherStyles={{
          height: 100,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
        <View style={{flex: 1}}>
          <AppButton
            title={translate("writeReview")}
            loading={loading}
            onPress={() => onReview(state)}
            otherStyles={{
              width: 110,
              borderRadius: 5,
              height: 43,

            }}
            textStyles={{
              ...FONTS.body4,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...FONTS.body4,
              marginHorizontal: 10,
            }}>
            {translate('rating')}
          </Text>
          <Rating
            readonly={loading}
            // type="custom"
            // ratingColor={COLORS.primary}
            // ratingBackgroundColor={COLORS.white}
            // ratingTextColor={COLORS.primary}
            startingValue={state.rating}
            minValue={1}
            onFinishRating={v =>
              setState(draft => {
                draft.rating = v;
              })
            }
            imageSize={25}
            style={{borderColor: COLORS.primary}}
          />
        </View>
      </View>
    </View>
  );
};
