import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppForm,
  AppFormInput,
  AppFormPicker,
  AppHeader,
  AppLoader,
  AppTagsPicker,
  BaseView,
  ImageUpload,
  SubmitButton,
} from '../../components';
import {AppFormDatePicker} from '../../components/forms/AppFormDatePicker';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {translate} from '../../multiLang/translation';
import {
  addServices,
  removeImage,
  updateItem,
  getProviderData,
  setTags,
  searchTags,
  deleteItem,
} from '../../store/reducers/userItems';

import {addServiceValidationSchema} from '../../validations';

// Custom Components

const AppFormInputWithTitle = ({title, ...otherProps}) => (
  <View style={{marginTop: 10}}>
    <Text numberOfLines={1} style={styles.inputTitle}>
      {title}
    </Text>
    <AppFormInput returnKeyType={"next"} multiline={false} otherStyles={{marginTop: 2}} {...otherProps} />
  </View>
);
const AppFormPickerWithTitle = ({title, ...otherProps}) => (
  <View style={{marginTop: 10}}>
    <Text numberOfLines={1} style={styles.pickerTitle}>
      {title}
    </Text>
    <AppFormPicker otherStyles={{marginTop: 2}} {...otherProps} />
  </View>
);

const AppFormDatePickerWithTitle = ({title, ...otherProps}) => (
  <View style={{marginTop: 10}}>
    <Text numberOfLines={1} style={styles.pickerTitle}>
      {title}
    </Text>
    <AppFormDatePicker {...otherProps} />
  </View>
);

export const AddNewServicesScreen = ({route}) => {
  const {user} = useContext(AuthContext);
  const {title} = route.params;
  const [images, setImages] = useState([]);
  const {
    provider_categories,
    provider_employees,
    selected_tags,
    provider_filtered_tags,
    serviceInitialValues,
    loading,
    editMode,
  } = useSelector(state => state.userItems);

  const dispatch = useDispatch();

  const [isDiscount, setIsDiscount] = useState(
    serviceInitialValues.discount_available,
  );

  const [isDiscountType, setIsDiscountType] = useState(
    serviceInitialValues.discount_type,
  );

  const [isLocation, setIsLocation] = useState(serviceInitialValues.location);

  useEffect(() => {
    dispatch(getProviderData());
  }, []);

  const ImagePicker = () => (
    <View>
      <Text style={styles.imagePickerTitle}>{translate('uploadImg')}</Text>
      <ImageUpload
        onPickImage={val => {
          setImages(prv => [...prv, val]);
        }}
      />
    </View>
  );

  const ServerImages = ({uri, id}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        Alert.alert(translate('deleteImg'), translate('deleteImgText'), [
          {
            text: translate('cancel'),
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: translate('delete'),
            onPress: () => dispatch(removeImage({id, route: title})),
            style: 'destructive',
          },
        ]);
      }}
      style={{
        height: 50,
        width: 50,
        marginTop: 10,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 5,
        backgroundColor: COLORS.lightGray,
      }}>
      <Image source={{uri: uri}} style={{height: 50, width: 50}} />
    </TouchableOpacity>
  );

  const Images = ({uri}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        const filteredImages = images.filter(img => img.uri !== uri);
        setImages(filteredImages);
      }}
      style={{
        height: 50,
        width: 50,
        marginTop: 10,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 5,
        backgroundColor: COLORS.lightGray,
      }}>
      <Image source={{uri: uri}} style={{height: 50, width: 50}} />
    </TouchableOpacity>
  );

  const DISCOUNT_AVAILIBLE = [
    {label: 'Yes', value: 'Y'},
    {label: 'No', value: 'N'},
  ];

  const TAXABLE = [
    {label: 'Yes', value: 'Y'},
    {label: 'No', value: 'N'},
  ];

  const DISCOUNT_TYPE = [
    {label: 'Flat', value: 'FLAT'},
    {label: 'Percent', value: 'PERCENT'},
  ];

  const REQUIRE_APPOINTMENTS = [
    {label: 'Yes', value: 'Y'},
    {label: 'No', value: 'N'},
  ];

  const LOCATIONS = [
    {label: 'Onsite', value: 'onsite'},
    {label: 'Home', value: 'home'},
  ];

  const PRICE_TYPE = [
    {label: 'Flat', value: 'flat'},
    {label: 'Slot', value: 'hourly'},
  ];

  const PICKUP_AVAILIBLE = [
    {label: 'Yes', value: 'Y'},
    {label: 'No', value: 'N'},
  ];

  const DELIVERY_AVAILIBLE = [
    {label: 'Yes', value: 'Y'},
    {label: 'No', value: 'N'},
  ];

  const onSubmit = val => {
    Keyboard.dismiss();
    const tags = selected_tags.map(s => s.name);
    const values = {
      ...val,
      images: JSON.stringify(images),
      tags: JSON.stringify(tags),
      colors: JSON.stringify([]),
      sizes: JSON.stringify([]),
    };
    !editMode
      ? dispatch(addServices(values))
      : dispatch(
          updateItem({
            id: serviceInitialValues?.id,
            values,
            route: 'Services',
          }),
        );
  };

  return (
    <>
      {loading && <AppLoader />}
      <AppHeader
        title={`${
          editMode ? translate('update') : translate('addNew')
        } ${title}`}
        rightIcon={editMode ? icons.trash : null}
        iconColor={'#4d2328'}
        iconSize={20}
        loading={loading}
        onPressRight={() => {
          Alert.alert(
            translate('deleteService'),
            translate('deleteServiceText'),
            [
              {
                text: translate('yes'),
                onPress: () =>
                  dispatch(
                    deleteItem({
                      id: serviceInitialValues?.id,
                      type: 'services',
                    }),
                  ),
              },
              {
                text: translate('no'),
                onPress: () => {},
                style: 'cancel',
              },
            ],
          );
        }}
      />
      <BaseView styles={styles.container}>
        {!user?.address_home && !user.address_office ? (
          <Text
            style={{
              ...FONTS.body4,
              backgroundColor: COLORS.error,
              color: COLORS.white,
              fontSize: 14,
              lineHeight: 18,
              marginHorizontal: 15,
              paddingHorizontal: 10,
            }}>
            {translate('noAddress')}
          </Text>
        ) : null}
        <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            style={{flex: 1}}
            keyboardShouldPersistTaps="handled">
            <View
              style={{
                paddingHorizontal: 15,
                marginTop: 10,
                paddingBottom: 10,
              }}>
              <AppForm
                initialValues={serviceInitialValues}
                // enableReinitialize={editMode}
                validationSchema={addServiceValidationSchema()}
                onSubmit={onSubmit}>
                {/* Product Name  */}
                <AppFormInputWithTitle
                  title={`${title} ` + translate('name1')}
                  name="title"
                />

                {/* Is Item taxable  */}
                <AppFormPickerWithTitle
                  title={translate("Isthisitemtaxable")+"?"}
                  name="taxable"
                  placeholder=""
                  icon
                  items={TAXABLE}
                />

                {/* Price and Discount Aavailable */}
                <View style={styles.flexRowEnd}>
                  <View style={{width: '49%'}}>
                    <AppFormInputWithTitle
                      title={translate('price')}
                      keyboardType="decimal-pad"
                      icon={icons.dollar}
                      name="price"
                    />
                  </View>
                  <View style={{width: '49%'}}>
                    <View style={{marginTop: 10}}>
                      <AppFormPickerWithTitle
                        title={translate('priceType')}
                        name="price_type"
                        placeholder=""
                        icon
                        items={PRICE_TYPE}
                      />
                    </View>
                  </View>
                </View>

                <View style={{width: '98%'}}>
                  <View style={{marginTop: 10}}>
                    <AppFormPickerWithTitle
                      title={translate('discountAvailable')}
                      name="discount_available"
                      onSelect={(val) => {
                        setIsDiscount(val)
                            {val==='Y'?alert(translate("Adddiscountvalue")):null}
                      }}
                      placeholder=""
                      icon
                      items={DISCOUNT_AVAILIBLE}
                    />
                  </View>
                </View>

                {/* Discount value & Discount Type  */}
                {isDiscount === 'Y' ? (
                  <View style={styles.flexRowEnd}>
                    <View style={{width: '49%'}}>
                      <AppFormInputWithTitle
                        title={translate('discountValue')}
                        keyboardType="decimal-pad"
                        icon={
                          icons[
                            isDiscountType === 'FLAT' ? 'dollar' : 'percent'
                          ]
                        }
                        name="discount"
                      />
                    </View>
                    <View style={{width: '49%'}}>
                      <View style={{marginTop: 10}}>
                        <AppFormPickerWithTitle
                          title={''}
                          name="discount_type"
                          placeholder=""
                          icon
                          items={DISCOUNT_TYPE}
                          onSelect={val =>{
                          val==="FLAT"?
                              alert(translate("Adddiscountvalue"))
                              :
                              alert(translate("Adddiscountvaluepercent"))
                          setIsDiscountType(val)
                        }}
                        />
                      </View>
                    </View>
                  </View>
                ) : null}

                {/* Discount start & end date  */}
                {isDiscount === 'Y' ? (
                  <View style={styles.flexRowEnd}>
                    <View style={{width: '49%'}}>
                      <AppFormDatePickerWithTitle
                        // title={'Validaty Till'}
                        title={translate('from')}
                        name="discount_start_date"
                      />
                    </View>
                    <View style={{width: '49%'}}>
                      <AppFormDatePickerWithTitle
                        // title={'Validaty Till'}
                        title={translate('to')}
                        name="discount_end_date"
                      />
                    </View>
                  </View>
                ) : null}

                {/* Location &  Require appoinment  */}
                <View style={styles.flexRowEnd}>
                  <View style={{width: '49%'}}>
                    <AppFormPickerWithTitle
                      title={translate('location')}
                      name="location"
                      placeholder=""
                      icon
                      items={LOCATIONS}
                      onSelect={val => setIsLocation(val)}
                    />
                  </View>
                  <View style={{width: '49%'}}>
                    <AppFormPickerWithTitle
                      title={translate('appointment')}
                      name="require_appointment"
                      placeholder=""
                      icon
                      items={REQUIRE_APPOINTMENTS}
                    />
                  </View>
                </View>

                {/* Available Pickup from Home &  Delivery Service at home  */}
                {isLocation === 'onsite' ? (
                  <View style={styles.flexRowEnd}>
                    <View style={{width: '100%'}}>
                      <AppFormPickerWithTitle
                        title={translate('AvailablePickupfromHome')}
                        name="pick_up_availible"
                        placeholder=""
                        icon
                        items={PICKUP_AVAILIBLE}
                      />
                    </View>
                    <View style={{width: '100%'}}>
                      <AppFormPickerWithTitle
                        title={translate('DeliveryServiceAtHome')}
                        name="delivery_availible"
                        placeholder=""
                        icon
                        items={DELIVERY_AVAILIBLE}
                      />
                    </View>
                  </View>
                ) : null}

                {/* Category selection  */}
                <AppFormPickerWithTitle
                  title={translate('category')}
                  name="category_id"
                  placeholder=""
                  icon
                  items={provider_categories}
                />

                {/* Employee selection  */}
                <AppFormPickerWithTitle
                  title={translate('employee')}
                  name="employee_id"
                  placeholder=""
                  icon
                  item_name="name"
                  item_value="id"
                  items={provider_employees}
                />

                {/* Tags selection  */}
                <AppTagsPicker
                  selectedTags={selected_tags}
                  tags={provider_filtered_tags}
                  onSelect={val => dispatch(setTags(val))}
                  onSearch={val => dispatch(searchTags(val))}
                  onAddTag={val => dispatch(setTags(val))}
                />

                {/* Images from server  */}
                <ScrollView horizontal>
                  {serviceInitialValues.images.map((img, i) => (
                    <ServerImages
                      uri={helpers.get_image(img.file_path)}
                      id={img.id}
                      key={i}
                    />
                  ))}
                </ScrollView>

                {/* Image picker  */}
                <ScrollView horizontal>
                  {images.map((img, i) => (
                    <Images uri={helpers.get_image(img.uri)} key={i} />
                  ))}
                </ScrollView>
                <ImagePicker />

                {/* Summary and Specification */}
                <AppFormInputWithTitle
                  title={translate('summary')}
                  name="summary"
                  inputStyles={styles.textArea}
                  otherStyles={{
                    height: 100,
                  }}
                  multiline={true}
                  numberOfLines={4}
                />

                {/* Submit button  */}
                <SubmitButton
                  title={`${editMode ? 'Update' : 'Create'} Service`}
                  otherStyles={{width: '80%', alignSelf: 'center'}}
                />
              </AppForm>
            </View>
            <View style={{height: 20}} />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  inputTitle: {
    ...FONTS.body4,
    fontWeight: '600',
    color: COLORS.gray,
    textTransform: 'capitalize',
  },
  pickerTitle: {
    ...FONTS.body4,
    fontWeight: '600',
    color: COLORS.gray,
  },
  imagePickerTitle: {
    ...FONTS.h4,
    marginTop: 20,
    marginLeft: 5,
    color: COLORS.gray,
    fontWeight: '800',
  },
  flexRowEnd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  textArea: {
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    height: 100,
    paddingTop: 10,
  },
});
