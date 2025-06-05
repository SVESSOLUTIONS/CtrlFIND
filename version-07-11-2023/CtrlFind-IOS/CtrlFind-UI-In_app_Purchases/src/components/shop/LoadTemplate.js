import React, {useEffect} from 'react';
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
import {AppForm, AppFormPicker, AppIcon, SubmitButton} from '..';
import {getTemplates} from '../../store/reducers/schedule';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';

const validationSchema = Yup.object().shape({
  template_id: Yup.string().required().label('Template'),
});
export const LoadTemplate = ({onClose, onSave}) => {
  const dispatch = useDispatch();
  const {server_loading, templates} = useSelector(state => state.schedule);
  useEffect(() => {
    dispatch(getTemplates());
  }, []);

  const onSubmit = val => {
    Keyboard.dismiss();
    const template = templates.find(item => item.id === val.template_id);
    onSave(template);
  };

  if (server_loading) {
    return (
      <View>
        <ActivityIndicator
          animating={server_loading}
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
            {translate('loadTemplate')}
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
                template_id: '',
              }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}>
              <View>
                <Text
                  style={{
                    ...FONTS.body3,
                    fontWeight: '600',
                  }}>
                  Select Template
                </Text>
                <AppFormPicker
                  name="template_id"
                  icon
                  placeholder="Select Template"
                  items={templates}
                  item_name="name"
                  item_value="id"
                />
              </View>
              <SubmitButton
                title="Load"
                otherStyles={{
                  marginTop: 30,
                }}
              />
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
