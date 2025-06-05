import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import {I18nManager} from 'react-native';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('./en.json'),
  fr: () => require('./fr.json'),
};
export const translate = memoize((key, config) => i18n.t(key, config));
// export const translate = text => {
//   console.log(i18n.t(text));
// };

export const setI18nConfig = lang => {
  // fallback if no available language fits
  const fallback = {languageTag: 'en', isRTL: false};

  const {isRTL, languageTag} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout directio
  // set i18n-js config
  //I18nManager.forceRTL(false);
  i18n.translations = {['en']: translationGetters.en()};
  i18n.locale = 'en';

  if (lang) {
    i18n.translations = {[lang]: translationGetters[lang]()};
    i18n.locale = lang;
  } else {
    i18n.translations = {['en']: translationGetters.en()};
    i18n.locale = 'en';
  }
};

export const changeLanguage = async lang => {
  setI18nConfig(lang);
};

export const isRTL = () => {
  return translate('lang') === 'ar' ? true : false;
};
