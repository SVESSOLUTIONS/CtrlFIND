import React, {useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet} from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppHeader,
  DestinationMarker,
  OrderTrackingBottomCard,
  ProviderMarker,
} from '../../components';
import {DistanceMarker} from '../../components/map/DistanceMarker';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import keys from '../../constants/keys';
import {COLORS, SIZES} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  getProviderLocation,
  setProviderCoords,
} from '../../store/reducers/orders';

let TIMEOUT = 20000;
let LATITUDE_DELTA = 0.0922;
let LONGITUDE_DELTA = LATITUDE_DELTA * (SIZES.width / SIZES.height);

const EDGE_PADDING = {
  edgePadding: {top: 20, right: 50, bottom: SIZES.height / 2, left: 50},
};

export const TrackingOrderScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {mapOrderDetail, provider_coords} = useSelector(state => state.orders);
  const [isMapReady, setIsMapReady] = useState(false);
  const [distance, setDistance] = useState(null);
  const [center, setCenter] = useState(null);
  const [time, setTime] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [INITIAL_REGION] = useState({
    latitude: parseFloat(provider_coords?.lat),
    longitude: parseFloat(provider_coords?.lng),
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useEffect(() => {
    if (isMapReady) {
      const interval = setInterval(async () => {
        const resp = await dispatch(getProviderLocation(mapOrderDetail?.id));

        if (resp?.payload) {
          if (
            resp?.payload.lat == provider_coords?.lat &&
            resp?.payload.lng == provider_coords?.lng
          )
            return;
          const coords = {
            latitude: helpers.toFloat(resp?.payload.lat),
            longitude: helpers.toFloat(resp?.payload.lng),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          const data = await mapRef?.current.getCamera();

          const camera = {
            center: {
              latitude: helpers.toFloat(resp?.payload.lat),
              longitude: helpers.toFloat(resp?.payload.lng),
            },
            pitch: 0,
            heading: 0,
            zoom: data?.zoom,
          };
          if (Platform.OS === 'android') {
            markerRef.current?.animateMarkerToCoordinate(coords, TIMEOUT / 2);
            mapRef?.current.animateCamera(camera, {duration: TIMEOUT / 2});
            setTimeout(() => {
              dispatch(setProviderCoords(resp.payload));
            }, TIMEOUT / 2);
          } else {
            mapRef?.current.animateCamera(camera, {duration: 1000});
            dispatch(setProviderCoords(resp.payload));
            // INITIAL_REGION.timing(coords).start();
          }
        }
      }, TIMEOUT);
      return () => clearInterval(interval);
    }
  }, [isMapReady]);

  const onMapReady = () => {
    mapRef.current?.fitToSuppliedMarkers(
      ['provider', 'destination'],
      EDGE_PADDING,
    );
  };

  const onReadyMapDirection = async ({distance, duration, coordinates}) => {
    const center_nmbr = Math.floor(coordinates.length / 2);
    const center_coords = coordinates[center_nmbr];
    if (center_coords) {
      setCenter(center_coords);
    }
    setDistance(distance);
    setTime(duration);
    setIsMapReady(true);
  };

  if (!mapOrderDetail?.lat) {
    return null;
  }

  return (
    <>
      <AppHeader
        title={translate('trackingTitle')}
        isBack={false}
        subtitle={mapOrderDetail?.order_nr}
      />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        clusterColor={COLORS.primary}
        clusterTextColor={COLORS.white}
        onMapReady={onMapReady}
        onLayout={onMapReady}
        style={{flex: 1}}
        initialRegion={INITIAL_REGION}>
        <MapViewDirections
          origin={{
            latitude: helpers.toFloat(provider_coords?.lat),
            longitude: helpers.toFloat(provider_coords?.lng),
          }}
          destination={{
            latitude: helpers.toFloat(mapOrderDetail?.lat),
            longitude: helpers.toFloat(mapOrderDetail?.lng),
          }}
          onError={err => console.log(err)}
          apikey={keys.GOOGLE_API_KEY}
          strokeWidth={3}
          strokeColor={COLORS.primary}
          onReady={onReadyMapDirection}
        />
        {center && (
          <Marker
            onPress={() => {}}
            key={'center'}
            identifier={'center'}
            coordinate={center}>
            <DistanceMarker distance={distance} />
          </Marker>
        )}
        <Marker
          title={mapOrderDetail?.provider_name}
          ref={markerRef}
          onPress={() => {}}
          key={'provider'}
          identifier={'provider'}
          coordinate={{
            latitude: helpers.toFloat(provider_coords.lat),
            longitude: helpers.toFloat(provider_coords.lng),
          }}>
          <ProviderMarker img={icons.car} distance={distance} />
        </Marker>
        <Marker
          title={mapOrderDetail?.delivery_address}
          onPress={() => {}}
          key={'destination'}
          identifier={'destination'}
          coordinate={{
            latitude: helpers.toFloat(mapOrderDetail?.lat),
            longitude: helpers.toFloat(mapOrderDetail?.lng),
          }}>
          <DestinationMarker img={icons.destination} size={55} />
        </Marker>
      </MapView>
      <OrderTrackingBottomCard time={time} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
});
