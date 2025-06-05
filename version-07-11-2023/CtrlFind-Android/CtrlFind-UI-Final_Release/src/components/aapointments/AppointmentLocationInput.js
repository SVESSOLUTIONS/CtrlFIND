import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {GooglePlacesInput} from '../base/AppGooglePlacesInput';
export const LocationInput = ({
  location,
  headerTitle,
  value,
  onPress,
  header = true,
  children,
  ...otherProps
}) => {
  return (
    <View
      style={{
        borderColor: '#6B6B6B',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        padding: 15,
      }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          height: 100,
        }}>
        {header && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}>
            <Text style={{fontSize: 20}}>{headerTitle}</Text>
            <AppIcon icon={icons.addresses} size={30} color={COLORS.gray} />
          </View>
        )}
        <Text numberOfLines={3}>{value}</Text>
      </TouchableOpacity>
      {children}
    </View>
  );
};
