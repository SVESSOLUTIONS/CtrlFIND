import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  AppForm,
  AppFormGooglePlacesInput,
  AppFormInput,
  AppHeader,
  BaseView,
  CartItem,
  PaymentMethodPicker,
  SubmitButton,
  SubmitPaymentButton,
} from '../../components';
import moment from 'moment';
import RadioButtonRN from 'radio-buttons-react-native';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {COLORS, FONTS} from '../../constants/theme';
import icons from '../../constants/icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {decreament, increament} from '../../store/reducers/cart';
import helpers from '../../constants/helpers';
import {
  onPressPayment,
  setAddress,
  setDeliveryAddress,
  setDeliveryType,
  setPaymentType,
} from '../../store/reducers/checkout';
import AuthContext from '../../context/AuthContext';
import {cartFormValidationSchema} from '../../validations';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import localStorage from '../../server/localStorage';
import {translate} from '../../multiLang/translation';
import axios from 'axios';
import {baseURL} from '../../server/baseUrl';
export const CheckOutScreen = () => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();

  const {checkoutData, loading} = useSelector(state => state.checkout);
  const {cartItems, selectedItem, selectedProvider} = useSelector(
    state => state.cart,
  );
  const {categoryProviders} = useSelector(state => state.buyerDashboard);

  const [coupon, setCoupon] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscount] = useState(undefined);
  const [type, setType] = useState('');
  const [user1, setUser1] = useState({});
  const [deliveryTypeIndex] = useState(3);
  const [isProduct, setIsProduct] = useState(false);
  const [hasTaxableProduct, setHasTaxableProduct] = useState(false);
  const [haveSomeTax, setHaveSomeTax] = useState(false);
  const [haveSomeTaxArray, setHaveSomeTaxArray] = useState([]);

  // user1?.buyer_province?.pst_tax_percentage
  // user1?.buyer_province?.gst_tax_percentage
  const pstTax = user1?.buyer_province?.pst_tax_percentage ?? 0;
  const gstTax = user1?.buyer_province?.gst_tax_percentage ?? 0;

  const get_Profile = async () => {
    let token = await localStorage.getToken();
    axios
      .get(baseURL + '/profile/' + user?.id, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(function (response) {
        // console.log("user data new"+JSON.stringify(response?.data?.user))
        setUser1(response.data?.user);
      })
      .catch(function (error) {
        alert(error.message);
      });
  };

  useEffect(() => {
    get_Profile();
    cartItems
      .filter(c => c?.provider_id === selectedItem?.provider_id)
      .map(cartItem =>
        setIsProduct(cartItem?.items.some(i => i?.order_type === 'product')),
      );

    //      let dummyArray=cartItems[0].items
    //     dummyArray.forEach((item) => {
    //       if (item.taxable==="Y") {
    //         setHasTaxableProduct(true) ;
    //       }
    //     });
    //
    // //For getting taxes from some products who have able to pay tax.
    //
    //     let havingTaxArray=cartItems[0].items
    //     havingTaxArray.forEach((item) => {
    //       if (item.taxable==="N") {
    //         setHaveSomeTax(true) ;
    //       }
    //     });
    //
    //
    //     const filteredCartItems = havingTaxArray.filter(item => item?.taxable !== "N");
    //     setHaveSomeTaxArray(filteredCartItems)
    //
  }, [cartItems]);

  useEffect(() => {
    let dummyArray = cartItems[0].items;
    dummyArray.forEach(item => {
      if (item.taxable === 'Y') {
        setHasTaxableProduct(true);
      }
    });
  }, []);

  useEffect(() => {
    const cartItem = cartItems[0];

    const hasTaxableItems = cartItem?.items?.some(item => item.taxable === 'Y');
    setHaveSomeTax(hasTaxableItems);
  }, [cartItems]);

  const [location, setLocation] = useState({
    address: '',
    lat: '',
    lng: '',
  });

  const provider = categoryProviders.find(
    cp => cp.id === selectedItem?.provider_id,
  );

  const refRBSheet = React.useRef();
  const refRadio = React.useRef();
  const [activeWorkAddress, setActiveAddress] = React.useState(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [error, setError] = React.useState('');
  const [Province, setProvince] = React.useState('');
  const AddressessValidationSchema = Yup.object().shape({
    address: Yup.string().required().label('Address'),
  });

  const PICK_UP_FROM_STORE = translate('pickup');
  const EXPRESS_DELIVERY = translate('expressDelivery');
  const STANDARD_DELIVERY = translate('standardDelivery');

  const data = [
    {
      label: PICK_UP_FROM_STORE,
    },
    {
      label: EXPRESS_DELIVERY,
    },
    {
      label: STANDARD_DELIVERY,
    },
  ];

  const handleRefundRequest = async () => {
    const date = moment().format('YYYY-MM-DD');
    setIsLoading(true);
    setError('');
    if (coupon === '' || coupon === ' ') {
      Alert.alert(translate('alert'), translate('couponError'));
      setIsLoading(false);
    } else {
      const url = 'https://cntrlfind.com/api/check-coupon?coupon=' + coupon;
      let token = await localStorage.getToken();

      requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
      };

      try {
        const response = await fetch(url, requestOptions).catch(error => {
          Alert.alert(translate('alert'), error.message);
          setIsLoading(false);
        });
        const responseJson = await response.json();

        if (responseJson?.coupon) {

          if (responseJson.coupon === null) {
            setError(translate('invalidCoupon'));
            setIsLoading(false);
          } else if (responseJson?.coupon?.end_date < date) {
            setError(translate('invalidCoupon'));
            setIsLoading(false);
          } else {
            setType(responseJson?.coupon?.coupon_type);
            setDiscount(responseJson?.coupon?.discount);
            setIsLoading(false);
            setCoupon('');
          }
        }
        else {
          setError(translate('invalidCoupon'));
          setIsLoading(false);
          setCoupon('');
        }
      } catch (error) {
        console.error(error.message);
        Alert.alert(translate('alert') + error.message);
        setIsLoading(false);
      }
    }
  };
  const {services} = useSelector(state => state.orders);

  return (
    <>
      <AppHeader title={translate('checkoutTitle')} />
      <BaseView styles={styles.container} overlayLoading={loading}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {cartItems
            .filter(c => c?.provider_id === selectedItem?.provider_id)
            .map(cartItem => {
              return (
                <View style={styles.cartContainer} key={cartItem.provider_id}>
                  <Text style={{...FONTS.h2, fontWeight: '800'}}>
                    {cartItem?.provider_name}
                  </Text>
                  {cartItem?.items.some(i => i?.order_type === 'product') ? (
                    <Text
                      style={[
                        styles.itemsTitle,
                        {
                          backgroundColor: COLORS.primary,
                        },
                      ]}>
                      {translate('products')}
                    </Text>
                  ) : null}
                  {cartItem?.items
                    .filter(i => i?.order_type === 'product')
                    .map((item, i) => (
                      <CartItem
                        item={item}
                        key={item.id + i}
                        onIncreament={() =>
                          dispatch(
                            increament({
                              provider_id: cartItem?.provider_id,
                              product: item,
                            }),
                          )
                        }
                        onDecreament={() =>
                          dispatch(
                            decreament({
                              provider_id: cartItem?.provider_id,
                              product: item,
                            }),
                          )
                        }
                      />
                    ))}
                  {cartItem?.items.some(i => i?.order_type === 'service') ? (
                    <Text
                      style={[
                        styles.itemsTitle,
                        {
                          backgroundColor: COLORS.black,
                        },
                      ]}>
                      {translate('services')}
                    </Text>
                  ) : null}
                  {cartItem?.items
                    .filter(i => i?.order_type === 'service')
                    .map((item, i) => (
                      <CartItem
                        item={item}
                        key={item.id + i}
                        type="service"
                        onIncreament={() =>
                          dispatch(
                            increament({
                              provider_id: cartItem?.provider_id,
                              product: item,
                            }),
                          )
                        }
                        onDecreament={() =>
                          dispatch(
                            decreament({
                              provider_id: cartItem?.provider_id,
                              product: item,
                            }),
                          )
                        }
                      />
                    ))}

                  <View style={{paddingVertical: 10}}>
                    <View style={styles.paymentContainer}>
                      <Text
                        style={{
                          ...FONTS.body4,
                          fontWeight: '300',
                          marginRight: 'auto',
                          marginLeft: 5,
                        }}>
                        {translate('ItemsTotal')}:
                      </Text>
                      <Text
                        style={[
                          styles.payment,
                          {...FONTS.body2, ...FONTS.h3, color: COLORS.primary},
                        ]}>
                        {helpers.getTotalAmount(cartItem?.items)} CAD
                      </Text>
                    </View>
                    {discount !== undefined ? (
                      <View style={styles.paymentContainer}>
                        <Text
                          style={{
                            ...FONTS.body4,
                            fontWeight: '300',
                            marginRight: 'auto',
                            marginLeft: 5,
                          }}>
                          {translate('Coupon')}:
                        </Text>
                        <Text
                          style={[
                            styles.payment,
                            {
                              ...FONTS.body2,
                              ...FONTS.h3,
                              color: COLORS.primary,
                            },
                          ]}>
                          -
                          {type === 'flat'
                            ? `${discount} CAD`
                            : `${discount} %`}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.paymentContainer}>
                        <Text
                          style={{
                            ...FONTS.body4,
                            fontWeight: '300',
                            marginRight: 'auto',
                            marginLeft: 5,
                          }}>
                          {translate('Coupon')}:
                        </Text>
                        <Text
                          style={[
                            styles.payment,
                            {
                              ...FONTS.body2,
                              ...FONTS.h3,
                              color: COLORS.primary,
                            },
                          ]}>
                          - 0
                        </Text>
                      </View>
                    )}
                    {/*{console.log("user1=="+JSON.stringify(user1))}*/}

                    {selectedProvider?.is_paying_taxes === 1 && haveSomeTax ? (
                      <View style={{marginTop: 5}}>
                        <View style={styles.paymentContainer}>
                          <Text
                            style={{
                              ...FONTS.body4,
                              fontWeight: '300',
                              marginRight: 'auto',
                              marginLeft: 5,
                            }}>
                            {translate('totalBeforeTax')}:
                          </Text>
                          <Text
                            style={[
                              styles.payment,
                              {...FONTS.h2, ...FONTS.h3, color: COLORS.black},
                            ]}>
                            {helpers.getTotalAmoutWithCoupon(
                              cartItem?.items,
                              discount,
                              type,
                            )}{' '}
                            CAD
                          </Text>
                        </View>

                        <View style={styles.paymentContainer}>
                          <Text
                            style={{
                              ...FONTS.body4,
                              fontWeight: '300',
                              fontSize: 12,
                              marginRight: 'auto',
                              marginLeft: 5,
                            }}>
                            {translate('Estimated')} GST/HST ({gstTax}%):
                          </Text>
                          <Text
                            style={[
                              styles.payment,
                              {...FONTS.h2, ...FONTS.h3, color: COLORS.primary},
                            ]}>
                            {helpers.calculateTax(
                              cartItem?.items,
                              gstTax,
                              discount,
                              type,
                            )}{' '}
                            CAD
                          </Text>
                        </View>

                        <View style={styles.paymentContainer}>
                          <Text
                            style={{
                              ...FONTS.body4,
                              fontSize: 12,
                              fontWeight: '300',
                              marginRight: 'auto',
                              marginLeft: 5,
                            }}>
                            {translate('Estimated')} PST/RST/QST ({pstTax}%):
                          </Text>
                          <Text
                            style={[
                              styles.payment,
                              {...FONTS.h2, ...FONTS.h3, color: COLORS.primary},
                            ]}>
                            {helpers.calculateTax(
                              cartItem?.items,
                              pstTax,
                              discount,
                              type,
                            )}{' '}
                            CAD
                          </Text>
                        </View>
                      </View>
                    ) : null}
                    <View style={[styles.paymentContainer, {marginTop: 20}]}>
                      <Text
                        style={{
                          ...FONTS.body4,
                          fontWeight: '600',
                          marginRight: 'auto',
                          marginLeft: 5,
                        }}>
                        {translate('totalPayment')}
                      </Text>
                      <Text style={styles.payment}>
                        {`${helpers.calculateGrandTotal(
                          cartItem,
                          discount,
                          type,
                          gstTax,
                          pstTax,
                          selectedProvider,
                        )} CAD`}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              placeholder={translate('couponCode')}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 5,
                paddingHorizontal: 10,
                width: '80%',
                height: 50,
              }}
              onChangeText={value => setCoupon(value)}
            />
            <TouchableOpacity
              disabled={discount === undefined ? false : true}
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 5,
                height: 55,
                width: '17%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => handleRefundRequest()}>
              {isLoading === true ? (
                <ActivityIndicator size="small" color={COLORS.secondary} />
              ) : (
                <Text style={{color: COLORS.secondary}}>
                  {translate('verify')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={{color: 'red', fontSize: 11}}>{error}</Text>
          <View>
            {isProduct ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsVisible(true)}
                style={styles.delivery_address}>
                <Text
                  style={{
                    ...FONTS.h3,
                  }}>
                  {checkoutData?.delivery_address_label
                    ? checkoutData.delivery_address_label
                    : translate('deliveryAddress')}
                </Text>
              </TouchableOpacity>
            ) : null}

            <View>
              {isProduct ? (
                <>
                  <View style={styles.heading}>
                    <Text style={styles.headingTxt}>
                      {translate('SelectProductDelivery')}
                    </Text>
                  </View>
                  <RadioButtonRN
                    data={data}
                    initial={deliveryTypeIndex}
                    selectedBtn={e => dispatch(setDeliveryType(e?.label))}
                    boxStyle={styles.radioBox}
                    circleSize={8}
                    textColor={COLORS.gray}
                  />

                  {checkoutData?.delivery_type === 'pickup' ? (
                    <>
                      <View style={styles.heading}>
                        <Text style={styles.headingTxt}>
                          {translate('pickUpAddress')}
                        </Text>
                        <Text>
                          {provider?.address_office
                            ? provider.address_office
                            : provider?.address_home}
                        </Text>
                      </View>
                    </>
                  ) : null}

                  {checkoutData.delivery_type !== 'pickup' ? (
                    <View style={styles.heading}>
                      <Text style={styles.headingTxt}>
                        {translate('shippingInfo')}
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : null}
              <AppForm
                initialValues={checkoutData}
                enableReinitialize
                validationSchema={cartFormValidationSchema()}
                onSubmit={values => {
                  dispatch(
                    onPressPayment({
                      values,
                      discount: discount,
                      type: type,
                      selectedProvider,
                      user1,
                      cartItem: cartItems.filter(
                        c => c?.provider_id === selectedItem?.provider_id,
                      ),
                      role: 'provider',
                    }),
                  );
                }}>
                {isProduct ? (
                  <>
                    {checkoutData.delivery_type !== 'pickup' ? (
                      <>
                        <AppFormInput
                          name="name"
                          placeholder={translate('name')}
                        />
                        <AppFormInput
                          editable={false}
                          name="delivery_address_value"
                          placeholder={translate('address')}
                        />
                        <TouchableOpacity
                          onPress={() => refRBSheet.current?.open()}
                          activeOpacity={0.7}
                          style={styles.address_btn}>
                          <Text style={styles.address_btn_txt}>
                            {translate('changeAddress')}
                          </Text>
                        </TouchableOpacity>
                        <AppFormInput
                          name="email"
                          placeholder={translate('emailAddress')}
                        />
                        <AppFormInput
                          name="phone"
                          placeholder={translate('phone')}
                        />
                      </>
                    ) : null}
                  </>
                ) : null}

                {cartItems?.length > 0 ? (
                  <View style={styles.row_between}>
                    {/* <SubmitPaymentButton
                      title={'Cash on \n Delivery'}
                      icon={icons.cash_on_delivery}
                      onPress={() => dispatch(setPaymentType('cod'))}
                    /> */}
                    <SubmitPaymentButton
                      title={translate('order')}
                      onPress={() => dispatch(setPaymentType('online'))}
                      icon={icons.cart_image}
                      iconColor={COLORS.primary}
                      txtColor={COLORS.primary}
                    />
                  </View>
                ) : null}
              </AppForm>
            </View>
          </View>
          <View style={{height: 40}} />
        </ScrollView>
      </BaseView>

      <RBSheet
        ref={refRBSheet}
        height={320}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            marginBottom: getBottomSpace(),
          },
        }}>
        <View
          style={{
            marginHorizontal: 15,
            paddingVertical: 10,
          }}>
          <AppForm
            enableReinitialize={true}
            validationSchema={AddressessValidationSchema}
            initialValues={{
              address: checkoutData?.delivery_address_value,
            }}
            onSubmit={() => {
              dispatch(setAddress(location));
              refRBSheet?.current?.close();
            }}>
            <View
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: COLORS.gray,
                borderRadius: 5,
                height: 200,
              }}>
              <AppFormGooglePlacesInput
                placeholder={translate('location')}
                name="address"
                onGetPlaceId={(_, discription, location) => {
                  setLocation({
                    address: discription,
                    lat: location?.lat,
                    lng: location?.lng,
                  });
                }}
              />
            </View>
            <SubmitButton title={translate('save')} />
          </AppForm>
        </View>
      </RBSheet>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationOutTiming={1}
        onBackdropPress={() => setIsVisible(false)}>
        <PaymentMethodPicker
          data={helpers.getDeliverAddress(user1)}
          activeWorkAddress={activeWorkAddress}
          refRadio={refRadio}
          setWorkAddress={(val, index) => {
            dispatch(setDeliveryAddress({label: val, user1}));
            setActiveAddress(index);
            setIsVisible(false);
          }}
          onClose={() => setIsVisible(false)}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  cartContainer: {
    borderWidth: 2,
    padding: 10,
    borderColor: COLORS.gray,
    borderRadius: 10,
    marginBottom: 10,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  payment: {
    ...FONTS.h2,
    color: COLORS.black,
    width: 150,
    fontWeight: '800',
    textAlign: 'right',
  },
  txt: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '300',
    marginRight: 5,
  },
  address_btn: {
    paddingVertical: 10,
    alignSelf: 'flex-end',
  },
  address_btn_txt: {
    ...FONTS.h4,
    fontWeight: '800',
    color: COLORS.primary,
  },
  heading: {
    borderBottomColor: COLORS.gray,
    marginTop: 30,
  },
  headingTxt: {
    ...FONTS.h3,
    fontWeight: '600',
  },
  radioBox: {
    borderWidth: 0,
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  row_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delivery_address: {
    marginLeft: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray,
    marginVertical: 10,
  },
  itemsTitle: {
    ...FONTS.body5,
    color: COLORS.white,
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    alignSelf: 'baseline',
    paddingVertical: 1,
    paddingHorizontal: 15,
    borderRadius: 2,
    marginTop: 5,
  },
});
