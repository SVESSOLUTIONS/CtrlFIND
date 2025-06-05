import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddCategory,
  AppButton,
  AppHeader,
  BaseView,
  CategoriesList,
  RequestCategory,
} from '../../components';
import {COLORS} from '../../constants/theme';
import {
  getProviderCategories,
  setIsVisible,
} from '../../store/reducers/categories';
import {translate} from '../../multiLang/translation';
export const CategoriesScreen = () => {
  const dispatch = useDispatch();
  const {loaded, isVisible, isRequestVisible, providers_categories} =
    useSelector(state => state.categories);

  React.useEffect(() => {
    dispatch(getProviderCategories());
  }, []);
  return (
    <>
      <AppHeader title={translate('categoriesTitle')} />
      <BaseView styles={styles.container} loading={loaded}>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
          <View
            style={{
              paddingHorizontal: 15,
            }}>
            {providers_categories.map(item => (
              <CategoriesList title={item.name} key={item.id} />
            ))}
            <AppButton
              onPress={() => dispatch(setIsVisible(true))}
              title={translate('addCategory')}
              otherStyles={{marginTop: 25}}
            />
          </View>
        </ScrollView>
      </BaseView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <AddCategory onRequestCategory={() => {}} />
      </Modal>
      <Modal
        isVisible={isRequestVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <RequestCategory />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
