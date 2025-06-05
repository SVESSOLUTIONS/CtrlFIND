import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';

export const AppHeader = ({
  title,
  isMenu,
  onPressRight,
  onPressChat,
  rightIcon,
  iconTitle,
  subtitle,
  isBack = true,
  showCart = false,
  onPressBack,
  image,
  height = 80,
  iconSize = 20,
  iconColor = COLORS.white,
  shadow = true,
  loading = false,
    tagSearch=false,
    isProfile=false,
    onPressTags, tagTitle
}) => {
  const navigation = useNavigation();
  const {total_qty} = useSelector(state => state.cart);

  return (
    <View
      style={[
        {
          height,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 30,
          backgroundColor: COLORS.primary,
          flexDirection: 'row',
          alignItems: 'center',
        },
        shadow ? styles.shadow : null,
      ]}>
      <View style={{marginLeft: 5, marginRight: image ? 5 : 10}}>
        {!isMenu ? (
          <>
            {isBack ? (
              <TouchableOpacity
                style={styles.btnStyle}
                activeOpacity={0.7}
                onPress={() => {
                  onPressBack ? onPressBack() : navigation.goBack();
                }}>
                <AppIcon icon={icons.left} color={COLORS.white} />
              </TouchableOpacity>
            ) : null}
          </>
        ) : (
          <TouchableOpacity
            style={styles.btnStyle}
            activeOpacity={0.7}
            onPress={() => navigation.toggleDrawer()}>
            <AppIcon icon={icons.menu} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>
      {image && (
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.lightGray,
            marginRight: 10,
          }}>
          <Image
            source={{uri: image}}
            style={{height: 40, width: 40, borderRadius: 20}}
          />
        </View>
      )}
      <View style={{flex: 1}}>
        <Text
          numberOfLines={1}
          style={{
            ...FONTS.h3,
            color: COLORS.white,
            fontWeight: '600',
          }}>
          {title}
        </Text>
        {subtitle && (
          <Text
            numberOfLines={1}
            style={{
              ...FONTS.body4,
              fontSize: 10,
              lineHeight: 14,
              color: COLORS.white,
              marginLeft: 2,
            }}>
            {subtitle}
          </Text>
        )}
      </View>
      <View
        style={{
          marginLeft: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {showCart && (
          <>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                animating={loading}
                color="white"
                style={{marginRight: 15}}
              />
            ) : (
              <TouchableOpacity
                style={styles.btnStyle}
                activeOpacity={1}
                onPress={() => navigation.navigate('cart')}>
                <AppIcon
                  icon={icons.basket}
                  color={iconColor}
                  size={iconSize + 3}
                />
                <View style={styles.cartBtn}>
                  <Text style={styles.cartCount}>{total_qty}</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
        {onPressChat && (
          <>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                animating={loading}
                color="white"
                style={{marginRight: 15}}
              />
            ) : (
              <TouchableOpacity
                style={[
                  styles.btnStyle,
                  {
                    paddingHorizontal: iconTitle ? 5 : 10,

                  },
                ]}
                activeOpacity={1}
                onPress={onPressChat}>
                <AppIcon
                  icon={icons.chat}
                  color={COLORS.white}
                  size={iconSize}
                />
              </TouchableOpacity>
            )}
          </>
        )}
        {onPressRight && (
          <>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                animating={loading}
                color="white"
                style={{marginRight: 15}}
              />
            ) : (
              <TouchableOpacity
                style={[
                  styles.btnStyle,
                  {
                    paddingHorizontal: iconTitle ? 5 : 0,
                    marginRight:isProfile?13:10,
                  },
                ]}
                activeOpacity={1}
                onPress={onPressRight}>
                <AppIcon icon={rightIcon} color={iconColor} size={iconSize} />
              </TouchableOpacity>
            )}
          </>
        )}
        {iconTitle && (
          <TouchableOpacity activeOpacity={1} onPress={onPressRight}>
            <Text
              style={{
                ...FONTS.body4,
                fontWeight: '600',
                fontSize: 13,
                color: iconColor,
                marginLeft: 5,
                marginRight: 10,

              }}
              onPress={onPressRight}>
              {iconTitle}
            </Text>
          </TouchableOpacity>
        )}
        {tagSearch?
        <Text onPress={onPressTags} style={{color: "#fff",marginHorizontal:10}}>{tagTitle}</Text>
        :null
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartBtn: {
    position: 'absolute',
    top: 2,
    left: 5,
    backgroundColor: 'rgba(16,118,229,0.9)',
    width: 21,
    height: 21,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  cartCount: {
    ...FONTS.body4,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    color: COLORS.white,
  },
});
