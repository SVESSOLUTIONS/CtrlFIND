import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {AppButton, AppIcon, PaymentCard} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';

const data = [
  {
    id: 1,
    name: 'City World Banks',
    subtitle: '45*******54345',
    icon: icons.visa,
  },
  {
    id: 2,
    name: 'One Duty Banks',
    subtitle: '45*******54345',
    icon: icons.master_card,
  },
  {
    id: 3,
    name: 'Paypal',
    subtitle: '45*******54345',
    icon: icons.paypal,
  },
  {
    id: 4,
    name: 'Online Banking',
    subtitle: '45*******54345',
    icon: icons.bank,
  },
];

export const PaymentOptions = ({onPress}) => {
  const [selectedIndex, setSelectedIndex] = React.useState();
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 10,
      }}>
      <Text
        style={{
          ...FONTS.h3,
          marginVertical: 15,
        }}>
        Select Payment:
      </Text>
      {data.map(item => (
        <PaymentCard
          key={item.id}
          item={item}
          selectedIndex={selectedIndex}
          onPress={() => setSelectedIndex(item.id)}
        />
      ))}
      <AppButton title="Confirm" onPress={() => onPress(selectedIndex)} />
    </View>
  );
};
