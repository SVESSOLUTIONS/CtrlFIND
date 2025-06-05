import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
    onAddSchedule,
    onDeleteSchedule,
    onScheduleEdit,
    onPressDate,
    setIsVisible
} from '../../store/reducers/schedule';

import {AppIcon} from '../base/AppIcon';
export const ScheduleInfoCard = ({item,schedules,updateScheduleList,date}) => {
  const dispatch = useDispatch();
  return (
    <View
      style={{
        paddingBottom: 15,
        borderBottomColor: '#9CA3AF',
        borderBottomWidth: 1,
        justifyContent: 'center',

      }}>
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            {/*{console.log("item=====",item)}*/}
        <Text
            onPress={()=>{
                { item?.booked_slots === 0 ?
                    dispatch(onScheduleEdit(item))
                : alert(translate("schedulealreadybooked"))
                }


            }}
            style={{
                ...FONTS.body4,
                color: "blue",
                alignSelf:"flex-end",
                marginVertical:10,

            }}>
            Edit
        </Text>
        <Text
            onPress={()=>{
                const id=item.id

                {
                    item?.booked_slots === 0 ?


                        dispatch(onDeleteSchedule({date, id})).unwrap().then((resp) => {
                            dispatch(onPressDate(date))

                        })
                            .catch((err) => {
                                console.log(err)
                            })

                        :
                        alert(translate("schedulealreadybooked"))
                }
            }}
            style={{
                ...FONTS.body4,
                color: "red",
                alignSelf:"flex-end",
                marginVertical:10,

            }}>
            Delete
        </Text>
        </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{...FONTS.h3, color: COLORS.primary, fontWeight: '900'}}>
          {item?.category?.name}
        </Text>
          {/*{console.log(JSON.stringify(date))}*/}
        <View
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderRadius: 5,
          }}>

          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.white,
            }}>
            {translate('totalSlots')}:{item?.total_slots}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text style={{...FONTS.body4, color: COLORS.gray, flex: 1}}>
          {translate('emp')}:{' '}
          <Text numberOfLines={1} style={{fontWeight: '600'}}>
            {item?.employee?.name}
          </Text>
        </Text>
        <Text style={{...FONTS.body4, marginRight: 5, color: COLORS.gray}}>
          {translate('bookedSlots')}:{item?.booked_slots}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        <Text style={{...FONTS.body4, color: COLORS.gray, flex: 1}}>
          {translate('area')}:{' '}
          <Text
            numberOfLines={1}
            style={{fontWeight: '600', fontSize: 12, lineHeight: 18}}>
            {item?.area}
          </Text>
        </Text>
        {/* <Text style={{...FONTS.body4, marginRight: 5, color: COLORS.gray}}>
          Radius:{item?.radius}
        </Text> */}
      </View>
      {/* <TouchableOpacity
        onPress={() => {
          dispatch(onEditSchedule(item));
          dispatch(setIsVisible(true));
        }}
        activeOpacity={0.7}
        style={{position: 'absolute', right: 5, bottom: 10}}>
        <AppIcon icon={icons.pencil} />
      </TouchableOpacity> */}
    </View>
  );
};
