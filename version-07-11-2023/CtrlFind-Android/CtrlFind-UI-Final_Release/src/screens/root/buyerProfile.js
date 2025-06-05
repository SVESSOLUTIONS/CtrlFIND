import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  AppButton,
  AppForm,
  AppFormGooglePlacesInput,
  AppFormInput,
  AppHeader,
  AppIcon,
  BaseView,
  SubmitButton,
} from '../../components';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import useAuth from '../../hooks/useAuth';
import {translate} from '../../multiLang/translation';
const ModalHeight = SIZES.height / 1.5;
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
            style={{width: 18, height: 18, tintColor: '#000c7f'}}></Image>
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
        <Text style={{...FONTS.body4, color: COLORS.gray}}>
          {translate('orders')}
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

const RenderAddress = ({onEditAddress, label, address, icon, edit = false}) => {
  return (
    <View
      style={{
        marginVertical: 5,
        borderBottomColor: COLORS.lightGray,
        paddingBottom: 5,
        borderBottomWidth: 1,
      }}>
      <Text style={{...FONTS.h4, fontWeight: '800'}}>{label}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 5,
            width: '90%',
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
            <AppIcon icon={icons.userEdit} size={20} color={COLORS.black} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const renderAccountinfo = (name, avatar, role_id) => {
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
        </View>
      </View>
    </View>
  );
};

export const BuyerProfileScreen = ({navigation}) => {
  const [placeId, setPlaceId] = React.useState(null);
  const {user} = React.useContext(AuthContext);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      get_profile();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    get_profile();
  }, []);

  const {
    get_profile,
    AddAddress,
    UpdateAddress,
    updateAddressValues,
    editAddressState,
    state,
    AddressessValidationSchema,
  } = useAuth();

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
        title={translate("myProfile")}
        isMenu
        rightIcon={icons.userEdit}
        onPressRight={() => navigation.navigate('edit_profile')}
      />
      <BaseView styles={styles.container} loading={state.loading}>
        {helpers.isProfileIsNotComplete(user) ? (
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: COLORS.error,
              padding: 5,
              borderRadius: 5,
            }}>
            <Text
              style={{
                ...FONTS.h3,
                fontWeight: 'bold',
                color: COLORS.white,
                textAlign: 'center',
              }}>
                {translate("Completeyourprofile")}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                fontSize: 10,
                color: COLORS.white,
                textAlign: 'center',
              }}>
              {user?.phone === null ? 'phone' : 'address' + ' is missing.'}
            </Text>
          </View>
        ) : null}
          {/*{console.log("buyeruser=="+JSON.stringify(user))}*/}
        {renderAccountinfo(user.name, user.avatar, user.role_id,user?.provice)}
        <ScrollView style={{flex: 1}}>
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
                  icon={icons.addresses}
                />
              )}
            </View>

            <View>
              {renderBalanceInfo(
                state.userExtra?.total_orders,
                state.userExtra?.rating?.avg,
                state.userExtra?.rating?.total,
              )}
            </View>
            <Text
              style={{
                ...FONTS.body4,
                lineHeight: 20,
                color: COLORS.gray,
                marginTop: 10,
              }}>
              {user.about}
            </Text>
            {/* {renderReviewInfo(
              state.userExtra?.rating?.avg,
              state.userExtra?.rating?.total,
            )} */}
            <View style={{height: 30}} />
          </View>
        </ScrollView>
        <View
          style={{
            width: '80%',
            alignSelf: 'center',
            paddingBottom: 10,
            marginBottom: getBottomSpace(),
          }}></View>
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
