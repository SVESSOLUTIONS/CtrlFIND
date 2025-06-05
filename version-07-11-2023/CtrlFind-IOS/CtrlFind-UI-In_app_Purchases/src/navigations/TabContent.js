import React from 'react';
import {View, Text, Pressable} from 'react-native';
import InAppReview from 'react-native-in-app-review';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {AppIcon} from '../components';
import icons from '../constants/icons';
import {COLORS, FONTS} from '../constants/theme';
import {translate} from '../multiLang/translation';

export function TabContent({state, descriptors, navigation}) {
  return (
    <View style={{flexDirection: 'row', backgroundColor: COLORS.primary}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        // custom icons for tab

        const icon =
          options.title === 'Contact Us'
            ? 'contacts'
            : options.title === 'Addresses'
            ? 'addresses'
            : options.title === translate('items')
            ? 'home'
            : options.title === 'About'
            ? 'about'
            : 'reviews';

        // get foucs event

        const isFocused = state.index === index;

        const onPress = () => {
          if (route?.name === 'reviews') {
            if (InAppReview.isAvailable()) {
              InAppReview.RequestInAppReview()
                .then(hasFlowFinishedSuccessfully => {
                  if (hasFlowFinishedSuccessfully) {
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
            return;
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            android_ripple={{color: COLORS.lightGray, radius: 50}}
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: 60,
              backgroundColor: COLORS.primary,
              marginBottom: getBottomSpace(),
            }}>
            <AppIcon
              icon={icons[icon]}
              color={isFocused ? COLORS.white : COLORS.active}
              size={isFocused ? 22 : 20}
            />

            <Text
              numberOfLines={1}
              style={[
                {
                  color: isFocused ? COLORS.white : COLORS.active,
                  ...FONTS.h4,
                  fontSize: 12,
                },
              ]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
