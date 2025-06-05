import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddColors,
  AppGradientButton,
  AppHeader,
  BaseView,
  ColorsList,
} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  getColors,
  onAddColor,
  onEditColor,
} from '../../store/reducers/userAttributes';

export const ColorsScreen = () => {
  const dispatch = useDispatch();
  const {initialLoading, isVisible, colors} = useSelector(
    state => state.userAttributes,
  );

  React.useEffect(() => {
    dispatch(getColors());
  }, []);
  return (
    <>
      <AppHeader title={translate('colorsTitle')} />
      <BaseView styles={styles.container} loading={initialLoading}>
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          <View
            style={{
              paddingHorizontal: 15,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {colors?.map(item => (
              <ColorsList
                item={item}
                key={item.id}
                onPress={() => {
                  const isValidValue = item.value.includes('#');
                  let color = {
                    id: item.id,
                    label: item.label,
                    value: isValidValue ? item.value : '',
                  };
                  dispatch(onEditColor(color));
                }}
              />
            ))}
          </View>
        </ScrollView>
        <AppGradientButton
          onPress={() => dispatch(onAddColor())}
          title={translate('addColor')}
        />
      </BaseView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <AddColors />
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
