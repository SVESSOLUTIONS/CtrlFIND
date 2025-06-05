import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabContent} from './TabContent';
import {ContactsScreen, AddressesScreen, ReviewsScreen} from '../screens';
import {ItemsStack, ShopStack} from './stackNavigation';
import helpers from '../constants/helpers';
import AuthContext from '../context/AuthContext';
import {translate} from '../multiLang/translation';

const Tab = createBottomTabNavigator();

export const HomeScreen = () => {
  const {user} = React.useContext(AuthContext);

  function redirectToUserRole() {
    if (helpers.getRole(user.role_id) === helpers.SERVICE_PROVIDER)
      return ShopStack;
    else return ItemsStack;
  }

  return (
    <Tab.Navigator
      initialRouteName="items"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabContent {...props} />}>
      <Tab.Screen
        name="contacts"
        component={ContactsScreen}
        options={{
          title: translate('aboutTitle'),
        }}
      />

      <Tab.Screen
        name="addresses"
        component={AddressesScreen}
        options={{
          title: translate('contactUsTitle'),
        }}
      />
      <Tab.Screen
        name="items"
        component={redirectToUserRole()}
        options={{
          title: translate('items'),
        }}
      />
      {/* <Tab.Screen
        name="about"
        component={AboutScreen}
        options={{
          title: 'About',
        }}
      /> */}
      <Tab.Screen
        name="reviews"
        component={ReviewsScreen}
        options={{
          title: translate('reviews'),
        }}
      />
    </Tab.Navigator>
  );
};

export const GuestBottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="items"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabContent {...props} />}>
      <Tab.Screen
        name="items"
        component={ItemsStack}
        options={{
          title: 'Items',
        }}
      />
      <Tab.Screen
        name="contacts"
        component={ContactsScreen}
        options={{
          title: 'Contact Us',
        }}
      />
    </Tab.Navigator>
  );
};
