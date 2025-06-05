import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// import VIForegroundService from '@voximplant/react-native-foreground-service';
import {useDispatch} from 'react-redux';
import localStorage from '../server/localStorage';
import {setCoordinates} from '../store/reducers/buyerDashboard';
import {userUpdateCoords} from '../store/reducers/orders';
import {translate} from "../multiLang/translation";

export default useLocation = () => {
  const dispatch = useDispatch();
  const [foregroundService, setForegroundService] = useState(false);
  const [observing, setObserving] = useState(false);
  const [forceLocation] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [highAccuracy] = useState(true);
  const [locationDialog] = useState(true);
  const [useLocationManager] = useState(false);

  const watchId = useRef(null);

  useEffect(() => {
    return () => {
      removeLocationUpdates();
    };
  }, [removeLocationUpdates]);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert(translate("Unableopensettings"));
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert(translate("Locationpermissiondenied"));
    }

    if (status === 'disabled') {
      Alert.alert(
        translate("TurnonLocationServices")+` "${appConfig.displayName}" `+translate("determineyourlocation"),
        '',
        [
          {text: translate("GotoSettings"), onPress: openSetting},
          {text: translate("DontUseLocation"), onPress: () => {}},
        ],
      );
    }
    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        localStorage.saveLocation({
          lat: latitude,
          lng: longitude,
        });
        dispatch(
          setCoordinates({
            lat: latitude,
            lng: longitude,
          }),
        );
      },
      error => {
        Alert.alert(translate("Code")+` ${error.code}`, error.message);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
  };

  // const startForegroundService = async () => {
  //   if (Platform.Version >= 26) {
  //     await VIForegroundService.createNotificationChannel({
  //       id: 'locationChannel',
  //       name: 'Location Tracking Channel',
  //       description: 'Tracks location of user',
  //       enableVibration: false,
  //     });
  //   }

  //   return VIForegroundService.startService({
  //     channelId: 'locationChannel',
  //     id: 420,
  //     title: appConfig.displayName,
  //     text: 'Tracking location updates',
  //     icon: 'ic_launcher',
  //   });
  // };

  // const stopForegroundService = useCallback(() => {
  //   VIForegroundService.stopService().catch(err => err);
  // }, []);

  const removeLocationUpdates = useCallback(() => {
    if (watchId.current !== null) {
      // stopForegroundService();
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setObserving(false);
    }
  }, []);

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    // if (Platform.OS === 'android' && foregroundService) {
    //   await startForegroundService();
    // }

    setObserving(true);

    watchId.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        dispatch(
          userUpdateCoords({
            lat: latitude,
            lng: longitude,
          }),
        );
      },
      error => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        distanceFilter: 100,
        interval: 10000,
        fastestInterval: 5000,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
        useSignificantChanges: significantChanges,
      },
    );
  };

  return {
    getLocation,
    hasLocationPermission,
    getLocationUpdates,
    removeLocationUpdates,
  };
};
