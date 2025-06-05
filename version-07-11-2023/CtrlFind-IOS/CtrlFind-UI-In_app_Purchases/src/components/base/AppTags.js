import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';

export const AppTags = ({
  tag,
  tagonly = false,
  onPress,
  otherStyles,
  textStyles,
}) => {
  return (
    <View
      style={[
        {
          paddingVertical: 4,
          backgroundColor: COLORS.lightGray,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          borderColor: COLORS.gray,
          borderWidth: 1,
          marginHorizontal: 3,
          marginTop: 5,
        },
        otherStyles,
      ]}>
      <Text
        style={[
          {...FONTS.h3, color: '#666666', fontSize: 13, paddingRight: 10},
          textStyles,
        ]}>
        {tag}
      </Text>
      {!tagonly && (
        <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
          <AppIcon icon={icons.cancel} size={15} color={COLORS.gray} />
        </TouchableOpacity>
      )}
    </View>
  );
};
