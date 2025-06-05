import React from 'react';
import {View, Text, Image} from 'react-native';
import Lightbox from 'react-native-lightbox';
import {COLORS, FONTS, SIZES} from '../../constants/theme';

export const AppLightBox = ({uri}) => (
  <>
    {!uri ? (
      <View
        style={{
          height: SIZES.width / 1.5,
          width: SIZES.width,
          backgroundColor: COLORS.lightGray,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{...FONTS.body4, color: COLORS.gray, letterSpacing: 5}}>
          No Image
        </Text>
      </View>
    ) : (
      <Lightbox>
        <Image
          style={{
            height: SIZES.width / 1.5,
            width: SIZES.width,
            marginTop: 0.3,
          }}
          source={{uri}}
        />
      </Lightbox>
    )}
  </>
);
