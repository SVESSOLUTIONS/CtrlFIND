import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {AppIcon} from '..';
import {COLORS, FONTS} from '../../constants/theme';

export const AppSlider = ({
  title,
  rightIcon,
  rightText,
  leftText,
  leftIcon,
  rightIconColor = COLORS.primary,
  leftIconColor = COLORS.primary,
  minimumValue = 0,
  maximumValue = 50,
  step = 10,
  ...otherProps
}) => {
  const renderPoints = () => {
    if (step === 0) return [];
    const arry_percent = [];
    for (let i = minimumValue; i < maximumValue; i += step) {
      if (i > 0) {
        const percent = [i / maximumValue] * 100;
        arry_percent.push(percent);
      }
    }
    return arry_percent;
  };
  return (
    <View
      style={{
        borderBottomWidth: 2,
        borderBottomColor: COLORS.gray,
        paddingVertical: 5,
        marginTop: 10,
      }}>
      <Text style={{...FONTS.h3, fontWeight: '600', marginBottom: 10}}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {rightText ? (
          <Text
            style={{
              fontSize: 9,
            }}>
            {minimumValue}
          </Text>
        ) : (
          <AppIcon icon={leftIcon} color={leftIconColor} />
        )}

        <View style={{flex: 1, marginHorizontal: 15}}>
          <View style={{marginHorizontal: 10}}>
            <Slider thumbTintColor={COLORS.primary}
              style={{
                height: 40,
                marginHorizontal: -10,
              }}
              minimumValue={minimumValue}
              maximumValue={maximumValue}
              step={step}
              {...otherProps}
            />
            {renderPoints().map(percent => (
              <View
                style={[styles.points, {left: `${percent}%`}]}
                key={percent}
              />
            ))}
          </View>
        </View>
        {leftText ? (
          <Text
            style={{
              fontSize: 9,
            }}>
            {maximumValue}
          </Text>
        ) : (
          <AppIcon icon={rightIcon} color={rightIconColor} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  points: {
    height: 10,
    width: 2,
    position: 'absolute',
    top: 15,
    backgroundColor: COLORS.gray,
    zIndex: -10,
  },
});
