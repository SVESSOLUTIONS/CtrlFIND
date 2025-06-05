import React from 'react';
import {View, TextInput} from 'react-native';
import {AppIcon} from '..';
import {COLORS} from '../../constants/theme';
const AppInput = ({otherStyles, inputStyles, icon, ...otherProps}) => {
  return (
    <View
      style={[
        {
          width: '100%',
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          borderColor: COLORS.gray,
          borderWidth: 1,
          borderRadius: 5,
          overflow: 'hidden',
          backgroundColor: 'white',
        },
        otherStyles,
      ]}>
      <TextInput
        multiline={true}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            color: COLORS.black,
            paddingHorizontal: 10,
          },
          inputStyles,
        ]}
        placeholderTextColor={COLORS.gray}
        {...otherProps}
      />
      {icon && (
        <View style={{marginRight: 10}}>
          <AppIcon icon={icon} color={COLORS.gray} size={16} />
        </View>
      )}
    </View>
  );
};

export {AppInput};
