import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import CheckBox from 'react-native-check-box';
import {COLORS, FONTS} from '../../constants/theme';

export const AppCheckBox = ({
  isChecked,
  setIsChecked,
  title,
  ...otherProps
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => setIsChecked(!isChecked)}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 5,
        backgroundColor: isChecked ? COLORS.lightGray : COLORS.white,
        paddingVertical: 5,
      }}>
      <CheckBox
        style={{paddingRight: 10}}
        onClick={() => setIsChecked(!isChecked)}
        isChecked={isChecked}
        checkBoxColor="gray"
        checkedCheckBoxColor="black"
        {...otherProps}
      />
      <Text
        style={{
          ...FONTS.body4,
          flex: 1,
          fontWeight: '200',
          color: COLORS.black,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
