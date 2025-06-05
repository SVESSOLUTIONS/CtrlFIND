import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {AppHeader, BaseView} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

export const ReviewsScreen = () => {
  return (
    <>
      <AppHeader title={translate('review')} isMenu />
      <BaseView styles={styles.container}>
        <ScrollView
          style={{flex: 1, marginTop: 15}}
          showsVerticalScrollIndicator={false}>
          <View style={{height: 40}} />
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  txt: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '300',
    marginRight: 5,
  },
});
