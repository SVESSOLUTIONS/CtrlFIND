import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppHeader, AppWebView, BaseView} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {getPage} from '../../store/reducers/pages';

export const AddressesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, addresses,contactUs} = useSelector(state => state.pages);

  useEffect(async () => {
    let lang = 'en';
    let lng = await AsyncStorage.getItem('language');
    if (lng !== null) {
      lang = lng;
    }
    dispatch(getPage('contact-us?lang=' + lang));
  }, []);

  return (
    <>
      <AppHeader title={translate('contactUsTitle')} isMenu />
      <BaseView styles={styles.container} loading={loading}>
        <AppWebView html={contactUs?.body} />
        <View style={{height: 40}} />
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
});
