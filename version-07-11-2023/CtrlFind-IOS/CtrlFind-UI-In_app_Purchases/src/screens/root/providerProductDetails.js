import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {
  AppButton,
  AppHeader,
  AppIcon,
  AppLightBox,
  AppNoDataFound,
  BaseView,
  ImagesView,
  ItemSummary,
  ItemWriteReview,
  LoginForm,
} from '../../components';
import helpers from '../../constants/helpers';
import {ItemReview} from '../../components/home/ItemReview';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {
  addItemreview,
  getProviderItemDetails,
} from '../../store/reducers/buyerDashboard';
import {onAddToCart, setSelectedItem} from '../../store/reducers/cart';
import {MotiView} from 'moti';
import AuthContext from '../../context/AuthContext';
import {goToCheckout} from '../../store/reducers/checkout';
import {translate} from '../../multiLang/translation';

export const ProviderProductDetailsScreen = ({navigation, route}) => {
  const {id} = route.params;
  const {selectedItem} = useSelector(state => state.cart);
  const [isVisible, setIsVisible] = React.useState(false);
  const {user} = useContext(AuthContext);

  const {initial_loading, loading, item_details, categoryProviders} =
    useSelector(state => state.buyerDashboard);
  const dispatch = useDispatch();

  // local state
  const [isSummaryExpended, setIsSummaryExpended] = React.useState(false);
  const [isReviewExpended, setIsReviewExpended] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [selectedColor, setSelectedColor] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState(null);

  // onMounted
  useEffect(() => {
    dispatch(getProviderItemDetails(id));
  }, []);

  useEffect(() => {
    setSelectedImage(item_details?.images[0]?.file_path);
    setSelectedColor(item_details?.colors[0]);
    setSelectedSize(item_details?.sizes[0]);
  }, [initial_loading]);

  return (
    <>
      {/* header  */}
      <AppHeader title={item_details?.title} showCart={true} />
      {console.log("item_details==>"+JSON.stringify(item_details))}
      <BaseView styles={styles.container} loading={initial_loading}>
        <ScrollView>
          {/* hero image  */}
          <AppLightBox uri={helpers.get_image(selectedImage)} />

          {/* product details  */}
          <View style={styles.wrapper}>
            {/* title  */}
            <Text style={styles.title} numberOfLines={4}>
              {item_details?.title}
            </Text>
            {/* price  */}
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
              <Text style={styles.line1_title}>
                {helpers.getDiscountPrice(item_details)} CAD
              </Text>
                </View>
                    :null}
              </View>
              <AppIcon
                icon={icons.favorites}
                size={18}
                color={COLORS.primary}
              />
            </View>

            <View>
              <View style={styles.line2}>
                {/* discount price   */}
                {/*<Text style={styles.line3_txt}>*/}
                {/*  {helpers.getDiscountPrice(item_details)}*/}
                {/*</Text>*/}
                {/* product rating  */}

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

              {/* product colors  */}
              {item_details?.colors.length ? (
                <View style={styles.line4}>
                  <Text numberOfLines={1} style={styles.line4_txt}>
                    {translate('color')}
                  </Text>
                  <View style={styles.line4_row}>
                    {item_details?.colors.map((color, i) => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setSelectedColor(color)}
                        key={i + color.value}>
                        <MotiView
                          animate={{
                            height: selectedColor?.id === color?.id ? 25 : 18,
                            width: selectedColor?.id === color?.id ? 25 : 18,
                          }}
                          transition={{
                            type: 'timing',
                          }}
                          style={[
                            styles.line4_color,
                            {
                              backgroundColor: color?.value,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}
              {/* product sizes  */}
              {item_details?.sizes.length ? (
                <View style={styles.line4}>
                  <Text numberOfLines={1} style={styles.line4_txt}>
                    {translate('size')}
                  </Text>

                  <View style={styles.line4_row}>
                    {item_details?.sizes.map((size, i) => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setSelectedSize(size)}
                        style={[
                          styles.line4_circle,
                          {
                            borderColor:
                              selectedSize?.id === size?.id
                                ? COLORS.primary
                                : COLORS.white,
                          },
                        ]}
                        key={i + size.value}>
                        <Text style={styles.line4_subtitle}>{size?.value}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* product images  */}
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

              {/* product Summary  */}
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
              <TouchableOpacity
                onPress={() => setIsReviewExpended(prev => !prev)}
                activeOpacity={0.9}
                style={styles.line6_more}>
                <Text style={styles.line6_title}>{translate('review')}</Text>
                <View style={styles.line6_icon}>
                  <AppIcon icon={icons.down} color={COLORS.white} size={10} />
                </View>
              </TouchableOpacity>

              {/* product reviews  */}
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
                          // console.log("item_details?.reviews"+JSON.stringify(item_details?.reviews))
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
                      <AppNoDataFound title={translate('noReviews')} />
                    </View>
                  )}
                </>
              )}
              {/*{console.log("item_detailsitem_details==>"+JSON.stringify(item_details))}*/}
              {/* add to cart button  */}
              <AppButton
                title={translate('addToCart')}
                onPress={() => {
                  dispatch(
                    onAddToCart({
                      provider_id: item_details?.UserId,
                      provider_name: categoryProviders.find(
                        p => p?.id === item_details?.UserId,
                      )?.name,
                      order_type: 'product',
                      category_id:item_details?.category_id,
                      schedule_id: null,
                      appointment_date: null,
                      appointment_time: null,
                      product_id: item_details?.id,
                      taxable: item_details?.taxable,
                      product_name: item_details?.title,
                      product_color: selectedColor,
                      product_size: selectedSize,
                      product_price: helpers.getItemPrice(item_details),
                      product_img: selectedImage,
                    }),
                  );
                }}
              />
              <AppButton
                title={translate('buyNow')}
                otherStyles={{
                  backgroundColor: COLORS.black,
                }}
                onPress={() => {
                  if (item_details?.UserId === user?.id) {
                    return Alert.alert(
                      translate('invalidAccount'),
                      translate('invalidAccountText'),
                      [
                        {
                          text: translate('cancel'),
                          onPress: () => {},
                          style: 'cancel',
                        },
                        {
                          text: translate('ok'),
                          onPress: () => {},
                          style: 'destructive',
                        },
                      ],
                    );
                  }
                  if (helpers.getRole(user?.role_id) === helpers.BUYER) {
                    dispatch(
                      onAddToCart({
                        provider_id: item_details?.UserId,
                        provider_name: categoryProviders.find(
                          p => p?.id === item_details?.UserId,
                        )?.name,
                        order_type: 'product',
                        category_id:item_details?.category_id,
                        schedule_id: null,
                        appointment_date: null,
                        appointment_time: null,
                        product_id: item_details?.id,
                        product_name: item_details?.title,
                        taxable: item_details?.taxable,
                        product_color: selectedColor,
                        product_size: selectedSize,
                        product_price: helpers.getItemPrice(item_details),
                        product_img: selectedImage,
                      }),
                    );
                    if (selectedItem?.provider_id === item_details?.UserId) {
                      // dispatch(goToCheckout(user));
                      navigation.navigate('order_review');
                    } else {
                      dispatch(
                        setSelectedItem({
                          provider_id: item_details?.UserId,
                          provider_name: categoryProviders.find(
                            p => p?.id === item_details?.UserId,
                          )?.name,
                          order_type: 'product',
                          items: [
                            {
                              id: item_details?.id,
                              name: item_details?.title,
                              order_type: 'product',
                              schedule_id: null,
                              appointment_date: null,
                              appointment_time: null,
                              color: selectedSize?.label,
                              size: selectedSize?.label,
                              price: helpers.getItemPrice(item_details),
                              img: selectedImage,
                              qty: 1,
                            },
                          ],
                        }),
                      );
                      // dispatch(goToCheckout(user));
                      navigation.navigate('order_review');
                    }
                  } else {
                    setIsVisible(true);
                  }
                }}
              />
            </View>
          </View>
          <View style={{height: 20}} />
        </ScrollView>
      </BaseView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <LoginForm onClose={() => setIsVisible(false)} />
      </Modal>
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
  line4: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  line4_row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  line4_txt: {
    ...FONTS.h3,
    fontWeight: '600',
    width: 80,
  },
  line4_color: {
    borderRadius: 13,
    marginHorizontal: 2,
    marginRight: 5,
  },
  line4_circle: {
    height: 25,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line4_subtitle: {
    ...FONTS.body4,
    fontWeight: '300',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  imageComponent: {
    flexDirection: 'row',
  },
});
