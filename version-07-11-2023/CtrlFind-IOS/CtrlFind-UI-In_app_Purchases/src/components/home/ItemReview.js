import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Rating} from 'react-native-ratings';
import {AppIcon} from '..';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

export const ItemReview = ({reviews,isProfile}) => {
    // {console.log("reviews all"+JSON.stringify(reviews))}
  const RenderReview = ({item}) => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.lightGray,
            paddingBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 60,
              flex: 1,
            }}>
              {isProfile?
                  <Text
                      numberOfLines={1}
                      style={{
                          ...FONTS.h3,
                          color: COLORS.primary,
                      }}>
                      {item?.creater?.name}
                  </Text>
                  : <Text
                      numberOfLines={1}
                      style={{
                          ...FONTS.h3,
                          color: COLORS.primary,
                      }}>
                      {item?.user?.name}
                  </Text>
              }
              {console.log("itemratingreview"+JSON.stringify(item))}
            {/*  {!isProfile?*/}
            {/*<View*/}
            {/*  style={{*/}
            {/*    marginHorizontal: 5,*/}
            {/*    flexDirection: 'row',*/}
            {/*    alignItems: 'center',*/}
            {/*    borderWidth: 1,*/}
            {/*    borderColor: COLORS.gray,*/}
            {/*    borderRadius: 50,*/}
            {/*    paddingHorizontal: 10,*/}
            {/*  }}>*/}
            {/*  <Text style={styles.line2_right_title}>*/}
            {/*    {helpers.getRating(item?.user?.rating?.avg)}*/}
            {/*  </Text>*/}
            {/*  <AppIcon icon={icons.reviews} color={COLORS.primary} size={10} />*/}
            {/*  <Text style={styles.line2_right_subtitle}>*/}
            {/*    ({item?.user?.rating?.total})*/}
            {/*  </Text>*/}
            {/*</View>*/}
            {/*      :null}*/}
          </View>
          <Rating readonly={true} startingValue={item.rating} imageSize={15} />
        </View>
        {item?.comment ? (
          <Text
            style={{
              ...FONTS.body4,
              lineHeight: 16,
              fontSize: 13,
              color: COLORS.gray,
              marginTop: 10,
              paddingBottom: 5,
            }}>
            {item?.comment}
          </Text>
        ) : null}
      </>
    );
  };
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: COLORS.gray,
          paddingBottom: 10,
        }}>
        <Text
          style={{
            ...FONTS.h3,
            fontWeight: 'bold',
            color: COLORS.primary,
          }}>
          {translate('reviews1')}
        </Text>
      </View>
      {reviews?.map(review => (
          // console.log("re"+JSON.stringify(review))
        <RenderReview item={review} key={review.id} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  line2_right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line2_right_title: {
    ...FONTS.body4,
    fontWeight: '800',
    fontSize: 10,
    lineHeight: 15,
    marginRight: 2,
  },
  line2_right_subtitle: {
    ...FONTS.body4,
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 15,
    marginLeft: 2,
  },
});
