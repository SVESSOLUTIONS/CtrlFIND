import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Alert, TouchableOpacity,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    AppForm,
    AppHeader,
    AppImagePicker,
    AppFormInput,
    BaseView,
    SubmitButton,
    AppFormGooglePlacesInput,
    AppFakeInput,
    AppFormSwitch,
    AppCheckBox,
    AppFormPicker, AppButton,
} from '../../components';
import helpers from '../../constants/helpers';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import useAuth from '../../hooks/useAuth';
import {translate} from '../../multiLang/translation';
import server from '../../server/server';
import {deleteAccount,} from '../../store/reducers/forgetPassword';
import {setAddress} from "../../store/reducers/appointments";
import toast from "../../server/toast";
import Toast from "react-native-toast-message";
import localStorage from "../../server/localStorage";
import auth from '../../server/auth';
import {useDispatch} from "react-redux";
import navigation from "../../navigations/rootNavigator";
export const EditProfileScreen = () => {
  const refHome = useRef(null);
  const refOffice = useRef(null);
  const [isTaxEnabled, setIsTaxEnabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [provinces, setProvinces] = useState([]);
    const {user, trigger} = useContext(AuthContext);
  const formikRef = useRef();
    const dispatch = useDispatch();
  const {
    RegisterValidationSchema,
    state,
    edit_profile,
    updateValues,
    setPlaceId,
    setOfficePlaceId,
    setAvatar,
  } = useAuth();



  const deleteAlert = () =>  {
      Alert.alert(
          translate("ConfirmDeleteAccount"),
          translate("DeleteAccountMsg"),

          [
              {
                  text: translate("NO"),
                  onPress: () => {},
                  style: 'cancel',
              },
              {
                  text: translate("YES"),
                  onPress: () =>
                      deleteUserAccount(),
                  style: 'default',
              },
          ],
      );
  }

    const deleteUserAccount = () =>  {
        const data=user?.phone
        setTimeout(() => {
            dispatch(deleteAccount({data,}));
            trigger.signout()
        }, 300);


   };
  useEffect(() => {
    // if (helpers.getRole(user?.role_id) === helpers.SERVICE_PROVIDER) {
      server.getProvincesList().then(resp => {
        if (!resp.ok) return;
        setProvinces(resp.data);
      });

      // alert(translate("editProfileAlert"))


    // }


    setTimeout(() => {
      updateValues({
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        home_address: user?.address_home,
        office_address: user?.address_office,
        about: user.about,
        isPayingTax: user?.is_paying_taxes ? true : false,
        gst: user?.gst ? user.gst : '',
        pst: user?.pst ? user.pst : '',
        province_id: user?.province_id ? user.province_id : '',
          buyer_province_id: user?.buyer_province_id ? user.buyer_province_id : '',
        apartment_number: user?.apartment_number,
        company_registration_name: user?.company_registration_name
          ? user.company_registration_name
          : '',
        state: user?.state ? user.state : '',
        suit_number: user?.suit_number ?? '',
      });
      setIsChecked(user?.is_agree ? true : false);
      setIsTaxEnabled(user?.is_paying_taxes ? true : false);
    }, 1000);
  }, []);

  // buyer edit profile
  return (
    <>
      <AppHeader title={translate('editProfileTitle')} />

      {console.log(JSON.stringify(user))}
      <BaseView styles={styles.container}>
        <ScrollView style={{flexGrow: 1}}>
          <View
            style={{
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                height: 150,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppImagePicker
                onPickImage={setAvatar}
                image={helpers.get_image(state.RegisterInitialValues.avatar)}
              />
            </View>
            <KeyboardAvoidingView
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : ''}>
              <AppForm
                innerRef={formikRef}
                enableReinitialize={true}
                validationSchema={RegisterValidationSchema}
                initialValues={state.RegisterInitialValues}
                onSubmit={values => {
                  const formData = {
                    ...values,
                    is_agree: isChecked,
                  };
                  if (
                    helpers.getRole(user?.role_id) ===
                      helpers.SERVICE_PROVIDER &&
                    !isChecked
                  ) {
                    Alert.alert(
                      translate("Confirmationrequired"),
                      translate("confirmorderproceed"),
                    );
                  } else edit_profile(formData);
                }}>
                <AppFormInput
                  placeholder={translate('name')}
                  name="name"
                  otherStyles={{marginTop: 20}}
                />
                <AppFormInput
                  placeholder={translate('phoneNumber') + '(1–604–123–4567)'}
                  name="phone"
                  otherStyles={{marginTop: 20}}
                />
                <AppFormInput
                  placeholder={translate('email')}
                  name="email"
                  otherStyles={{marginTop: 20}}
                />



                <View
                  style={{
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      fontWeight: '800',
                    }}>
                    {translate('homeAddress')}
                  </Text>
                  <AppFakeInput
                    onPress={() => refHome.current?.open()}
                    title={state.RegisterInitialValues?.home_address}

                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      ...FONTS.h4,
                      fontWeight: '800',
                    }}>
                    {translate('officeAddress')}
                  </Text>
                  <AppFakeInput
                    onPress={() => refOffice.current?.open()}
                    title={state.RegisterInitialValues?.office_address}
                  />
                </View>
                  <View
                      style={{
                          marginTop: 10,
                      }}>
                      <Text
                          style={{
                              ...FONTS.h4,
                              fontWeight: '800',
                          }}>
                          {translate("Apartmentnumber")}
                      </Text>
                      <AppFormInput
                          name="apartment_number"
                          otherStyles={{marginTop: 5}}
                      />
                  </View>
                  <View
                      style={{
                          marginTop: 10,
                      }}>
                      <Text
                          style={{
                              ...FONTS.h4,
                              fontWeight: '800',
                          }}>
                          {translate("Suitenumber")}
                      </Text>
                      <AppFormInput
                          name="suit_number"
                          otherStyles={{marginTop: 5}}
                      />
                  </View>

                  {/*{helpers.getRole(user?.role_id) === helpers.BUYER ? (*/}
                  {/*    <View*/}
                  {/*        style={{*/}
                  {/*            marginTop: 10,*/}
                  {/*        }}>*/}
                  {/*        <Text*/}
                  {/*            style={{*/}
                  {/*                ...FONTS.h4,*/}
                  {/*                fontWeight: '800',*/}
                  {/*            }}>*/}
                  {/*            Provinces*/}
                  {/*        </Text>*/}

                  {/*        <AppFormPicker*/}
                  {/*            items={provinces}*/}
                  {/*            icon*/}
                  {/*            placeholder=""*/}
                  {/*            name="buyer_province_id"*/}
                  {/*            item_name="name"*/}
                  {/*            item_value="id"*/}
                  {/*            otherStyles={{marginTop: 5}}*/}
                  {/*        />*/}
                  {/*    </View>) :null}*/}
                <AppFormInput
                  placeholder={translate('aboutTitle')}
                  name="about"
                  inputStyles={{
                    textAlignVertical: 'top',
                    justifyContent: 'flex-start',
                    height: 90,
                  }}
                  otherStyles={{
                    marginTop: 20,
                    height: 100,
                  }}
                  multiline={true}
                  numberOfLines={4}
                />


                {/* Tax Fields  */}

                {helpers.getRole(user?.role_id) === helpers.SERVICE_PROVIDER ? (
                  <View>
                    <View style={{marginTop: 10}}>
                      <AppFormSwitch
                        name="isPayingTax"
                        onValueChange={setIsTaxEnabled}
                      />
                    </View>
                    {isTaxEnabled ? (
                      <View>
                        <View
                          style={{
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              ...FONTS.h4,
                              fontWeight: '800',
                            }}>
                              {translate("PSTnumber")}
                          </Text>
                          <AppFormInput
                            name="pst"
                            keyboardType="default"
                            otherStyles={{marginTop: 5}}
                          />
                        </View>
                        <View
                          style={{
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              ...FONTS.h4,
                              fontWeight: '800',
                            }}>
                              {translate("GSTnumber")}
                          </Text>
                          <AppFormInput
                            name="gst"
                            keyboardType="default"
                            otherStyles={{marginTop: 5}}
                          />
                        </View>

                        <View
                          style={{
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              ...FONTS.h4,
                              fontWeight: '800',
                            }}>
                            Company Registration Name
                          </Text>

                          <AppFormInput
                            name="company_registration_name"
                            otherStyles={{marginTop: 5}}
                          />
                        </View>

                        <View
                          style={{
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              ...FONTS.h4,
                              fontWeight: '800',
                            }}>
                              {translate("Provinces")}
                          </Text>

                          <AppFormPicker
                            items={provinces}
                            icon
                            placeholder=""
                            name="province_id"
                            item_name="name"
                            item_value="id"
                            otherStyles={{marginTop: 5}}
                          />
                        </View>
                      </View>
                    ) : null}
                      <Text
                          style={{
                              marginVertical:10,
                              marginTop:15,
                              ...FONTS.h4,
                              fontWeight: '700',
                              backgroundColor: "#f6e5b7",
                              padding:10,
                              color:'#000'
                          }}>
                          {translate("editProfileAlert")}
                      </Text>
                    <AppCheckBox
                      title={translate("gstpstCheck")}
                      isChecked={isChecked}
                      setIsChecked={val => setIsChecked(val)}
                    />
                  </View>
                ) :null
                }

                <SubmitButton
                  title={translate('updateProfile')}
                  loading={state.loading}
                  otherStyles={{marginTop: 30}}
                />
                 <AppButton onPress={deleteAlert} otherStyles={{backgroundColor: "white",borderColor:"red",borderWidth:1}} textStyles={{color:"red"}} title={translate("DeleteAccount")}/>
              </AppForm>

              <View style={{height: 30}} />
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </BaseView>
      <RBSheet
        ref={refHome}
        height={350}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        <View
          style={{
            marginHorizontal: 15,
            paddingVertical: 10,
          }}>
          <AppForm
            enableReinitialize={true}
            initialValues={state.RegisterInitialValues}
            onSubmit={() => refHome.current?.close()}>
            <View
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: COLORS.gray,
                borderRadius: 5,
                height: 200,
              }}>
              <AppFormGooglePlacesInput
                placeholder="Home Address"
                name="home_address"
                onGetPlaceId={(val, place, crds, state) =>
                  setPlaceId(val, place, crds, state)
                }
              />
            </View>
            <SubmitButton title={'Save'} loading={state.loading} />
          </AppForm>
        </View>
      </RBSheet>
      <RBSheet
        ref={refOffice}
        height={350}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        <View
          style={{
            marginHorizontal: 15,
            paddingVertical: 10,
          }}>
          <AppForm
            enableReinitialize={true}
            initialValues={state.RegisterInitialValues}
            onSubmit={() => refOffice.current?.close()}>
            <View
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: COLORS.gray,
                borderRadius: 5,
                height: 200,
              }}>
              <AppFormGooglePlacesInput
                placeholder="Office Address"
                name="office_address"
                onGetPlaceId={(val, place, crds, state) =>
                  setOfficePlaceId(val, place, crds, state)
                }
              />
            </View>
            <SubmitButton title={'Save'} loading={state.loading} />
          </AppForm>
        </View>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
