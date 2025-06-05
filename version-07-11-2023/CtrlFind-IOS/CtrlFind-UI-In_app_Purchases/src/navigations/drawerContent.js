import {DrawerContentScrollView} from '@react-navigation/drawer';
import React, {useEffect} from 'react';
import {version} from '../../package.json';
import {ifIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';
import {
  View,
  Text,
  Pressable,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import RNRestart from 'react-native-restart';
import icons from '../constants/icons';
import {COLORS, FONTS} from '../constants/theme';
import {AppButton, AppIcon} from '../components';
import AuthContext from '../context/AuthContext';
import helpers from '../constants/helpers';
import auth from '../server/auth';
import navigation from './rootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {changeLanguage, translate} from '../multiLang/translation';

export const DrawerContent = props => {
  const {trigger, activeRoute, user} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [language, setLanguage] = React.useState('');

  const ifUserIsNotSubscribed = r => {
    if (helpers.getRole(user.role_id) === helpers.SERVICE_PROVIDER) {
      if (!user.is_subscribed) {
        if (r === 'subscriptions' || r === 'faqs' || r === 'logout')
          return false;
        return true;
      }
    }
    if (helpers.getRole(user.role_id) === helpers.BUYER) {
      if (helpers.isProfileIsNotComplete(user)) {
        if (r === 'profile' || r === 'faqs' || r === 'logout') return false;
        return true;
      }
    }
    return false;
  };

  const onSwitchUser = () => {
    setLoading(true);
    auth.switchUser().then(resp => {
      setLoading(false);
      if (!resp.ok) return;
      else {
        trigger.updateUser(resp.data);
        if (helpers.getRole(resp.data.role_id) === helpers.SERVICE_PROVIDER) {
          if (resp.data.is_subscribed) {
            trigger.setRoute('home');
            navigation.navigate('home');
          } else {
            trigger.setRoute('subscriptions');
            navigation.navigate('subscriptions');
          }
          return;
        }
        if (helpers.getRole(resp.data.role_id) === helpers.BUYER) {
          if (helpers.isProfileIsNotComplete(resp.data)) {
            trigger.setRoute('profile');
            navigation.navigate('profile');
          } else {
            trigger.setRoute('home');
            navigation.navigate('home');
          }
          return;
        } else {
          trigger.setRoute('home');
          navigation.navigate('home');
        }
      }
    });
  };
  const renderAccountinfo = () => {
    return (
      <View
        style={{
          height: 160,
          ...ifIphoneX(
            {
              marginTop: -55,
            },
            {
              marginTop: -5,
            },
          ),
          backgroundColor: COLORS.drawer_bg,
        }}>
        <View
          style={{
            marginTop: 15,
            padding: 15,
            flexDirection: 'row',
            position: 'absolute',
            alignItems: 'center',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: COLORS.drawer_bg,
          }}>
          <View
            style={{
              height: 80,
              width: 80,
              backgroundColor: COLORS.gray,
              borderRadius: 40,
              overflow: 'hidden',
              marginRight: 10,
            }}>
            <Image
              source={{uri: helpers.get_image(user.avatar)}}
              style={{height: 80, width: 80}}
            />
          </View>

          <View style={{marginTop: 10, flex: 1}}>
            <Text style={{color: COLORS.black, ...FONTS.h2}}>{translate("Hey")}</Text>
            <Text
              style={{
                color: COLORS.black,
                ...FONTS.body5,
                lineHeight: 18,
                fontSize: 15,
              }}>
              {user.name}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMenuItem = props => {
    return helpers.getMenuItems(user.role_id).map(menu => (
      <Pressable
        disabled={ifUserIsNotSubscribed(menu.route)}
        android_ripple={{color: COLORS.primary}}
        onPress={() => {
          if (menu.route === 'logout') {
            navigation.closeDrawer();
            return trigger.signout();
          }
          trigger.setRoute(menu.route);
          navigation.navigate(menu.route);
        }}
        key={menu.title}
        style={({pressed}) => [
          {
            opacity: pressed ? (Platform.OS === 'ios' ? 0.7 : 1) : 1,
          },
          {
            padding: 10,
            borderRadius: 4,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: COLORS.lightGray,
            borderBottomWidth: 1,
            marginTop: 5,
          },
        ]}>
        <AppIcon
          icon={icons[menu.icon]}
          color={
            activeRoute === menu.route ? COLORS.primary : 'rgba(0,0,0,0.6)'
          }
        />

        <Text
          style={{
            flex: 1,
            marginLeft: 15,
            ...FONTS.h4,
            color:
              activeRoute === menu.route ? COLORS.primary : 'rgba(0,0,0,0.9)',
          }}>
          {translate(menu.title)}
        </Text>
        {ifUserIsNotSubscribed(menu.route) && (
          <AppIcon icon={icons.lock} color={COLORS.gray} size={10} />
        )}
      </Pressable>
    ));
  };

  useEffect(() => {
    checkForLang();
  }, []);

  const checkForLang = async () => {
    const lang = await AsyncStorage.getItem('language');
    if (lang) {
      setLanguage(lang);
    } else {
      setLanguage('en');
    }
  };
  const handleLanguage = async lang => {
    changeLanguage(lang);
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
    RNRestart.Restart();
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        style={{
          backgroundColor: COLORS.white,
        }}>
        {renderAccountinfo()}
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 15,
          }}>
          {renderMenuItem(props)}
        </View>
      </DrawerContentScrollView>
      <View style={{marginHorizontal: 20, marginBottom: 5}}>
        <Text
          style={{
            textAlign: 'right',
            ...FONTS.h4,
            color: 'rgba(0,0,0,0.3)',
            fontSize: 10,
          }}>
          v<Text>{version}</Text>
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.04)',
          paddingVertical: 20,
          paddingHorizontal: 5,
          marginBottom: getBottomSpace(),
          height: 170,
          alignItems: 'center',
        }}>
        <Text>{translate('switch')}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor:
                language === 'en' ? COLORS.primary : COLORS.secondary,
              width: 60,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
            }} disabled={language==='en'?true:false}
            onPress={() => {
              handleLanguage('en');
            }}>
            <Text
              style={{color: language === 'en' ? COLORS.white : COLORS.black}}>
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor:
                language === 'fr' ? COLORS.primary : COLORS.secondary,
              width: 60,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}
            disabled={language==='fr'?true:false}
            onPress={() => {
              handleLanguage('fr');
            }}>
            <Text
              style={{color: language === 'fr' ? COLORS.white : COLORS.black}}>
              French
            </Text>
          </TouchableOpacity>
        </View>
        <AppButton
          loading={loading}
          onPress={onSwitchUser}
          title={
            translate('switchTo') +
            `${
              helpers.getRole(user.role_id) === helpers.BUYER
                ? translate('provider')
                : translate('buyer')
            }`
          }
        />
      </View>
    </View>
  );
};
