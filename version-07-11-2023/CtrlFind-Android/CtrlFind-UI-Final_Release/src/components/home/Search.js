import React from 'react';
import {View, TextInput} from 'react-native';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS} from '../../constants/theme';

export const Search = ({iconSize = 22, otherStyles, ...otherProps}) => {
  return (
    <View
      style={[
        {
          height: 50,
          backgroundColor: COLORS.white,
          alignItems: 'center',
          flexDirection: 'row',
          width: '92%',
          alignSelf: 'center',
          position: 'absolute',
          bottom: -25,
          borderRadius: 5,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: COLORS.gray,
          zIndex: 10,
        },
        otherStyles,
      ]}>
      <TextInput
        style={{height: 50, flex: 1, paddingLeft: 15}}
        {...otherProps}
      />
      <View style={{marginHorizontal: 20}}>
        <AppIcon icon={icons.search} size={iconSize} color={COLORS.gray} />
      </View>
    </View>
  );
};
