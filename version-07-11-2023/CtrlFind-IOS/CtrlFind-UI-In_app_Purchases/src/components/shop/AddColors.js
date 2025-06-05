import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppButton, AppForm, AppFormInput, AppIcon, SubmitButton} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

import {
  addColor,
  removeColor,
  setIsVisible,
  updateColor,
} from '../../store/reducers/userAttributes';
import {addColorsValidationschema} from '../../validations';

export const AddColors = () => {
  const dispatch = useDispatch();
  const {loading, isEdit, colorInitialValues} = useSelector(
    state => state.userAttributes,
  );

  const onSubmit = val => {
    Keyboard.dismiss();
    let values = val;
    if (!val.value) {
      const value = val.label.split(' ').join('');
      values = {
        label: val.label,
        value: value.toLowerCase(),
      };
    }
    if (!isEdit) {
      dispatch(addColor(values));
    } else {
      dispatch(updateColor({id: colorInitialValues.id, values}));
    }
  };

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
            {translate('addColor')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => dispatch(setIsVisible(false))}>
            <AppIcon icon={icons.close} size={15} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 15, marginTop: 10}}>
          <View
            style={{
              marginTop: 10,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.lightGray,
            }}>
            <AppForm
              initialValues={colorInitialValues}
              enableReinitialize={isEdit}
              validationSchema={addColorsValidationschema()}
              onSubmit={onSubmit}>
              <AppFormInput
                placeholder={translate('colorName')}
                name="label"
                autoCapitalize="sentences"
              />
              <AppFormInput
                placeholder={translate('colorCode') + ' #aadd33'}
                name="value"
              />
              <SubmitButton
                loading={loading}
                title={isEdit ? translate('update') : translate('done')}
              />
              {isEdit && (
                <AppButton
                  onPress={() =>
                    Alert.alert(
                      translate('deleteColor'),
                      translate('deleteColorMsg'),
                      [
                        {
                          text: translate('delete'),
                          onPress: () =>
                            dispatch(removeColor({id: colorInitialValues.id})),
                          style: 'destructive',
                        },
                        {
                          text: translate('cancel'),
                          onPress: () => {},
                          style: 'cancel',
                        },
                      ],
                    )
                  }
                  loading={loading}
                  title={translate('delete')}
                  otherStyles={{
                    backgroundColor: COLORS.black,
                  }}
                />
              )}
              <View
                style={{
                  height: 20,
                }}
              />
            </AppForm>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
