import React from 'react';
import {View, Text} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

export const PaymentMethodPicker = ({
  data,
  refRadio,
  setWorkAddress,
  activeWorkAddress,
  onClose,
}) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.white,
        borderRadius: 10,
      }}>
      <View>
        <View
          style={{
            paddingBottom: 10,
            borderBottomWidth: 3,
            borderBottomColor: COLORS.gray,
            marginTop: 10,
          }}>
          <Text
            style={{
              ...FONTS.h3,
              fontWeight: '600',
            }}>
            {translate('selectAddress')}
          </Text>
        </View>
        <RadioButtonRN
          ref={refRadio}
          data={data}
          initial={activeWorkAddress}
          selectedBtn={() => {}}
          boxStyle={{
            borderWidth: 0,
            marginTop: 5,
            paddingVertical: 5,
            paddingHorizontal: 0,
          }}
          circleSize={8}
          textColor={COLORS.gray}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginRight: 20,
        }}>
        <Text
          onPress={onClose}
          style={{
            ...FONTS.body4,
            fontWeight: '600',
            color: COLORS.primary,
            padding: 5,
          }}>
          {translate('thanks')}
        </Text>
        <Text
          onPress={() => {
            const selected_index = refRadio.current?.state.activeIndex;
            if (selected_index !== -1) {
              setWorkAddress(data[selected_index]?.label, selected_index + 1);
            }
          }}
          style={{
            marginLeft: 20,
            ...FONTS.body4,
            fontWeight: '600',
            color: COLORS.primary,
            padding: 5,
          }}>
          OK
        </Text>
      </View>
    </View>
  );
};
