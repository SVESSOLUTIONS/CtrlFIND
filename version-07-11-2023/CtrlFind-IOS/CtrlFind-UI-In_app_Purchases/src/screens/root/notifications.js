import React, {useEffect, useState} from 'react';
import {View, Text, Switch, Alert, FlatList} from 'react-native';
import {
  AppHeader,
  AppNoDataFound,
  AppNotifications,
  BaseView,
} from '../../components';
import Modal from 'react-native-modal';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import localStorage from '../../server/localStorage';
import server from '../../server/server';
import toast from '../../server/toast';
import {DeclineOrder} from '../../components/notifications/DeclineOrder';
import AsyncStorage from "@react-native-async-storage/async-storage";


export const NotificationsScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [initiallLoading, setInitialLoading] = useState(false);
  const [isDecline, setIsDecline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);

  const [notifications, setNotifications] = useState([]);

  let lang = 'en';

  const getLanguage = async () =>
      await AsyncStorage.getItem('language').then(lng => {
        console.log('My Language=' + lng);
        if (lng !== null) {
          lang = lng;
        }
        console.log(lang);
      });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotifications();
      getLanguage();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getNotifications();
    getLanguage();
  }, []);

  const handleEnableNotifications = async isEnabled => {
    const url = 'https://cntrlfind.com/api/update_push_notification_setting?';
    let token = await localStorage.getToken();
    console.log("token="+token)
    const body = JSON.stringify({
      push_notification: isEnabled === true ? 1 : 0,
    });
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: body,
    };

    try {
      const response = await fetch(url, requestOptions).catch(error => {
        Alert.alert(translate("alert"), error.message);
      });
      const responseJson = await response.json();
      if (response.status === 200) {
        toast.enable_notifications_success(
          translate("Notificationswitched"),
        );
        await localStorage.saveNotificationSetting(isEnabled ? '1' : '0');
      } else {
        toast.enable_notifications_failed(translate("somethingwentwrong"));
      }
    } catch (error) {
      toast.enable_notifications_failed(translate("somethingwentwrong"));
    }
  };

  const getNotifications = async () => {
    const notification_setting = await localStorage.getNotificationSetting();
    setIsEnabled(notification_setting === '1' ? true : 0);
    const url = 'https://cntrlfind.com/api/notifications?lang='+lang;
    let token = await localStorage.getToken();
    const body = JSON.stringify({
      push_notification: isEnabled === true ? 1 : 0,
    });
    console.log("token"+token)
    console.log("url"+url)
    requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    try {
      setInitialLoading(true);
      const response = await fetch(url, requestOptions).catch(error => {
        Alert.alert(translate("alert")+ error.message);
      });
      const responseJson = await response.json();
      setInitialLoading(false);
      if (response.status === 200) {
        // alert("howa call"+JSON.stringify(responseJson.data))
        // console.log("token=="+token)
        setNotifications(responseJson.data);
         // console.log("jhfbjhsgfjgkjhgslgfsdfsgfiufh",responseJson.data);
      }
    } catch (error) {
      setInitialLoading(false);
      // toast.enable_notifications_failed('something went wrong');
    }
  };

  const onConfirmOrder = id => {
    setLoading(true);
    server.confirmOrder(id).then(resp => {
      setLoading(false);
      if (!resp.ok) return alert('error');
      getNotifications();
    });
  };

  const onDeclineOrder = values => {
    setLoading(true);
    server.declineOrder(id, values).then(resp => {
      setLoading(false);
      if (!resp.ok) return alert('error');
      getNotifications();
    });
  };

  const onCancelOrder = id => {
    setLoading(true);
    server.cancelOrder(id).then(resp => {
      setLoading(false);
      if (!resp.ok) return alert('error');
      getNotifications();
    });
  };

  return (
    <>
      <AppHeader title={translate('notificationsTitle')} isMenu={true} />
      <BaseView
        styles={{flex: 1}}
        loading={initiallLoading}
        overlayLoading={loading}>
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{marginLeft: 15, fontWeight: 'bold', color: COLORS.black}}>
            {translate('enableNotifications')}
          </Text>
          <Switch
            ios_backgroundColor={'#fff'}
            style={{alignSelf: 'center', marginRight: 10}}
            trackColor={{false: COLORS.white, true: '#fff'}}
            thumbColor={isEnabled ? COLORS.primary : COLORS.gray}
            onValueChange={() => {
              setIsEnabled(!isEnabled);
              handleEnableNotifications(!isEnabled);
            }}
            value={isEnabled}
          />
        </View>
        {console.log(JSON.stringify("notifications====",notifications))}
        <FlatList
            showsVerticalScrollIndicator ={false}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 10}}
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <AppNotifications
              notification={item}
              hrl={index === 0}
              onConfirmOrder={onConfirmOrder}
              onCancelOrder={onCancelOrder}
              onDeclineOrder={id => {
                setId(id);
                setIsDecline(true);
              }}
            />
          )}
          ListEmptyComponent={() => <AppNoDataFound title={translate("NoNotification")} />}
        />
      </BaseView>
      <Modal
        isVisible={isDecline}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <DeclineOrder
          onClose={() => setIsDecline(false)}
          onSubmit={values => {
            setIsDecline(false);
            onDeclineOrder(values);
          }}
        />
      </Modal>
    </>
  );
};
