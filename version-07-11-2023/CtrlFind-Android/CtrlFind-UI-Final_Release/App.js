import React, {useEffect, useState} from 'react';
import {LogBox, StatusBar, Alert} from 'react-native';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {DrawerNavigator} from './src/navigations';
import {AuthStack} from './src/navigations/stackNavigation';
import AuthContext from './src/context/AuthContext';
import {store} from './src/store';
import {navigationRef} from './src/navigations/rootNavigator';
import auth from './src/server/auth';
import localStorage from './src/server/localStorage';
import helpers from './src/constants/helpers';
import {GuestBottomTab} from './src/navigations/bottomTab';
import apis from './src/server/apis';
import {StripeProvider} from '@stripe/stripe-react-native';
import {changeLanguage, translate} from './src/multiLang/translation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [user, setUser] = useState(null);
  const [publishableKey, setPublishableKey] = useState('');
  const [activeRoute, setActiveRoute] = useState('home');

  async function checkApplicationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  }
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      localStorage.savePushToken(fcmToken);
    }
  };

  const handleLanguage = lang => {
    changeLanguage(lang);
    AsyncStorage.setItem('language', lang);
  };

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    initialize();
  }, []);

  const initialize = async () => {
    const lang = await AsyncStorage.getItem('language');
    if (lang !== null) {
      handleLanguage(lang);
    } else {
      handleLanguage('en');
    }

    // const unsubscribe = messaging().onMessage(async remoteMessage => {});
    // fetch key from server

    apis
      .get_stripe_key()
      .then(resp => setPublishableKey(resp.data))
      .catch(err => alert(JSON.stringify(err?.message ?? translate("Networkerror"))))
      .finally(() => {
        auth.me().then(res => {
          if (res.ok) {
            if (helpers.getRole(res.data.role_id) === helpers.SERVICE_PROVIDER)
              if (!res.data.is_subscribed) setActiveRoute('subscriptions');
            setUser(res.data);
          }

          setTimeout(() => {
            SplashScreen.hide();
          }, 500);

          setTimeout(async () => {
            await checkApplicationPermission();
            getFcmToken();
          }, 1000);
        });
      });
  };

  const trigger = React.useMemo(() => {
    return {
      updateUser: user => {
        setUser(user);
      },
      signout: () => {
        localStorage.removeToken().finally(() => setUser(null));
      },
        setRoute: r => {
        setActiveRoute(r);
      },
    };
  });
  return (
    <AuthContext.Provider value={{user, trigger, activeRoute}}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          {!user ? (
            <AuthStack />
          ) : helpers.getRole(user.role_id) === 'Guest' ? (
            <GuestBottomTab />
          ) : (
            <StripeProvider publishableKey={publishableKey}>
              <DrawerNavigator />
            </StripeProvider>
          )}
          <StatusBar hidden={false} />
          <Toast />
        </NavigationContainer>
      </Provider>
    </AuthContext.Provider>
  );
};

export default App;
