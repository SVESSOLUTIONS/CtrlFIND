import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {AppHeader, AppIcon, BaseView} from '../../components';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
const renderItems = (title, icon, onPress) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        marginTop: 20,
        backgroundColor: COLORS.white,
        height: 130,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <AppIcon icon={icon} size={50} color={COLORS.primary} />
      <Text
        style={{
          color: COLORS.primary,
          ...FONTS.h2,
          marginTop: 10,
          fontWeight: '700',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export const CategoryItemsScreen = ({navigation}) => {
  return (
    <>
      <AppHeader title={translate('itemsTitle')} />
      <BaseView styles={styles.container}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              paddingHorizontal: 15,
              marginTop: 10,
              paddingBottom: 20,
            }}>
            {renderItems(translate('products'), icons.products, () =>
              navigation.navigate('category_items_details', {
                item: {title: translate('products')},
              }),
            )}
            {renderItems(translate('services'), icons.services, () =>
              navigation.navigate('category_items_details', {
                item: {title: translate('services')},
              }),
            )}
          </View>
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
