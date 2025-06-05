import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppHeader, AppWebView, BaseView} from '../../components';
import helpers from '../../constants/helpers';
import {COLORS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {translate} from '../../multiLang/translation';
import {getPage} from '../../store/reducers/pages';

export const ContactsScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const dispatch = useDispatch();
  const {loading, contactUs,about} = useSelector(state => state.pages);

  useEffect(async () => {
    let lang = 'en';
    let lng = await AsyncStorage.getItem('language');
    if (lng !== null) {
      lang = lng;
    }
    console.log(lang);
    dispatch(getPage('about-us?lang=' + lang));
  }, []);

  return (
    <>
      <AppHeader
        title={translate('aboutTitle')}
        isMenu={helpers.getRole(user?.role_id) === helpers.GUEST ? false : true}
        isBack={helpers.getRole(user?.role_id) === helpers.GUEST ? false : true}
      />
      <BaseView styles={styles.container} loading={loading}>
        <AppWebView html={about?.body} />
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
