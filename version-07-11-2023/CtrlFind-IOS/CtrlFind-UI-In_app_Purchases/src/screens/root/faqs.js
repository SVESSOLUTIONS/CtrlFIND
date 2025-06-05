import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppHeader, AppWebView, BaseView, FaqsList} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import server from '../../server/server';
import {getPage} from '../../store/reducers/pages';

export const FaqScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isExpended, setIsExpended] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('language').then(lng => {
      let lang = 'en';
      if (lng !== null) {
        lang = lng;
      }
      setLoading(true);
      server.get_faqs().then(resp => {
        setLoading(false);
        console.log(resp.data);
        if (!resp.ok) return;
        setFaqs(resp.data?.faqs);
      });
    });
  }, []);

  return (
    <>
      <AppHeader title={translate('faqsTitle')} isMenu />
      <BaseView styles={styles.container} loading={loading}>
        {/* <AppWebView html={faqs?.body} /> */}
        <FlatList
          data={faqs}
          renderItem={({item}) => (
            <FaqsList
              faq={item}
              isExpended={isExpended === item.id}
              onPress={() => setIsExpended(item.id)}
            />
          )}
        />
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
