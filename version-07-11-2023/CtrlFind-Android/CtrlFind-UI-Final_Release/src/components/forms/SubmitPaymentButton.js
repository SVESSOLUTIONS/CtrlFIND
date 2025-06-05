import {useFormikContext} from 'formik';
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {COLORS, FONTS} from '../../constants/theme';
import {AppIcon} from '../base/AppIcon';

export const SubmitPaymentButton = ({
  title,
  onPress = () => {},
  icon,
  iconColor,
  txtColor,
  ...otherProps
}) => {
  const {handleSubmit} = useFormikContext();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        onPress();
        handleSubmit();
      }}
      style={{
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.gray,
        borderRadius: 10,
        marginTop: 10,
      }}
      {...otherProps}>
      <AppIcon  icon={icon} size={25} orgColor={iconColor} />
      <Text
        style={{
          ...FONTS.h3,
          fontSize: 15,
          fontWeight: '700',
          lineHeight: 16,
          marginLeft: 10,
          color: txtColor ? txtColor : COLORS.black,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
