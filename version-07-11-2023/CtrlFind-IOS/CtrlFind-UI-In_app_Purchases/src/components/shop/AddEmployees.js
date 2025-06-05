import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppForm, AppFormInput, AppIcon, AppImagePicker, SubmitButton} from '..';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  addEmployee,
  setIsVisible,
  updateEmployee,
} from '../../store/reducers/employees';

import {addEmployeeValidation} from '../../validations';

export const AddEmployees = () => {
  const dispatch = useDispatch();
  const {loading, isEdit, employeesInitialValues} = useSelector(
    state => state.employees,
  );

  const [image, setImage] = React.useState(employeesInitialValues?.image);

  const setAvatar = img => setImage(img);

  const onSubmit = val => {
    // if (!image) return alert('select employee img');
    Keyboard.dismiss();
    const values = {
      ...val,
      image,
    };
    !isEdit
      ? dispatch(addEmployee(values))
      : dispatch(updateEmployee({id: employeesInitialValues?.id, values}));
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

            {isEdit?translate("updateEmployee"):translate('addEmployee')}
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
              initialValues={employeesInitialValues}
              enableReinitialize={isEdit}
              validationSchema={addEmployeeValidation()}
              onSubmit={onSubmit}>
              <View style={{alignSelf: 'center'}}>
                <AppImagePicker
                  onPickImage={setAvatar}
                  image={helpers.get_image(image)}
                />
              </View>

              <AppFormInput placeholder={translate('name')} name="name" />
              <AppFormInput
                placeholder={translate('designation')}
                name="designation"
              />
              <AppFormInput
                name="phone"
                placeholder={translate('phone') + " (e.g.'+1–604–123–4567')"}
              />
              <AppFormInput placeholder={translate('email')} name="email" />
              <SubmitButton
                loading={loading}
                title={isEdit ? translate('update') : translate('done')}
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
