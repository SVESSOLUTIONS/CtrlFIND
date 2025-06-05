import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Yup from 'yup';
import {AppForm, AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {AppFormInput} from '../forms/AppFormInput';
import {SubmitButton} from '../forms/SubmitButton';

const validationSchema = Yup.object().shape({
  note: Yup.string().required().label('Note'),
});

export const DeclineOrder = ({onClose, onSubmit}) => {
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
              {translate("declineOrder")}
          </Text>

          <TouchableOpacity activeOpacity={0.6} onPress={onClose}>
            <AppIcon icon={icons.close} size={15} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 15, marginTop: 10}}>
          <AppForm
            initialValues={{
              note: '',
            }}
            validationSchema={validationSchema}
            onSubmit={values => onSubmit(values)}>
            <AppFormInput
              placeholder="Note"
              name="note"
              inputStyles={{
                textAlignVertical: 'top',
                justifyContent: 'flex-start',
                height: 90,
              }}
              otherStyles={{
                marginTop: 20,
                height: 100,
              }}
              multiline={true}
              numberOfLines={4}
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
