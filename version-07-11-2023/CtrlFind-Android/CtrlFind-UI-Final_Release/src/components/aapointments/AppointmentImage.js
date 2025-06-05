import React from 'react';
import {Image, View} from 'react-native';
import helpers from '../../constants/helpers';
import {COLORS, SIZES} from '../../constants/theme';

const size = SIZES.width / 3 - 20;

export const AppointmentImage = ({uri}) => {
  return (
    <View
      style={{
        height: size + 2,
        width: size + 2,
        borderColor: '#6B6B6B',
        borderWidth: 2,
        borderStyle: 'dotted',
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        marginTop: 10,
        marginRight: 8,
        overflow: 'hidden',
      }}>
      <Image
        style={{height: size, width: size}}
        source={{uri: helpers.get_image(uri)}}
      />
    </View>
  );
};
