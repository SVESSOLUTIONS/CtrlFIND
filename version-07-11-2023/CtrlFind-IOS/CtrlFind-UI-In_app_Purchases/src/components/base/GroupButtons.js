import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {MotiView} from 'moti';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

export const GroupButtons = ({title, onPress}) => {
  const products = title === 'Products' ? true : false;
  return (
    <View
      style={{
        height: 40,
        borderColor: COLORS.gray,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 20,
        flexDirection: 'row',
        width: 270,
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 10,
      }}>
      <MotiView
        animate={{
          right: !products ? 0 : 135,
        }}
        transition={{
          type: 'timing',
          duration: 100,
        }}
        style={{
          width: 134,
          backgroundColor:"#021242",
          borderRadius: 20,
          position: 'absolute',
          top: 0,
          bottom: 0,
        }}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress('Products')}
        style={{
          flex: 1,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>
        <Text
          style={{
            color: title === 'Products' ? COLORS.white : COLORS.black,
            fontSize: 15,
          }}>
          {translate('products')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => onPress('Services')}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: title === 'Services' ? '#014441' : COLORS.white,
          borderRadius: 20,
        }}>
        <Text
          style={{
            color: title === 'Services' ? COLORS.white : COLORS.black,
            fontSize: 15,
          }}>
          {translate('services')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
