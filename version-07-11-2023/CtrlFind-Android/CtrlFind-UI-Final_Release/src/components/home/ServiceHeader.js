import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

export const ServiceHeader = ({
  onPressSort,
  onPressFilter,
  isSorted,
  onPressMap,
}) => {
  const {isFilter} = useSelector(state => state.buyerDashboard);
  const renderButton = (icon, title, onPress, isSorted) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
        <AppIcon
          icon={icon}
          color={isSorted ? COLORS.error : COLORS.primary}
          size={18}
        />
        <Text
          style={{
            ...FONTS.h3,
            fontWeight: '500',
            marginLeft: 5,
            fontSize: 14,
            color: isSorted ? COLORS.error : COLORS.primary,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        height: 50,
        backgroundColor: COLORS.lightGray,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
      }}>
      {onPressSort &&
        renderButton(icons.sort, translate('sort'), onPressSort, isSorted)}
      {onPressFilter &&
        renderButton(
          icons.filter,
          translate('filter'),
          onPressFilter,
          isFilter,
        )}
      {onPressMap && renderButton(icons.map, translate('map'), onPressMap)}
    </View>
  );
};
