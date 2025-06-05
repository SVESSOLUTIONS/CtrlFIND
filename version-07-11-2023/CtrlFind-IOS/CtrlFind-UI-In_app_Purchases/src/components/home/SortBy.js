import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {AppButton, AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {useSelector} from 'react-redux';
import labels from '../../constants/labels';

export const SortBy = ({onPress, type = 'providers', onClose}) => {
  const {providersSortIndex, itemsSortIndex} = useSelector(
    state => state.buyerDashboard,
  );
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        overflow: 'hidden',
        borderRadius: 5,
      }}>
      <View
        style={{
          height: 50,
          backgroundColor: COLORS.primary,
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.white,
            fontWeight: '500',
            flex: 1,
          }}>
          Sort By
        </Text>

        <TouchableOpacity
          activeOpacity={0.6}
          style={{paddingHorizontal: 10}}
          onPress={onClose}>
          <AppIcon icon={icons.close} size={15} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View>
        <RadioButtonRN
          box={false}
          data={labels.providerSortTitles}
          initial={type === 'providers' ? providersSortIndex : itemsSortIndex}
          selectedBtn={value => setSelectedValue(value)}
          circleSize={8}
          deactiveColor={COLORS.gray}
          style={{
            paddingVertical: 10,
          }}
          boxStyle={{
            paddingVertical: 10,
            marginHorizontal: 10,
            flexDirection: 'row-reverse',
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray,
          }}
          textStyle={{
            color: COLORS.gray,
          }}
        />
        <AppButton
          title="Done"
          onPress={() => onPress(selectedValue)}
          otherStyles={{
            width: '80%',
            alignSelf: 'center',
            marginBottom: 15,
          }}
        />
      </View>
    </View>
  );
};
