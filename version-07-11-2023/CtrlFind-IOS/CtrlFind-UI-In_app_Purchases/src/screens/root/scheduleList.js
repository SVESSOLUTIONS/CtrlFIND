import moment from 'moment';
import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList, ScrollView, TouchableOpacity, RefreshControl} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppGradientButton,
  AppHeader,
  AppNoDataFound,
  BaseView,
  LoadTemplate,
  ScheduleInfoCard,
} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
    onAddSchedule,
    onLoadTemplate, onPressDate,
    setIsVisible,
} from '../../store/reducers/schedule';
import {getProviderData} from "../../store/reducers/userItems";
import {useIsFocused} from "@react-navigation/native";

export const ScheduleListScreen = ({navigation, route}) => {
    const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const {isVisible, schedules, initial_loading} = useSelector(
    state => state.schedule,
  );

    // const onRefresh = React.useCallback(() => {
    //     setRefreshing(true);
    //     wait(2000).then(() => setRefreshing(false));
    // }, []);

    const isFocused=useIsFocused();
    const {date} = route?.params;

    // useEffect(()=>{
    //     console.log("asdfgh",moment(schedules[0]?.booking_date).format("YYYY-MM-DD"))
    //     dispatch(onPressDate(moment(schedules[0]?.booking_date).format("YYYY-MM-DD")))
    // },[isFocused])



  return (
    <>
      <AppHeader
        title={`${moment(date.dateString).format('D MMMM')} Schedule`}
        iconTitle={translate("loadTemplates")}
        onPressRight={() => dispatch(setIsVisible(true))}
      />
      <BaseView styles={styles.container} loading={initial_loading}>
          {console.log("schedules=======",JSON.stringify(schedules))}
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <FlatList
              // refreshControl={
              //     <RefreshControl
              //         refreshing={refreshing}
              //         onRefresh={onRefresh}
              //     />
              // }
            data={schedules}
            keyExtractor={item => item.id}
            renderItem={({item}) =>
                <ScheduleInfoCard item={item}  schedules={schedules}  date={date}   />
          }
            ListEmptyComponent={() => (
              <AppNoDataFound title={translate('noSchedule')} />
            )}
          />
        </View>
        <View style={{height: 100}} />
        <AppGradientButton
          onPress={() => dispatch(onAddSchedule())}
          title={translate('addScheduleTitle')}
        />
      </BaseView>

      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <LoadTemplate
          onClose={() => dispatch(setIsVisible(false))}
          onSave={template => {
            dispatch(setIsVisible(false));
            dispatch(onLoadTemplate(template));
            setTimeout(() => {
              navigation.navigate('add_schedule',{isEdit:false,id:""});
            }, 300);
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
});
