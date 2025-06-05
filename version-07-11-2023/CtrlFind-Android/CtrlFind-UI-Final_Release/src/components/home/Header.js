import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, TouchableOpacity, Image,Platform} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import images from '../../constants/images';
import {COLORS} from '../../constants/theme';

export const Header = ({hideMenu, onLogout}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: Platform.OS==="android"?130:160,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      {!hideMenu ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.toggleDrawer()}
          style={{marginTop: 20, marginHorizontal: 20}}>
          <AppIcon icon={icons.menu} size={22} color={COLORS.white} />
        </TouchableOpacity>
      ) : (
        onLogout && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onLogout}
            style={{marginTop: 20, marginHorizontal: 20}}>
            <AppIcon icon={icons.logout} size={22} color={COLORS.white} />
          </TouchableOpacity>
        )
      )}
      <View style={{marginTop: 20, marginRight: hideMenu ? 0 : 40, flex: 1, }}>
        <Image
          source={images.logo_header}
          style={{alignSelf: 'center', height: 120, width: 120,resizeMode:"contain",marginBottom:Platform.OS==="android"?25:15,marginRight:25}}
        />
      </View>
    </View>
  );
};
