import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddSizes,
  AppGradientButton,
  AppHeader,
  BaseView,
  SizesList,
} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  getSizes,
  onAddSize,
  onEditSize,
} from '../../store/reducers/userAttributes';

export const SizesScreen = () => {
  const dispatch = useDispatch();
  const {initialLoading, isVisible, sizes} = useSelector(
    state => state.userAttributes,
  );

  React.useEffect(() => {
    dispatch(getSizes());
  }, []);
  return (
    <>
      <AppHeader title={translate('sizesTitle')} />
      <BaseView styles={styles.container} loading={initialLoading}>
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          <View
            style={{
              paddingHorizontal: 15,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {sizes?.map(item => (
              <SizesList
                title={item.label}
                key={item.id}
                onPress={() => {
                  let size = {
                    id: item.id,
                    label: item.label,
                    value: '',
                  };
                  dispatch(onEditSize(size));
                }}
              />
            ))}
          </View>
        </ScrollView>
        <AppGradientButton
          onPress={() => dispatch(onAddSize())}
          title={translate('addNewSize')}
        />
      </BaseView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <AddSizes />
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
