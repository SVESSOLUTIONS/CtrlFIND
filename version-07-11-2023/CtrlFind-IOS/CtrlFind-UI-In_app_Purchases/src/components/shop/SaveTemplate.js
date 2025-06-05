import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Yup from 'yup';
import {AppForm, AppFormInput, AppIcon, SubmitButton} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
});
export const SaveTemplate = ({onClose, onSave}) => {
  const onSubmit = val => {
    Keyboard.dismiss();
    onSave(val.name);
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
            {translate('saveTemplate')}
          </Text>

          <TouchableOpacity activeOpacity={0.6} onPress={onClose}>
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
              initialValues={{
                name: '',
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}>
              <AppFormInput placeholder={'Name'} name="name" />
              <SubmitButton title="Save" />
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
