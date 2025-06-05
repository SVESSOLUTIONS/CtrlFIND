import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS} from '../../constants/theme';
import {setInformation} from '../../store/reducers/appointments';
import {translate} from "../../multiLang/translation";

const HEIGHT = 90;

export const AppointmentConfirmationTrack = () => {
  const dispatch = useDispatch();
  const {appointment_initial_values} = useSelector(state => state.appointments);

  return (
    <View style={{flexDirection: 'row', marginTop: 15, width: '100%'}}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <AppIcon icon={icons.clock} size={25} color={COLORS.primary} />
        <View
          style={{
            width: 2,
            height:
              HEIGHT +
              appointment_initial_values?.appointment_time?.length * 14,
            backgroundColor: '#9E9E9E',
          }}
        />
        <AppIcon icon={icons.addresses} size={25} color={COLORS.primary} />
        <View style={{width: 2, height: HEIGHT, backgroundColor: '#9E9E9E'}} />
        <AppIcon icon={icons.about} size={25} color={COLORS.primary} />
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginLeft: 10,
          flex: 1,
        }}>
        <View
          style={{
            height:
              HEIGHT +
              25 +
              appointment_initial_values?.appointment_time?.length * 14,
            marginTop: 5,
            overflow: 'hidden',
          }}>
          <Text style={{color: COLORS.black, fontWeight: '600', fontSize: 15}}>{translate("confirmedFor")}</Text>
          <Text
            style={{
              color: COLORS.gray,
              fontSize: 15,
              fontWeight: 'bold',
              marginTop: 5,
            }}>
            {appointment_initial_values?.appointment_date}
          </Text>
          <Text
            style={{
              color: COLORS.gray,
              fontSize: 15,
              fontWeight: 'bold',
              marginTop: 5,
            }}>
            {typeof appointment_initial_values?.appointment_time == 'object'
              ? appointment_initial_values?.appointment_time?.map(
                  (i, index) => (
                    <Text key={index}>
                      <Text
                        style={{
                          color: COLORS.primary,
                        }}>
                        {index + 1}
                      </Text>
                      <Text>{'-' + i + '\n'}</Text>
                    </Text>
                  ),
                )
              : appointment_initial_values?.appointment_time}
          </Text>
        </View>
        <View
          style={{
            height: HEIGHT + 25,
            overflow: 'hidden',
          }}>
          <Text
            style={{
              color: COLORS.black,
              fontWeight: '600',
              fontSize: 15,
            }}>
            {appointment_initial_values?.pickup &&
            appointment_initial_values?.delivery
              ? 'Picked up & Delivered by the provider from this location'
              : appointment_initial_values?.pickup
              ? 'Pickup up by the provider from this location'
              : appointment_initial_values?.delivery
              ? 'Delivered by the provider to this location'
              : 'Location at'}
          </Text>

          <Text
            style={{
              color: '#393A49',
              fontSize: 14,
              marginTop: 5,
            }}>
            {appointment_initial_values?.address}
          </Text>
        </View>

        <Text
          style={{
            color: COLORS.black,
            fontWeight: '600',
            fontSize: 15,
          }}>
          Additional Information
        </Text>

        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={val => dispatch(setInformation(val))}
          value={appointment_initial_values?.information}
          placeholder={translate("elaborateYourIssue")}
          style={{
            backgroundColor: COLORS.white,

            height: 100,
            marginTop: 5,
            color: COLORS.black,
            textAlignVertical: 'top',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            borderColor: COLORS.gray,
          }}
        />
      </View>
    </View>
  );
};
