import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {AppForm, AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  requestCategory,
  setIsRequestVisible,
} from '../../store/reducers/categories';
import {AppFormInput} from '../forms/AppFormInput';
import {SubmitButton} from '../forms/SubmitButton';

const validationSchema = Yup.object().shape({
  category_name: Yup.string().required().label('Category Name'),
});

export const RequestCategory = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.categories);

  if (loading) {
    return (
      <View>
        <ActivityIndicator
          animating={loading}
          color={COLORS.primary}
          size="large"
        />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <View
          style={{
            height: 50,
            backgroundColor: COLORS.primary,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.white,
              fontWeight: '500',
              flex: 1,
            }}>
            {translate('requestCategory')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => dispatch(setIsRequestVisible(false))}>
            <AppIcon icon={icons.close} size={15} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 15, marginTop: 10}}>
          <AppForm
            initialValues={{
              category_name: '',
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              dispatch(requestCategory(values));
            }}>
            <AppFormInput
              placeholder={translate('categoryName')}
              name="category_name"
            />
            <SubmitButton
              title={translate('submit')}
              otherStyles={{
                marginBottom: 20,
              }}
            />
          </AppForm>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
