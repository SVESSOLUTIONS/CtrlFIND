import React from 'react';
import {
  Pressable,
  View,
  Text,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {AppIcon} from '..';
import {COLORS} from '../../constants/theme';

const AppButton = ({
  title,
  onPress,
  icon,
  otherStyles,
  disabled,
  textStyles,
  loading = false,
  Righticon,
  iconStyles,
  leftIconStyles,
  iconColor,
  iconSize,
    addProduct,
}) => {
  return (
    <Pressable
      android_ripple={{color: 'rgba(255,255,255,0.3)'}}
      disabled={disabled ? disabled : loading}
      onPress={onPress}
      style={({pressed}) => [
        {
          opacity: pressed ? (Platform.OS === 'ios' ? 0.7 : 1) : 1,
        },
        {
          width: '100%',
          height: 50,
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 10,
          borderRadius: 50,
          backgroundColor: loading ? COLORS.gray : COLORS.primary,
        },
        otherStyles,
      ]}>
      {icon && (
        <View style={[{marginLeft: 20, marginRight: 10}, leftIconStyles]}>
          <Image
            source={icon}
            style={{height: 20, width: 20, tintColor: 'white'}}
          />
        </View>
      )}
      <Text
        style={[
          {
            fontWeight: 'bold',
            fontSize: 18,
            color: 'white',
            textAlign: !icon ? 'center' : null,
            flex: 1,
              includeFontPadding:false,
              padding:0,
          },
          textStyles,
        ]}>
        {title}
      </Text>
      {Righticon && (
        <View style={iconStyles}>
          <AppIcon icon={Righticon} size={iconSize} color={iconColor} />
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          right: 15,
        }}>
        <ActivityIndicator
          animating={!disabled && loading ? true : false}
          size="small"
          color={COLORS.white}
        />
      </View>
    </Pressable>
  );
};

export {AppButton};
