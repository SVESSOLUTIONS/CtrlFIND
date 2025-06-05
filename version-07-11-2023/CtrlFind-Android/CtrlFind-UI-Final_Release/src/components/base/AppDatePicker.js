import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import {COLORS, FONTS} from '../../constants/theme';
import icons from '../../constants/icons';
import {AppIcon} from '..';

export const AppDatePicker = ({title, value, setDate}) => {
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (_, selectedDate) => {
    const currentDate = selectedDate || value;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <TouchableOpacity
        onPress={showDatepicker}
        style={{
          width: '100%',
          flexDirection: 'row',
          backgroundColor: 'white',
          height: 50,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 5,
          marginTop: 3,
          alignItems: 'center',
        }}>
        {moment(value).format('DD-MM-YYYY') == '01-01-1970' ? (
          <Text
            style={{
              ...FONTS.body4,
              fontWeight: 'bold',
              fontSize: 12,
              color: COLORS.gray,
              marginLeft: 10,
              flex: 1,
            }}>
            {title ? title : moment(value).format('DD-MM-YYYY')}
          </Text>
        ) : (
          <Text
            style={{
              ...FONTS.body4,
              fontWeight: 'bold',
              fontSize: 12,
              color: COLORS.gray,
              marginLeft: 10,
              flex: 1,
            }}>
            {moment(value).format('DD-MM-YYYY')}
          </Text>
        )}

        <View
          style={{
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppIcon icon={icons.clock} size={20} color={COLORS.gray} />
        </View>
      </TouchableOpacity>
      {Platform.OS === 'ios' ? (
        <Modal
          isVisible={show}
          onBackdropPress={() => setShow(false)}
          animationOutTiming={300}
          hideModalContentWhileAnimating
          useNativeDriver
          style={{margin: 5}}
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 10,
              padding: 5,
            }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={value}
              mode={mode}
              is24Hour={true}
              display="inline"
              onChange={onChange}
            />
          </View>
        </Modal>
      ) : (
        <>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={value}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </>
      )}
    </View>
  );
};
