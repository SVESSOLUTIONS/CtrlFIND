import React from 'react';
import {View, Text, Switch} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';

export const AppSwitch = ({title, onValueChange, value, ...otherProps}) => {
  return (
    <View style={{flexDirection: 'row', marginTop: 15}}>
      <Text style={{flex: 1, ...FONTS.h3, fontWeight: '600'}}>{title}</Text>
      <Switch
          thumbColor={COLORS.primary}
        trackColor={{false: '#eeeeee', true: COLORS.gray}}
        onValueChange={onValueChange}
        value={value}
        {...otherProps}
      />
    </View>
  );
};
