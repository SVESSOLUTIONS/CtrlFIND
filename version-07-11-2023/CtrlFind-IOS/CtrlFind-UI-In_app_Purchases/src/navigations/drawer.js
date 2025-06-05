import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './drawerContent';
import {CartScreen, FaqScreen} from '../screens';
import {HomeScreen} from './bottomTab';
import {
  BuyerAppointmentsStack,
  BuyerOrdersStack,
  ChatStack,
  NotificationStack,
  ProfileStack,
  ProviderAppointmentsStack,
  ShopStack,
  SubscriptionStack,
} from './stackNavigation';
import AuthContext from '../context/AuthContext';
import helpers from '../constants/helpers';
import useLocation from '../hooks/useLocation';
import localStorage from '../server/localStorage';
import server from '../server/server';
import navigation from './rootNavigator';
import {PrivacyScreen} from "../screens/root/Privvacy";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  const {getLocationUpdates, removeLocationUpdates} = useLocation();
  const {user, trigger} = React.useContext(AuthContext);

  useEffect(() => {
    if (helpers.getRole(user.role_id) === helpers.SERVICE_PROVIDER) {
      if (user?.is_tracking) {
        getLocationUpdates();
      } else {
        removeLocationUpdates();
      }
    }
  }, [user?.is_tracking]);

  useEffect(() => {
    checkForPushToken();
  }, []);

  useEffect(() => {
    if (helpers.isProfileIsNotComplete(user)) {
      trigger.setRoute('profile');
      navigation.navigate('profile');
    }
  }, []);

  const checkForPushToken = async () => {
    const pushToken = await localStorage.getPushToken();
    console.log('This is from drawer ' + pushToken);
    if (!user?.push_token || user?.push_token !== pushToken) {
      console.log(pushToken);
      await server.updateDeviceToken({
        push_token: pushToken,
      });
    }
  };

  const checkUserRole = () => {
    if (helpers.getRole(user.role_id) === helpers.SERVICE_PROVIDER) {
      return user.is_subscribed ? 'home' : 'subscriptions';
    }
    if (helpers.getRole(user.role_id) === helpers.BUYER) {
      if (helpers.isProfileIsNotComplete(user)) {
        trigger.setRoute('profile');
        return 'profile';
      }
    } else {
      return 'home';
    }
  };
  return (
    <Drawer.Navigator
      initialRouteName={checkUserRole()}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="home" component={HomeScreen} />
      <Drawer.Screen
        name="appointments"
        component={ProviderAppointmentsStack}
      />
      <Drawer.Screen
        name="buyer_appointments_stack"
        component={BuyerAppointmentsStack}
      />
      <Drawer.Screen name="buyerOrders" component={BuyerOrdersStack} />
      <Drawer.Screen name="notifications" component={NotificationStack} />
      <Drawer.Screen name="profile" component={ProfileStack} />
      <Drawer.Screen name="shop" component={ShopStack} />
      <Drawer.Screen name="basket" component={CartScreen} />
      <Drawer.Screen name="subscriptions" component={SubscriptionStack} />
      <Drawer.Screen name="faqs" component={FaqScreen} />
      <Drawer.Screen name="chat" component={ChatStack} />
      <Drawer.Screen name="privacy" component={PrivacyScreen} />
    </Drawer.Navigator>
  );
};
