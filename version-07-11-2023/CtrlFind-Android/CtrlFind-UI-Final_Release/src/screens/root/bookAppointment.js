import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
    AppButton,
    AppHeader,
    AppointmentDatePicker,
    LocationInput,
    BaseView,
    ImageUpload,
    DateComponent,
    AppForm,
    AppFormGooglePlacesInput,
    SubmitButton,
    PaymentMethodPicker,
    BookingSlots,
    AppCheckBox, AppIcon,
} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import * as Yup from 'yup';
import {
  getProviderScheduleDates,
  setAddress,
  setDateComponent,
  setImages,
  setTimeComponent,
  onRmoveIMG,
  onPressContinue,
  setAppointmentAddress,
  setTime,
  resetSlots,
  setPickup,
  setDelivery,
} from '../../store/reducers/appointments';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import helpers from '../../constants/helpers';
import AuthContext from '../../context/AuthContext';
import {translate} from '../../multiLang/translation';
import FilePickerManager from 'react-native-file-picker';
import DocumentPicker from 'react-native-document-picker';
import localStorage from '../../server/localStorage';
import axios from 'axios';
import {deleteFilePath, setFilePath} from '../../store/reducers/checkout';
import {re} from "@babel/core/lib/vendor/import-meta-resolve";
export const BookAppointmentScreen = ({route}) => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const {showDateComponent, showTimeComponent, appointment_initial_values} =
    useSelector(state => state.appointments);
  const [activeWorkAddress, setActiveAddress] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const {item} = route.params;
  const {id} = route.params;
  const refRBSheet = useRef(null);
  const refRadio = useRef();

  const PICKUP = translate('PickupService');
  const DELIVERY = translate('DeliveryService');

  const AddressessValidationSchema = Yup.object().shape({
    address: Yup.string().required().label('Address'),
  });
  const [location, setLocation] = useState(null);
  const [documentFile1, setDocumentFile1] = useState(undefined);
  const [documentFile2, setDocumentFile2] = useState(undefined);
  const [documentFile3, setDocumentFile3] = useState(undefined);

  const filePicker1 = async () => {
    if (Platform.OS === 'android') {
      FilePickerManager.showFilePicker({readContent: true}, async response => {
        console.log('first sjhgdjResponse = ', response);

        if (response.didCancel) {
          console.log('User cancelled file picker');
        } else if (response.error) {
          console.log('FilePickerManager Error:', response.error);
        }
        else
            if (response.size>5270767){
                alert(translate("Filesize"))
        }
            else {
            setDocumentFile1({...response, name: response.fileName});
          const {fileName, path, uri, type} = response;

          if (uri.startsWith('content://')) {
            const uriComponents = uri.split('/');
            const fileNameAndExtension =
              uriComponents[uriComponents.length - 1];
            const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
            const destSpaceRemoved = destPath.replace(/%/g, '');
            await RNFS.copyFile(uri, destSpaceRemoved);
            fileUri = 'file://' + destSpaceRemoved;
            console.log('fileUri--->', fileUri);
              setDocumentFile1({
              ...response,
              uri: fileUri,
              name: response.fileName,
            });

            dispatch(
              setFilePath({
                id: item?.service?.id,
                name: fileName,
                fileName,
                path,
                uri: fileUri,
                type,
              }),
            );
          } else {
            dispatch(
              setFilePath({
                id: item?.service?.id,
                name: fileName,
                fileName,
                path,
                uri,
                type,
              }),
            );
          }
        }
      });
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        let response = {
          fileName: res[0].name,
          type: res[0].type,
          uri: res[0].uri,
            size:res[0].size

        };
          if (response.size>5270767){
              alert(translate("Filesize"))
              return
          }
          else {
          setDocumentFile1(response);
        const uri = res[0].uri;
        if (uri.startsWith('content://')) {
          const uriComponents = uri.split('/');
          const fileNameAndExtension = uriComponents[uriComponents.length - 1];
          const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
          const destSpaceRemoved = destPath.replace(/%/g, '');
          await RNFS.copyFile(uri, destSpaceRemoved);
          fileUri = 'file://' + destSpaceRemoved;
          console.log('fileUri--->', fileUri);
            setDocumentFile1({
            ...response,
            uri: fileUri,
            name: response.fileName,
          });
          dispatch(
            setFilePath({
              id: item?.service?.id,
              name: response.fileName,
              fileName: response.fileName,
              uri: response.uri,
              type: response.type,
            }),
          );
        } else {
          dispatch(
            setFilePath({
              id: item?.service?.id,
              name: response.fileName,
              fileName: response.fileName,
              uri: response.uri,
              type: response.type,
            }),
          );
        }
      }} catch (err) {
        if (DocumentPicker.isCancel(err)) {
        } else {
          throw err;
        }
      }
    }
  };




    const filePicker2 = async () => {
        if (Platform.OS === 'android') {
            FilePickerManager.showFilePicker({readContent: true}, async response => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    console.log('User cancelled file picker');
                } else if (response.error) {
                    console.log('FilePickerManager Error:', response.error);
                }
                else
                if (response.size>5270767){
                    alert(translate("Filesize"))
                }
                else {
                    setDocumentFile2({...response, name: response.fileName});
                    const {fileName, path, uri, type} = response;

                    if (uri.startsWith('content://')) {
                        const uriComponents = uri.split('/');
                        const fileNameAndExtension =
                            uriComponents[uriComponents.length - 1];
                        const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
                        const destSpaceRemoved = destPath.replace(/%/g, '');
                        await RNFS.copyFile(uri, destSpaceRemoved);
                        fileUri = 'file://' + destSpaceRemoved;
                        // console.log('fileUri--->', fileUri);
                        setDocumentFile2({
                            ...response,
                            uri: fileUri,
                            name: response.fileName,
                        });

                        dispatch(
                            setFilePath({
                                id: item?.service?.id,
                                name: fileName,
                                fileName,
                                path,
                                uri: fileUri,
                                type,
                            }),
                        );
                    } else {
                        dispatch(
                            setFilePath({
                                id: item?.service?.id,
                                name: fileName,
                                fileName,
                                path,
                                uri,
                                type,
                            }),
                        );
                    }
                }
            });
        } else {
            try {
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                });
                let response = {
                    fileName: res[0].name,
                    type: res[0].type,
                    uri: res[0].uri,
                    size:res[0].size

                };
                if (response.size>5270767){
                    alert(translate("Filesize"))
                    return
                }
                else {
                setDocumentFile2(response);
                const uri = res[0].uri;
                if (uri.startsWith('content://')) {
                    const uriComponents = uri.split('/');
                    const fileNameAndExtension = uriComponents[uriComponents.length - 1];
                    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
                    const destSpaceRemoved = destPath.replace(/%/g, '');
                    await RNFS.copyFile(uri, destSpaceRemoved);
                    fileUri = 'file://' + destSpaceRemoved;
                    // console.log('fileUri--->', fileUri);
                    setDocumentFile2({
                        ...response,
                        uri: fileUri,
                        name: response.fileName,
                    });
                    dispatch(
                        setFilePath({
                            id: item?.service?.id,
                            name: response.fileName,
                            fileName: response.fileName,
                            uri: response.uri,
                            type: response.type,
                        }),
                    );
                } else {
                    dispatch(
                        setFilePath({
                            id: item?.service?.id,
                            name: response.fileName,
                            fileName: response.fileName,
                            uri: response.uri,
                            type: response.type,
                        }),
                    );
                }
            }} catch (err) {
                if (DocumentPicker.isCancel(err)) {
                } else {
                    throw err;
                }
            }
        }
    };



    const filePicker3 = async () => {
        if (Platform.OS === 'android') {
            FilePickerManager.showFilePicker({readContent: true}, async response => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    console.log('User cancelled file picker');
                } else if (response.error) {
                    console.log('FilePickerManager Error:', response.error);
                }
                else
                if (response.size>5270767){
                    alert(translate("Filesize"))
                }
                else {
                    setDocumentFile3({...response, name: response.fileName});
                    const {fileName, path, uri, type} = response;

                    if (uri.startsWith('content://')) {
                        const uriComponents = uri.split('/');
                        const fileNameAndExtension =
                            uriComponents[uriComponents.length - 1];
                        const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
                        const destSpaceRemoved = destPath.replace(/%/g, '');
                        await RNFS.copyFile(uri, destSpaceRemoved);
                        fileUri = 'file://' + destSpaceRemoved;
                        // console.log('fileUri--->', fileUri);
                        setDocumentFile3({
                            ...response,
                            uri: fileUri,
                            name: response.fileName,
                        });

                        dispatch(
                            setFilePath({
                                id: item?.service?.id,
                                name: fileName,
                                fileName,
                                path,
                                uri: fileUri,
                                type,
                            }),
                        );
                    } else {
                        dispatch(
                            setFilePath({
                                id: item?.service?.id,
                                name: fileName,
                                fileName,
                                path,
                                uri,
                                type,
                            }),
                        );
                    }
                }
            });
        } else {
            try {
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                });
                let response = {
                    fileName: res[0].name,
                    type: res[0].type,
                    uri: res[0].uri,
                    size:res[0].size
                };
                if (response.size>5270767){
                    alert(translate("Filesize"))
                    return
                }
                else {
                setDocumentFile3(response);
                const uri = res[0].uri;
                if (uri.startsWith('content://')) {
                    const uriComponents = uri.split('/');
                    const fileNameAndExtension = uriComponents[uriComponents.length - 1];
                    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
                    const destSpaceRemoved = destPath.replace(/%/g, '');
                    await RNFS.copyFile(uri, destSpaceRemoved);
                    fileUri = 'file://' + destSpaceRemoved;
                    console.log('fileUri--->', fileUri);
                    setDocumentFile3({
                        ...response,
                        uri: fileUri,
                        name: response.fileName,
                    });
                    dispatch(
                        setFilePath({
                            id: item?.service?.id,
                            name: response.fileName,
                            fileName: response.fileName,
                            uri: response.uri,
                            type: response.type,
                        }),
                    );
                } else {
                    dispatch(
                        setFilePath({
                            id: item?.service?.id,
                            name: response.fileName,
                            fileName: response.fileName,
                            uri: response.uri,
                            type: response.type,
                        }),
                    );
                }
            }} catch (err) {
                if (DocumentPicker.isCancel(err)) {
                } else {
                    throw err;
                }
            }
        }
    };

  const onAddAddress = () => {
    dispatch(setAddress(location));
    refRBSheet?.current?.close();
  };

  const Images = ({uri}) => (
      <View>
      <AppIcon  extraStyle={{alignSelf: "flex-end",marginRight:7,tintColor:"red",zIndex:10,top:7}}  icon={icons.close} size={11}  />

    <TouchableOpacity
        onPress={() => dispatch(onRmoveIMG(uri))}
      style={{
        height: 65,
        width: 65,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 7,
        backgroundColor: COLORS.lightGray,
      }}>

      <Image source={{uri: uri}} style={{height: 65, width: 65,}} />
    </TouchableOpacity>
      </View>
  );

  return (
    <>
      <AppHeader title={translate('appointmentTitle')} />
      <BaseView styles={styles.container}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            {/*{console.log("service id===>",JSON.stringify(item?.service?.employee_id))}*/}
          {item?.service?.require_appointment === 'Y' ? (
            <>
              <AppointmentDatePicker
                title={translate('selectDate')}
                icon={icons.date}
                onPress={() => {
                  dispatch(setDateComponent(true));
                  dispatch(setTime(''));
                  dispatch(
                    getProviderScheduleDates({
                      id: item?.service?.UserId,
                      values: {
                        category_id: item?.service?.category_id,
                      },
                    }),
                  );
                }}
                value={appointment_initial_values?.appointment_date}
              />
              <AppointmentDatePicker
                title={translate('selectTime')}
                icon={icons.clock}
                onPress={() => {
                  if (appointment_initial_values?.appointment_date) {
                    dispatch(
                      resetSlots(appointment_initial_values?.appointment_time),
                    );
                    dispatch(setTimeComponent(true));
                  } else {
                    alert(translate("selectdatefirst"));
                  }
                }}
                value={appointment_initial_values?.appointment_time}
              />
            </>
          ) : null}
          <LocationInput
            value={appointment_initial_values?.address}
            headerTitle={appointment_initial_values?.address_label}
            onPress={() => setIsVisible(true)}>
            {/* Delivery Pickup Status */}
            {item?.service?.location !== 'home' ? (
              <View>
                {item?.service.pick_up_availible === 'Y' ? (
                  <AppCheckBox
                    title={PICKUP}
                    isChecked={appointment_initial_values.pickup}
                    setIsChecked={() =>
                      dispatch(setPickup(!appointment_initial_values.pickup))
                    }
                  />
                ) : null}

                {item?.service.delivery_availible === 'Y' ? (
                  <AppCheckBox
                    title={DELIVERY}
                    isChecked={appointment_initial_values.delivery}
                    setIsChecked={() =>
                      dispatch(
                        setDelivery(!appointment_initial_values.delivery),
                      )
                    }
                  />
                ) : null}
              </View>
            ) : null}
          </LocationInput>
          <TouchableOpacity
            onPress={() => refRBSheet.current?.open()}
            activeOpacity={0.7}
            style={styles.address_btn}>
            <Text style={styles.address_btn_txt}>
              {translate('changeAddress')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>{translate('upload')}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 15,
            }}>
              <Text
                  style={{
                      fontSize: 13,
                      marginRight:10,
                      fontWeight:"700",
                      color:COLORS.primary
                  }}>
                  1.
              </Text>
            <TouchableOpacity
              onPress={() => {
                  {
                      documentFile1?.fileName === "" ?
                          filePicker1()
                  :
                          dispatch(deleteFilePath(documentFile1?.fileName))
                      filePicker1();
                  }
                  }}
              style={{
                backgroundColor: 'rgba(0,0,0,0.15)',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                }}>
                Choose File
              </Text>
            </TouchableOpacity>
            <Text numberOfLines={1} ellipsizeMode='tail'
              style={{
                fontSize: 11,
                paddingHorizontal: 13,
                paddingVertical: 5,
                color: COLORS.gray,
                  flex:1
              }}>
              {documentFile1?.fileName ?? translate("NoFileChosen")}
            </Text>
              {documentFile1?.fileName?
              <TouchableOpacity onPress={()=>{
                  setDocumentFile1(undefined)
                  dispatch(deleteFilePath(documentFile1?.fileName))

              }}>
              <AppIcon   extraStyle={{alignSelf: "flex-end",marginRight:7,tintColor:"red"}}  icon={icons.close} size={11}  />
              </TouchableOpacity>
                  :null}
          </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                }}>
                <Text
                    style={{
                        fontSize: 13,
                        marginRight:10,
                        fontWeight:"700",
                        color:COLORS.primary
                    }}>
                    2.
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        {
                            documentFile2?.fileName === "" ?
                                filePicker2()
                                :
                                dispatch(deleteFilePath(documentFile2?.fileName))
                            filePicker2();
                        }

                    }}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        borderRadius: 5,
                    }}>
                    <Text
                        style={{
                            fontSize: 11,
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                        }}>
                        Choose File
                    </Text>
                </TouchableOpacity>
                <Text numberOfLines={1} ellipsizeMode='tail'
                    style={{
                        fontSize: 11,
                        paddingHorizontal: 13,
                        paddingVertical: 5,
                        color: COLORS.gray,
                        flex:1
                    }}>
                    {documentFile2?.fileName ?? translate("NoFileChosen")}
                </Text>
                {documentFile2?.fileName?
                    <TouchableOpacity onPress={()=>{
                        setDocumentFile2(undefined)
                        dispatch(deleteFilePath(documentFile2?.fileName))

                    }}>
                        <AppIcon   extraStyle={{alignSelf: "flex-end",marginRight:7,tintColor:"red"}}  icon={icons.close} size={11}  />
                    </TouchableOpacity>
                    :null}
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 15,
                }}>
                <Text
                    style={{
                        fontSize: 13,
                       marginRight:10,
                        fontWeight:"700",
                        color:COLORS.primary
                    }}>
                    3.
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        {
                            documentFile3?.fileName === "" ?
                                filePicker3()
                                :
                                dispatch(deleteFilePath(documentFile3?.fileName))
                            filePicker3();
                        }

                    }}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        borderRadius: 5,
                    }}>
                    <Text
                        style={{
                            fontSize: 11,
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                        }}>
                        Choose File
                    </Text>
                </TouchableOpacity>
                <Text numberOfLines={1} ellipsizeMode='tail'
                    style={{
                        fontSize: 11,
                        paddingHorizontal: 13,
                        paddingVertical: 5,
                        color: COLORS.gray,
                        flex:1,

                    }}>
                    {documentFile3?.fileName ?? translate("NoFileChosen")}
                </Text>
                {documentFile3?.fileName?
                    <TouchableOpacity onPress={()=>{
                        setDocumentFile3(undefined)
                        dispatch(deleteFilePath(documentFile3?.fileName))

                    }}>
                        <AppIcon   extraStyle={{alignSelf: "flex-end",marginRight:7,tintColor:"red"}}  icon={icons.close} size={11}  />
                    </TouchableOpacity>
                    :null}
            </View>
            {/* Images  */}
            <ScrollView horizontal>
                {appointment_initial_values?.images.map((img, i) => (
                    <Images uri={helpers.get_image(img.uri)} key={i} />
                ))}
            </ScrollView>
            <ImageUpload onPickImage={val => dispatch(setImages(val))} />
            {/*{*/}
            {/*    console.log("itemitem===>",item)*/}
            {/*}*/}
          <View style={styles.bottom}>
            <View style={{width: '48%'}}>
              <View>
                <Text style={{...FONTS.body4, color: COLORS.gray}}>
                  {translate('amount')}
                </Text>
                <Text style={{...FONTS.h2, fontWeight: '600'}}>
                  {`$${
                    item?.service.require_appointment === 'Y'
                      ? helpers.getItemPrice(item?.service) * appointment_initial_values?.appointment_time.length
                      : helpers.getItemPrice(item?.service)
                  }`}
                </Text>
              </View>
            </View>
            <View style={{width: '48%'}}>
              {/*<AppButton*/}
              {/*  title={"file upload "}*/}
              {/*  onPress={() =>*/}
              {/*  {*/}
              {/*   addFile({})*/}
              {/*  }}*/}
              {/*/>*/}
              <AppButton
                title={translate('continue')}
                onPress={() =>
                  dispatch(
                    onPressContinue({...item,}),
                  )
                }
              />
            </View>
          </View>
          <View style={{height: 40}} />
        </ScrollView>
      </BaseView>
      <Modal
        isVisible={showDateComponent}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        style={{
          margin: 5,
        }}
        animationOutTiming={300}
        useNativeDriver>
        <DateComponent />
      </Modal>

      <Modal
        isVisible={showTimeComponent}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        style={{
          margin: 5,
        }}
        animationOutTiming={300}
        useNativeDriver>
        <BookingSlots
          onPressCancel={() => {
            dispatch(resetSlots([]));
            dispatch(setTimeComponent(false));
          }}
          onPressConfirm={time => {
            dispatch(setTimeComponent(false));
            dispatch(setTime(time));
          }}
          item={item}
          serviceData={item}
        />
      </Modal>
        {console.log("user==="+JSON.stringify(user))}
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationOutTiming={1}
        onBackdropPress={() => setIsVisible(false)}>
        <PaymentMethodPicker
          data={helpers.getDeliverAddress(user)}
          activeWorkAddress={activeWorkAddress}
          refRadio={refRadio}
          setWorkAddress={(val, index) => {
            dispatch(setAppointmentAddress({label: val, user}));
            setActiveAddress(index);
            setIsVisible(false);
          }}
          onClose={() => setIsVisible(false)}
        />
      </Modal>

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
              address: appointment_initial_values?.address,
            }}
            onSubmit={onAddAddress}>
            <View
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: COLORS.gray,
                borderRadius: 5,
                height: 200,
              }}>
              <AppFormGooglePlacesInput
                placeholder="Location"
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
            <SubmitButton title={'Save'} />
          </AppForm>
        </View>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  bottom: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    ...FONTS.h4,
    marginTop: 10,
    marginLeft: 5,
    color: COLORS.gray,
    fontWeight: '800',
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

  headingTxt: {
    ...FONTS.h3,
    fontWeight: '600',
  },
});
