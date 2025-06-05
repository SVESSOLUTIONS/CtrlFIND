import React from 'react';
import CountDown from 'react-native-countdown-component';
import {COLORS, FONTS} from '../../constants/theme';

export const CountDownComponent = ({id, onFinish, running = true, onPress}) => {
  return (
    <CountDown
      id={id}
      until={60}
      running={running}
      onFinish={onFinish}
      onPress={onPress}
      digitStyle={{backgroundColor: '#FFF'}}
      digitTxtStyle={{...FONTS.h4, color: COLORS.primary}}
      size={10}
      timeToShow={['S']}
      timeLabels={{m: null, s: null}}
    />
  );
};
