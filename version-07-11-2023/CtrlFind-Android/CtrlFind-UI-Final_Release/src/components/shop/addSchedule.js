import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppForm, AppFormInput, AppIcon, SubmitButton} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  createSchedule,
  setIsVisible,
  updateSchedule,
} from '../../store/reducers/schedule';
import {getProviderData} from '../../store/reducers/userItems';
import {addScheduleValidationSchema} from '../../validations';
import {AppFormPicker} from '../forms/AppFormPicker';

export const AddSchedule = () => {
  const dispatch = useDispatch();
  const {server_loading, isEdit, booking_date, scheduleInitialValues} =
    useSelector(state => state.schedule);
  const {provider_categories, loading} = useSelector(state => state.userItems);

  React.useEffect(() => {
    dispatch(getProviderData());
  }, []);

  const onSubmit = val => {
    Keyboard.dismiss();
    let values = {
      total_slots: val?.total_slots,
      category_id: val?.category_id,
      booking_date: booking_date,
    };
    if (!isEdit) {
      dispatch(createSchedule(values));
    } else {
      dispatch(updateSchedule({id: scheduleInitialValues?.id, values}));
    }
  };

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
            {isEdit ? translate('update') : translate('addNew')}{' '}
            {translate('schedule')}
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
              initialValues={scheduleInitialValues}
              enableReinitialize={isEdit}
              validationSchema={addScheduleValidationSchema()}
              onSubmit={onSubmit}>
              <AppFormInput
                placeholder={translate('totalSlots')}
                name="total_slots"
                keyboardType="decimal-pad"
              />
              {/* Category selection  */}
              {!isEdit && (
                <AppFormPicker
                  name="category_id"
                  placeholder={translate('selectCategory')}
                  icon
                  items={provider_categories}
                />
              )}
              <SubmitButton
                loading={server_loading}
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
