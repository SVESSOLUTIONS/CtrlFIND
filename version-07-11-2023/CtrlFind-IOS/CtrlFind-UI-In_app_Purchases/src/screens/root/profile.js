import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    AppForm,
    AppFormGooglePlacesInput,
    AppFormInput,
    AppGradientButton,
    AppHeader,
    AppIcon, AppNoDataFound,
    BaseView, ItemWriteReview,
    SubmitButton,
} from '../../components';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import useAuth from '../../hooks/useAuth';
import {translate} from '../../multiLang/translation';
import {addItemreview} from "../../store/reducers/buyerDashboard";
import {ItemReview} from "../../components/home/ItemReview";
import {useDispatch} from "react-redux";
import localStorage from "../../server/localStorage";
import axios from "axios";
import {baseURL} from "../../server/baseUrl";

const ModalHeight = 450;
const renderReviewInfo = (avg, total) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
      }}>
      <Text
        style={{
          ...FONTS.h2,
        }}>
        {translate('reviews')}
      </Text>
      <View
        style={{
          width: 130,
          height: 30,
          backgroundColor: '#F2F2F2',
          borderRadius: 22,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          borderColor: '#969696',
          borderWidth: 1,
          marginTop: 10,
        }}>
        <Text style={{...FONTS.h3, fontWeight: 'bold'}}>{avg}</Text>
        <Image
          source={icons.reviews}
          style={{width: 18, height: 18, tintColor: '#000c7f'}}></Image>
        <Text style={{color: '#969696'}}>({total})</Text>
      </View>
    </View>
  );
};
const renderBalanceInfo = (total_orders, avg_rating, total_rating) => {
  return (
    <View
      style={{
        width: '100%',
        height: 100,
        backgroundColor: '#E4F1F2',
        borderRadius: 15,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
      }}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          borderRightWidth: 1,
          borderRightColor: COLORS.gray,
          height: 70,
          justifyContent: 'center',
        }}>
        {/* <Text style={{...FONTS.h2, fontWeight: 'bold'}}>$140:00</Text>
        <Text style={{...FONTS.body4, color: COLORS.gray}}>Balance</Text> */}
        <View
          style={{
            width: 130,
            height: 30,
            backgroundColor: '#F2F2F2',
            borderRadius: 22,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            borderColor: '#969696',
            borderWidth: 1,
            marginTop: 10,
          }}>
          <Text style={{...FONTS.h3, fontWeight: 'bold'}}>{avg_rating}</Text>
          <Image
            source={icons.reviews}
            style={{width: 18, height: 18, tintColor: COLORS.active}}></Image>
          <Text style={{color: '#969696'}}>({total_rating})</Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          height: 70,
          justifyContent: 'center',
        }}>
        <Text style={{...FONTS.h2, fontWeight: 'bold'}}>{total_orders}</Text>
        <Text style={{...FONTS.body4, color: COLORS.gray}}>{translate('orders')}
        </Text>
      </View>
    </View>
  );
};
const renderUserInfo = (icon, info) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 10,
        width: '47%',
        paddingVertical: 5,
      }}>
      <AppIcon icon={icon} size={15} color={COLORS.black} />
      <Text
        style={{...FONTS.body4, lineHeight: 14, fontSize: 12, marginLeft: 7}}>
        {info}
      </Text>
    </View>
  );
};

const RenderAddress = ({
  onEditAddress,
  onDeleteAddress,
  label,
  address,
  icon,
  edit = false,
}) => {
  return (
    <View
      style={{
        marginVertical: 5,
        borderBottomColor: COLORS.lightGray,
        paddingBottom: 5,
        borderBottomWidth: 1,
      }}>
      <Text style={{...FONTS.h4, fontSize: 14, fontWeight: '700'}}>
        {label}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 5,
            width: '80%',
          }}>
          <AppIcon icon={icon} size={15} color={COLORS.black} />
          <Text
            style={{
              ...FONTS.body4,
              lineHeight: 14,
              fontSize: 12,
              marginLeft: 7,
            }}>
            {address}
          </Text>
        </View>
        {edit && (
          <TouchableOpacity
            style={{width: '10%', alignItems: 'flex-end'}}
            activeOpacity={0.7}
            onPress={onEditAddress}>
            <AppIcon icon={icons.pencil} size={15} color={COLORS.black} />
          </TouchableOpacity>
        )}
        {onDeleteAddress && (
          <TouchableOpacity
            style={{width: '10%', alignItems: 'flex-end'}}
            activeOpacity={0.7}
            onPress={onDeleteAddress}>
            <AppIcon icon={icons.trash} size={15} color={COLORS.black} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const renderAccountinfo = (name, avatar, role_id,) => {
  return (
    <View
      style={{
        width: '100%',
        height: 150,
        backgroundColor: COLORS.white,
      }}>
      <View
        style={{
          marginTop: 15,
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}>
        <View
          style={{
            backgroundColor: COLORS.gray,
            height: 80,
            width: 80,
            borderRadius: 40,
            marginRight: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.gray,
          }}>
          <Image
            source={{uri: helpers.get_image(avatar)}}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
            }}
          />
        </View>

        <View style={{marginTop: 10, flex: 1}}>

          <Text style={{color: COLORS.black, ...FONTS.h2}}>{name}</Text>
          <Text
            style={{
              color: COLORS.gray,
              ...FONTS.body5,
              lineHeight: 15,
              fontSize: 15,
            }}>
              {helpers.getRole(role_id)=="Buyer"?translate("buyer"):helpers.getRole(role_id)=="Service Provider"?translate("Serviceprovider"):translate("guest")}

          </Text>
            <View  style={{flexDirection:'row',alignItems: "center"}}>

                <Image
                    source={require("../../assets/verifiedIcon.png")}
                    style={{
                        height: 18,
                        width:  18,
                        resizeMode: "contain",
                    }}
                />
                <Text
                    numberOfLines={2}
                    style={{
                        ...FONTS.body4,
                        marginLeft:3,
                        color:  COLORS.primary,
                        fontSize: 11,
                    }}>
                    {translate("identityVerified")}
                </Text>
            </View>
        </View>
      </View>
    </View>
  );
};

export const ProfileScreen = ({navigation}) => {
  const [placeId, setPlaceId] = React.useState(null);
  const [isReviewExpended, setIsReviewExpended] = React.useState(true);
  const [reviewList, setReviewList] = React.useState([]);
  const {user} = React.useContext(AuthContext);
    const dispatch = useDispatch();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      get_profile();
    });
    return unsubscribe;
  }, [navigation]);

    React.useEffect(() => {
        get_Review();
    }, []);


    const get_Review  = async() => {

        let token = await localStorage.getToken();
        axios.get(baseURL+'/provider_reviews/'+user?.id, { headers: {"Authorization" : `Bearer ${token}`} })
            .then(function (response) {
                setReviewList(response.data)
                // console.log(response.data)

              // const reviewArrayList=[];
              // const reviewsList=[];
              //   const user=response?.data
              //
              //   user.forEach(array => {
              //       reviewArrayList.push(array.reviews);
              //   });
              //   // reviewArrayList.forEach(object=>{
              //   //     reviewsList.push(object)
              //   // })
              //
              //   reviewArrayList.map(item => { item.map(innerItem=>{ reviewsList.push(innerItem)})})
              //   setReviewList(reviewsList)
              //   console.log(reviewsList)
              //   // console.log(reviewArrayList)
              //   // setUser(user)
            })
            .catch(function (error) {
                alert(error.message);
            })
    };


  const {
    get_profile,
    AddAddress,
    UpdateAddress,
    updateAddressValues,
    editAddressState,
    deleteAddress,
    state,
    AddressessValidationSchema,
  } = useAuth();

  const onDeleteAddress = item => {
    Alert.alert(translate('deleteAddress'), translate('deleteAddressText'), [
      {
        text: translate('cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: translate('delete'),
        onPress: () => deleteAddress(item?.id),
        style: 'destructive',
      },
    ]);
  };

  const refRBSheet = useRef(null);

  const onAddAddress = v => {
    const values = {
      ...v,
      place_id: placeId,
    };
    refRBSheet.current?.close();
    state.isEditAddress
      ? setTimeout(() => {
          UpdateAddress(values?.id, values);
        }, 300)
      : setTimeout(() => {
          AddAddress(values);
        }, 300);
  };
  return (
    <>
      <AppHeader
          isProfile={true}
        title={translate('myProfile')}
        isMenu
        rightIcon={icons.userEdit}
        onPressRight={() => navigation.navigate('edit_profile')}
      />
        {console.log("user===user=="+JSON.stringify(user))}
      <BaseView styles={styles.container} loading={state.loading}>
        {renderAccountinfo(user.name, user.avatar, user.role_id)}
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{paddingBottom: 100}}>
          <View
            style={{
              paddingHorizontal: 20,
            }}>

            <View style={styles.flexRow}>
              {user.phone && renderUserInfo(icons.phone, user.phone)}
              {renderUserInfo(icons.email, user.email)}
              {user.address_home && (
                <RenderAddress
                    label={translate("homeaddress")}
                  address={user.address_home}
                  icon={icons.home}
                />
              )}
              {user.address_office && (
                <RenderAddress
                    label={translate("officeaddress")}

                  address={user.address_office}
                  icon={icons.pin}
                />
              )}
            </View>
            <View style={styles.flexRow}>
              {state.userExtra?.addresses.map(adrs => (
                <RenderAddress
                  label={adrs?.label}
                  address={adrs?.address_1}
                  icon={icons.addresses}
                  key={adrs?.id}
                  edit
                  onEditAddress={() => {
                    updateAddressValues({
                      id: adrs?.id,
                      label: adrs?.label,
                      address: adrs?.address_1,
                    });
                    setPlaceId(adrs?.place_id);
                    refRBSheet.current?.open();
                  }}
                  onDeleteAddress={() => onDeleteAddress(adrs)}
                />
              ))}
            </View>
              {/*{console.log("user======>",JSON.stringify(user))}*/}
            <View>
              {renderBalanceInfo(
                state.userExtra?.total_orders,
                helpers.getRating(state.userExtra?.rating?.avg),
                state.userExtra?.rating?.total,
              )
              }
            </View>
            <Text
              style={{
                ...FONTS.body4,
                lineHeight: 20,
                color: COLORS.gray,
                  marginBottom: 10
              }}>
              {user.about}
            </Text>
          </View>
            <View style={{marginHorizontal:10}}>
                {reviewList.length ? (
                    <ItemReview isProfile={true}
                        reviews={reviewList ? reviewList : []}
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
            </View>
        </ScrollView>

        {helpers.islimitExceeed(
          user?.is_subscribed?.['package'],
          'addresses',
          state.userExtra?.addresses.length ,
        ) ? null : (
          <AppGradientButton
            title={translate('addAddresses')}
            onPress={() => {
              editAddressState();
              refRBSheet.current?.open();
            }}
          />
        )}


        <RBSheet
          ref={refRBSheet}
          height={ModalHeight}
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
              initialValues={state.address}
              onSubmit={onAddAddress}>
              <AppFormInput
                placeholder={translate('label')}
                name="label"
                otherStyles={{marginTop: 20}}
              />
              <View
                style={{
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: COLORS.gray,
                  borderRadius: 5,
                  height: 250,
                }}>
                <AppFormGooglePlacesInput
                  placeholder={translate('location')}
                  name="address"
                  onGetPlaceId={val => setPlaceId(val)}
                />
              </View>
              <SubmitButton title={translate('save')} loading={state.loading} />
            </AppForm>
          </View>
        </RBSheet>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
