import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {AppIcon} from '..';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import {useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {translate} from "../../multiLang/translation";
import AuthContext from "../../context/AuthContext";

const RenderUserInfo = ({icon, active, value}) => {
  if (!value) return null;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingVertical: 3,
      }}>
      <AppIcon
        icon={icon}
        size={15}
        color={active ? COLORS.white : COLORS.black}
      />
      <Text
        numberOfLines={2}
        style={{
          ...FONTS.body4,
          fontSize: 12,
          lineHeight: 20,
          marginLeft: 7,
          color: active ? COLORS.white : COLORS.gray,
          width: SIZES.width / 2 - 40,
        }}>
        {value}
      </Text>
    </View>
  );
};

const RenderReviewInfo = ({active, rating,extraStyle}) => {
  return (
    <View
      style={[{
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 1,
      },extraStyle]}>
      <Text
        style={{
          ...FONTS.h4,
          marginRight: 7,
          fontWeight: '600',
          color: active ? COLORS.white : COLORS.black,
        }}>
        {helpers.getRating(rating?.avg)}
      </Text>
      <AppIcon
        icon={icons.reviews}
        size={15}
        color={active ? COLORS.white : COLORS.primary}
      />
      <Text
        style={{
          ...FONTS.body4,
          marginLeft: 7,
          fontSize: 13,
          color: active ? COLORS.white : COLORS.gray,
        }}>
        ({rating?.total})
      </Text>
    </View>
  );
};

export const ServicesInfoCard = ({

  onPress,
  otherStyles,
  active,
  onPressIcon,
  item,

}) => {
    const navigation = useNavigation();
    const {user} = useContext(AuthContext);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        {
          backgroundColor: active ? COLORS.primary : COLORS.white,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: active ? COLORS.white : COLORS.gray,
        },
        otherStyles,
      ]}>

      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
        }}>
        <AppIcon icon={icons.date} color={COLORS.primary} size={15} />
        <Text
          style={{
            ...FONTS.body4,
            fontSize: 13,
            lineHeight: 15,
            marginLeft: 5,
            fontWeight: '300',
            color: COLORS.gray,
          }}>
          Appointment required
        </Text>
      </View> */}

      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
        }}>
        <View style={{flex: 1, paddingRight: 5}}>
            <TouchableOpacity
                disabled={helpers.getRole(user?.role_id)===helpers.GUEST?true:false}
                onPress={()=>{navigation.navigate("provider_profile",{id:item.id})}}>
          <Text
            style={{
              ...FONTS.h3,
              color: active ? COLORS.white : COLORS.primary,
              fontWeight: '500',
              marginBottom: 3,
            }}>
            {item?.name}
          </Text>
            </TouchableOpacity>
            <View  style={{flexDirection:'row',alignItems: "center"}}>

                <Image
                    source={require("../../assets/verifiedIcon.png")}
                    style={{
                        height: 20,
                        width:  20,
                       resizeMode: "contain",

                    }}
                />
                <Text
                    numberOfLines={2}
                    style={{
                        ...FONTS.body4,
                        marginLeft:4,
                        color:  COLORS.primary,
                        fontSize: 11,
                    }}>
                    {translate("identityVerified")}
                </Text>
            </View>
          <Text
            numberOfLines={2}
            style={{
              ...FONTS.body4,
              color: active ? COLORS.white : COLORS.gray,
              fontSize: 12,
              lineHeight: 15,
            }}>
            {item?.about}
          </Text>
        </View>
        <View style={{flex: 1}}>
            {item?.rating?
                <TouchableOpacity    disabled={helpers.getRole(user?.role_id)===helpers.GUEST?true:false} style={{marginBottom:10,flexDirection:'row'}} onPress={()=>{navigation.navigate("provider_profile",{id:item.id})}}>
          <RenderReviewInfo extraStyle={{borderWidth:1,padding:5,paddingHorizontal:13,borderRadius: 5,borderColor:COLORS.primary}} active={active} rating={item?.rating} />
                </TouchableOpacity>
                :null}
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <AppIcon
              icon={icons.pin}
              size={15}
              color={active ? COLORS.white : COLORS.black}
            />
            <Text
              style={{
                ...FONTS.body4,
                color: active ? COLORS.white : COLORS.gray,
                fontSize: 12,
                lineHeight: 15,
                fontWeight: '300',
                marginLeft: 7,
              }}>
              {helpers.getDistanceInKm(item?.distance)?.toLocaleString()} km
              away
            </Text>
          </View>
        </View>
      </View>
        {/*{console.log("item=====?>>",JSON.stringify(item))}*/}
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, paddingRight: 5}}>
          {/*<RenderUserInfo*/}
          {/*  active={active}*/}
          {/*  icon={icons.phone}*/}
          {/*  value={item?.phone}*/}
          {/*/>*/}
          <RenderUserInfo
            active={active}
            icon={icons.email}
            value={item?.email}
          />
        </View>
        <View style={{flex: 1, paddingRight: 5}}>
          <RenderUserInfo
            active={active}
            icon={icons.link}
            value={item?.website}
          />
          <RenderUserInfo
            active={active}
            icon={icons.addresses}
            value={
              item?.address_office ? item.address_office : item?.address_home
            }
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={onPressIcon}
        style={[
          styles.right_arrow,
          {
            backgroundColor: active ? COLORS.white : COLORS.primary,
            marginRight: 5,
          },
        ]}>
        <AppIcon
          icon={icons.right_arrow}
          size={20}
          color={active ? COLORS.primary : COLORS.white}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  right_arrow: {
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    right: 0,
  },
});
