import React from 'react';
import {View, Text} from 'react-native';
import {COLORS} from '../../constants/theme';

const ErrorMessage = ({visible, error}) => {
  if (!visible || !error) return null;
  return (
    <View>
      <Text style={{color: COLORS.error}}>{error}</Text>
    </View>
  );
};

export {ErrorMessage};
