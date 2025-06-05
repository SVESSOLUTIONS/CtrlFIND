import React from 'react';
import {View, Text, Image} from 'react-native';
import helpers from '../../constants/helpers';
import {COLORS} from '../../constants/theme';

const SIZE = 100;
export const CustomCallout = ({item}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        width: SIZE,
        height: SIZE / 2,
        borderWidth: 2,
        borderColor: COLORS.primary,
        overflow: 'hidden',
      }}>
      <Text>{item?.name}</Text>
      {/* <Image
        source={{uri: helpers.get_image(img)}}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: SIZE / 2,
        }}
      /> */}
    </View>
  );
};
