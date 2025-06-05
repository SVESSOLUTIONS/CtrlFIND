import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {addScheduleValidationSchema} from '../../validations';
import {
  AppFakeInput,
  AppForm,
  AppFormInput,
  AppFormPicker,
  AppHeader,
  AppFormGooglePlacesInput,
  BaseView,
  SubmitButton,
  TimePickerUi,
  AppTimePicker,
  AppButton,
  TimeSlot,
  SaveTemplate,
} from '../../components';
import RBSheet from 'react-native-raw-bottom-sheet';
import icons from '../../constants/icons';
import toast from '../../server/toast';
import moment from 'moment';
import {COLORS, FONTS} from '../../constants/theme';
import {useDispatch, useSelector} from 'react-redux';
import {getProviderData} from '../../store/reducers/userItems';
import {
  createSchedule,
  saveTemplate,
  SetArea,
  setClosingTiming,
  setOpeningTiming,
  setShowClosingTime,
  setShowOpeningTime,
  setSlotsData,
  setSlotsDataReset, updateSchedule,
} from '../../store/reducers/schedule';
import {translate} from '../../multiLang/translation';
import {useRoute} from "@react-navigation/native";

export const AddScheduleScreen = ({navigation,route}) => {
  const dispatch = useDispatch();
  const [showDialog, setIsShowDialog] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [formData, setFormData] = useState([]);
  const {isEdit} = route?.params;
  const {id} = route?.params;

  const {provider_categories, provider_employees, loading} = useSelector(
    state => state.userItems,
  );
  const {
    scheduleInitialValues,
    showOpeningTime,
    booking_date,
    server_loading,
    showClosingTime,
  } = useSelector(state => state.schedule);

  const areaRef = useRef();

  useEffect(() => {
    dispatch(getProviderData());
  }, []);

  const onSubmitCall = values => {
    Keyboard.dismiss();
    if (!scheduleInitialValues.area) {
      return toast.validation_error('area is a required field');
    }
    if (!scheduleInitialValues.opening_time) {
      return toast.validation_error('opening time is a required field');
    }
    if (!scheduleInitialValues.closing_time) {
      return toast.validation_error('closing time is a required field');
    }
    const open_time = scheduleInitialValues.opening_time.split(':');
    const close_time = scheduleInitialValues.closing_time.split(':');

    if (parseInt(open_time[0]) > parseInt(close_time[0])) {
      return toast.validation_error(
        'closing time should be greater then opening time.',
      );
    }
    if (parseInt(open_time[0]) == parseInt(close_time[0])) {
      if (parseInt(open_time[1]) >= parseInt(close_time[1])) {
        return toast.validation_error(
          'closing time should be greater then opening time.',
        );
      }
    }
    const startTimeString = `"04/09/2013 ${scheduleInitialValues.opening_time}:00"`;
    const closeTimeString = `"04/09/2013 ${scheduleInitialValues.closing_time}:00"`;
    const diffrernce = moment
      .utc(
        moment(closeTimeString, 'DD/MM/YYYY HH:mm:ss').diff(
          moment(startTimeString, 'DD/MM/YYYY HH:mm:ss'),
        ),
      )
      .format('HH:mm');
     // const slots = values.total_slots;

    let slotsTime = values.timing;
    if (values.timing_type === 'h') {
      slotsTime = convertH2M(values.timing + ':00');
    }
    const OpeningAndClosingTime = convertH2M(diffrernce);

    const total_slots = OpeningAndClosingTime / slotsTime;
    if (!total_slots) return;
    // if (parseInt(total_slots) !== parseInt(slots)) {
    //   return Alert.alert(
    //     translate('slotsError'),
    //     `Total slots with this schedule are ${total_slots}. which are not matched with your selected ${slots} slots.`,
    //     [
    //       {
    //         text: 'Ok',
    //         onPress: () => {},
    //         style: 'destructive',
    //       },
    //     ],
    //   );
    // }
    dispatch(setSlotsDataReset());
    const type = parseInt(open_time[0]) > 12 ? 'PM' : 'AM';
    let slots_data = [];
    let start_time = `${scheduleInitialValues.opening_time} ${type}`;
    for (let index = 0; index < total_slots; index++) {
      const date = moment(start_time, 'h:mm A')
        .add(slotsTime, 'minutes')
        .format('LT');
      slots_data.push(start_time + ' - ' + date);
      start_time = date;
    }
    dispatch(setSlotsData(slots_data));

    const formData = {
      ...values,
      total_slots:total_slots,
      area: scheduleInitialValues.area,
      area_lat: scheduleInitialValues.area_lat,
      area_lng: scheduleInitialValues.area_lng,
      opening_time: scheduleInitialValues.opening_time,
      closing_time: scheduleInitialValues.closing_time,
      slots_data: slots_data,
      booking_date: booking_date,
    };

    setFormData(formData);
    setIsShowDialog(true);
  };

  function convertH2M(timeInHour) {
    var timeParts = timeInHour.split(':');
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  }

  return (
    <>
      <AppHeader title={isEdit?translate("editSchedule"):translate('addScheduleTitle')} />
      <BaseView styles={styles.container} loading={loading}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{flex: 1, paddingHorizontal: 20}}>
            <AppForm
              initialValues={scheduleInitialValues}
              validationSchema={addScheduleValidationSchema()}
              onSubmit={onSubmitCall}>
              {/*<View style={{marginTop: 10}}>*/}
              {/*  <Text style={styles.title}>*/}
              {/*    {translate('noOfAppointments')}*/}
              {/*  </Text>*/}
              {/*  <AppFormInput*/}
              {/*    name="total_slots"*/}
              {/*    keyboardType="decimal-pad"*/}
              {/*    otherStyles={{*/}
              {/*      marginTop: 1,*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</View>*/}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{marginTop: 10, width: '48%'}}>
                  <Text style={styles.title}>{translate('slotTiming')}</Text>
                  <AppFormInput
                    name="timing"
                    keyboardType="decimal-pad"
                    otherStyles={{
                      marginTop: 1,
                    }}
                  />
                </View>
                <View style={{width: '48%', marginTop: 10}}>
                  <Text style={styles.title}></Text>
                  <AppFormPicker
                    name="timing_type"
                    placeholder="Type"
                    icon
                    items={[
                      {label: 'Minutes', value: 'm'},
                      {label: 'Hours', value: 'h'},
                    ]}
                    otherStyles={{
                      marginTop: 1,
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '48%'}}>
                  <TimePickerUi
                    title={translate('openingTime')}
                    icon={icons.clock}
                    onPress={() => dispatch(setShowOpeningTime(true))}
                    value={scheduleInitialValues?.opening_time}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <TimePickerUi
                      // disabled={true}
                    title={translate('closingTime')}
                    icon={icons.clock}
                    onPress={() => dispatch(setShowClosingTime(true))}
                    value={scheduleInitialValues?.closing_time}
                  />
                </View>
              </View>

              <View style={{marginTop: 10}}>
                <Text style={styles.title}>{translate('category')}</Text>
                <AppFormPicker
                  name="category_id"
                  placeholder=""
                  icon
                  items={provider_categories}
                  otherStyles={{
                    marginTop: 1,
                  }}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Text style={styles.title}>{translate('employee')}</Text>
                <AppFormPicker
                  item_name="name"
                  item_value="id"
                  name="employee_id"
                  placeholder=""
                  icon
                  items={provider_employees}
                  otherStyles={{
                    marginTop: 1,
                  }}
                />
              </View>
              <View style={{marginTop: 10}}>
                <Text style={styles.title}>{translate('area')}</Text>
                <AppFakeInput
                  onPress={() => areaRef.current?.open()}
                  title={scheduleInitialValues.area}
                  otherStyles={{
                    marginTop: 1,
                  }}
                />
              </View>

              <View style={{marginTop: 10}}>
                <Text style={styles.title}>{translate('radius')}</Text>
                <AppFormInput
                  name="radius"
                  keyboardType="decimal-pad"
                  otherStyles={{
                    marginTop: 1,
                  }}
                />
              </View>
              <View style={{marginTop: 20}}>
                <SubmitButton
                  title={isEdit?translate('update'):translate('yes')}
                  loading={server_loading}
                />
              </View>
            </AppForm>
          </View>
          <View style={{height: 20}} />
        </ScrollView>
      </BaseView>

      <RBSheet
        ref={areaRef}
        height={350}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        <View
          style={{
            marginHorizontal: 15,
            paddingVertical: 10,
          }}>
          <AppForm
            enableReinitialize={true}
            initialValues={scheduleInitialValues}
            onSubmit={() => areaRef.current?.close()}>
            <View
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: COLORS.gray,
                borderRadius: 5,
                height: 200,
              }}>
              <AppFormGooglePlacesInput
                placeholder="Area"
                name="area"
                onGetPlaceId={(_, discription, location) => {
                  dispatch(
                    SetArea({
                      address: discription,
                      lat: location?.lat,
                      lng: location?.lng,
                    }),
                  );
                }}
              />
            </View>
            <SubmitButton title={'Save'} />
          </AppForm>
        </View>
      </RBSheet>

      <Modal
        isVisible={showOpeningTime}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        style={{
          margin: 5,
        }}
        animationOutTiming={300}
        useNativeDriver>
        <AppTimePicker
          onClose={() => dispatch(setShowOpeningTime(false))}
          onTimeChange={val => {
            dispatch(setOpeningTiming(val));
            dispatch(setShowOpeningTime(false));
          }}
        />
      </Modal>
      <Modal
        isVisible={showClosingTime}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        style={{
          margin: 5,
        }}
        animationOutTiming={300}
        useNativeDriver>
        <AppTimePicker
          onClose={() => dispatch(setShowClosingTime(false))}
          onTimeChange={val => {
            dispatch(setClosingTiming(val));
            dispatch(setShowClosingTime(false));
          }}
        />
      </Modal>
      <Modal
        isVisible={showDialog}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <TimeSlot
          data={scheduleInitialValues.slots_data}
          onPressCancel={() => setIsShowDialog(false)}
          onPressConfirm={() => {
            // console.log("scheduleInitialValues.id=====",id)
            setIsShowDialog(false);
            {isEdit ?
              dispatch(updateSchedule({values:formData,id:id}))
                  :
              dispatch(createSchedule(formData));
            }

          }}
          onSaveTemplate={() => {
            setIsShowDialog(false);
            setTimeout(() => {
              setShowSaveTemplate(true);
            }, 1000);
          }}
        />
      </Modal>

      <Modal
        isVisible={showSaveTemplate}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <SaveTemplate
          data={scheduleInitialValues.slots_data}
          onClose={() => setShowSaveTemplate(false)}
          onSave={name => {
            setShowSaveTemplate(false);
            dispatch(
              saveTemplate({
                ...formData,
                name,
              }),
            );
          }}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  title: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
});
