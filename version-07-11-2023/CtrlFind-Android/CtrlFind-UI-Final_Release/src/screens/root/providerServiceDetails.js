import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppButton,
  AppHeader,
  AppIcon,
  AppLightBox,
  AppNoDataFound,
  BaseView,
  ImagesView,
  ItemWriteReview,
  ItemSummary,
} from '../../components';
import {ItemReview} from '../../components/home/ItemReview';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {onResetAppointment} from '../../store/reducers/appointments';
import {
  addItemreview,
  getProviderItemDetails,
} from '../../store/reducers/buyerDashboard';
import {translate} from '../../multiLang/translation';

export const ProviderServiceDetailsScreen = ({navigation, route}) => {
  const {user} = useContext(AuthContext);
  const {id} = route.params;
  const {employee_id} = route.params;
  const dispatch = useDispatch();
  const {initial_loading, loading, item_details} = useSelector(
    state => state.buyerDashboard,
  );
  const {categories} = useSelector(state => state.categories);

  // local state
  const [isSummaryExpended, setIsSummaryExpended] = React.useState(false);
  const [isReviewExpended, setIsReviewExpended] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);

  // onMounted
  useEffect(() => {
    dispatch(getProviderItemDetails(id));
  }, []);

  useEffect(() => {
    setSelectedImage(item_details?.images[0]?.file_path);
  }, [initial_loading]);

  return (
    <>
      {/* header  */}
      <AppHeader title={item_details?.title} />
      <BaseView styles={styles.container} loading={initial_loading}>
        <ScrollView>
          {console.log("item_details",item_details)}
          {/* hero image  */}
          <AppLightBox uri={helpers.get_image(selectedImage)} />
          <View style={styles.wrapper}>
            {/* service title   */}
            <Text style={styles.title}>{item_details?.title}</Text>
            {/* service price  */}
            <View style={styles.line1}>
              <View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text  style={{ ...FONTS.h5,
                    fontWeight: '600',
                    width: 130,}}>
                    {translate('priceLabel')}
                  </Text>
                  <Text style={styles.line1_title}>
                    {`${parseFloat(item_details?.price).toFixed(1)} CAD`}
                  </Text>
                </View>
                {helpers.getDiscountPrice(item_details)?
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <Text  style={{ ...FONTS.h5,
                        fontWeight: '600',
                        width: 130,}}>
                        {translate('DiscountedPrice')}
                      </Text>
                      <Text style={styles.line3_txt}>
                        {helpers.getDiscountPrice(item_details)} CAD
                      </Text>
                    </View>
                :null
                    }
                {item_details?.discount_end_date &&
                helpers.getDiscountPrice(item_details) !== null ?
                      <Text style={styles.line2_title}>
                        {translate('expiry')}: {item_details.discount_end_date}
                      </Text>
                    :null}
              </View>

              {/*<Text style={styles.line1_title}>*/}
              {/*  {`$${parseFloat(item_details?.price).toFixed(1)}`}*/}
              {/*</Text>*/}
              <AppIcon
                icon={icons.favorites}
                size={18}
                color={COLORS.primary}
              />
            </View>
            <View>
              <View style={styles.line2}>
                {/* discount expire date  */}


                {/* service rating  */}
                <View style={styles.line2_right}>
                  <Text style={styles.line2_right_title}>
                    {helpers.getRating(item_details?.rating?.avg)}
                  </Text>
                  <AppIcon
                    icon={icons.reviews}
                    color={COLORS.primary}
                    size={12}
                  />
                  <Text style={styles.line2_right_subtitle}>
                    ({item_details?.rating?.total})
                  </Text>
                </View>
              </View>

              {/*<Text style={styles.line3_txt}>*/}
              {/*  {helpers.getDiscountPrice(item_details)}*/}
              {/*</Text>*/}
              {/* appointment required or not  */}
              {item_details?.require_appointment === 'Y' ? (
                <View style={styles.line4}>
                  <AppIcon icon={icons.date} color={COLORS.primary} size={10} />
                  <Text style={styles.line4_subtitle}>
                    {translate('appointmentRequired')}
                  </Text>
                </View>
              ) : null}

              <View style={styles.line5}>
                {/* service price type  */}
                {item_details?.price_type && (
                  <View style={styles.line5_row}>
                    <Text style={styles.line5_title}>
                      {translate('priceType')}:
                    </Text>
                    <Text style={styles.line5_subtitle}>
                      {item_details?.price_type === 'hourly'
                        ? 'slot'
                        : item_details?.price_type}
                    </Text>
                  </View>
                )}

                {/* service location  */}
                <View style={styles.line5_row}>
                  <Text style={styles.line5_title}>
                    {translate('location')}
                  </Text>
                  <Text style={styles.line5_subtitle}>
                    {item_details?.location}
                  </Text>
                </View>
              </View>
              {/* service images  */}
              <View>
                <Text style={{...FONTS.h3, fontWeight: '600', marginBottom: 5}}>
                  Images
                </Text>
                <View style={styles.imageComponent}>
                  {item_details?.images.map((img, i) => {
                    const url = helpers.get_image(img['file_path']);
                    return (
                      <ImagesView
                        key={img?.file_path + i}
                        active={url === selectedImage}
                        uri={url}
                        onPress={() => setSelectedImage(url)}
                      />
                    );
                  })}
                </View>
              </View>

              {/* service summary  */}
              <TouchableOpacity
                onPress={() => setIsSummaryExpended(prev => !prev)}
                activeOpacity={0.9}
                style={styles.line6_more}>
                <Text style={styles.line6_title}>{translate('summary')}</Text>
                <View style={styles.line6_icon}>
                  <AppIcon icon={icons.down} color={COLORS.white} size={10} />
                </View>
              </TouchableOpacity>
              {isSummaryExpended && (
                <ItemSummary summary={item_details?.summary} />
              )}
              {/* service review  */}
              <TouchableOpacity
                onPress={() => setIsReviewExpended(prev => !prev)}
                activeOpacity={0.9}
                style={styles.line6_more}>
                <Text style={styles.line6_title}>{translate('review')}</Text>
                <View style={styles.line6_icon}>
                  <AppIcon icon={icons.down} color={COLORS.white} size={10} />
                </View>
              </TouchableOpacity>
              {isReviewExpended && (
                <>
                  {/* Item write review  */}
                  <ItemWriteReview
                    reviews={item_details?.reviews ? item_details?.reviews : []}
                    onReview={values =>
                      dispatch(
                        addItemreview({
                          ...values,
                          item_id: item_details?.id,
                        }),
                      )
                    }
                    loading={loading}
                  />
                  {item_details?.reviews.length ? (
                    <ItemReview
                      reviews={
                        item_details?.reviews ? item_details?.reviews : []
                      }
                    />
                  ) : (
                    <View
                      style={{
                        paddingBottom: 10,
                        borderBottomWidth: 1,
                        borderColor: COLORS.gray,
                      }}>
                      <AppNoDataFound title="No Reviews..." />
                    </View>
                  )}
                </>
              )}
              {console.log("item_detailsitem_details==>",item_details)}
              <AppButton
                title={translate('bookAppointment')}
                onPress={() => {
                  dispatch(onResetAppointment(user));
                  navigation.navigate('book_appointment', {
                    item: {
                      category: categories?.find(
                        c => c.id === item_details?.category_id,
                      )?.name,
                      service: item_details,
                    }
                  });
                }}
              />
            </View>
          </View>
          <View style={{height: 20}} />
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingTop: 0,
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  title: {
    ...FONTS.h2,
    fontWeight: '600',
    marginVertical: 10,
  },
  line1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  line1_title: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '600',
  },
  line2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line2_title: {
    ...FONTS.body4,
    fontWeight: '600',
  },
  line2_right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line2_right_title: {
    ...FONTS.body4,
    fontWeight: '800',
    fontSize: 12,
    marginRight: 5,
  },
  line2_right_subtitle: {
    ...FONTS.body4,
    fontWeight: '300',
    fontSize: 10,
    marginLeft: 5,
  },
  line3_txt: {
    ...FONTS.h3,
    fontWeight: '800',
    color: COLORS.error,
  },
  line4: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line4_subtitle: {
    ...FONTS.body4,
    fontWeight: '200',
    fontSize: 12,
    marginLeft: 3,
  },
  line5: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  line5_row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line5_title: {
    ...FONTS.body4,
    fontWeight: '600',
    marginRight: 5,
  },
  line5_subtitle: {
    ...FONTS.body4,
    fontWeight: '300',
    fontSize: 13,
    marginRight: 5,
  },
  line6_more: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  line6_title: {
    ...FONTS.h3,
    fontWeight: '800',
    color: COLORS.primary,
  },
  line6_icon: {
    backgroundColor: COLORS.primary,
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
