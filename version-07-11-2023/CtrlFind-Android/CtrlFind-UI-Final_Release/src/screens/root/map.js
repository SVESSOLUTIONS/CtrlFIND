import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MapView from 'react-native-map-clustering';
import {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  AppHeader,
  CustomMarker,
  FilterBottomSheet,
  ServiceHeader,
  ServicesInfoCard,
  SortBy,
} from '../../components';
import {COLORS, SIZES} from '../../constants/theme';
import {useDispatch, useSelector} from 'react-redux';
import helpers from '../../constants/helpers';
import {
  onResetFilters,
  ProvidersSortBy,
} from '../../store/reducers/buyerDashboard';
import labels from '../../constants/labels';

let LATITUDE_DELTA = 0.0922;
let LONGITUDE_DELTA = LATITUDE_DELTA * (SIZES.width / SIZES.height);

export const MapScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {
    providers_coords,
    userCoordinates,
    providersSortIndex,
    filteredCategoryProviders,
  } = useSelector(state => state.buyerDashboard);
  const [INITIAL_REGION] = useState({
    latitude: userCoordinates?.lat,
    longitude: userCoordinates?.lng,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [activeCardId, setActiveCardId] = useState(null);

  const refRBSheet = useRef(null);
  const refRBSheetProviders = useRef(null);
  const mapRef = useRef(null);
  const cardRef = useRef(null);

  const onMapReady = () => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(providers_coords, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  };

  // animate to user when press on card
  const onPressCard = coords => {
    if (cardRef.current) {
      cardRef.current.scrollToIndex({
        index: coords.index,
      });
    }
    setActiveCardId(coords.id);
    if (mapRef.current) {
      animateToMarker(coords);
    }
  };

  const onPressMarker = coords => {
    if (cardRef.current) {
      cardRef.current.scrollToIndex({
        index: coords.index,
      });
    }
    setActiveCardId(coords.id);
    if (mapRef.current) {
      animateToMarker(coords);
    }
  };

  const animateToMarker = coords =>
    mapRef.current.animateToRegion(
      {
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      1000,
    );

  return (
    <>
      <AppHeader
        title="Provider near you"
        shadow={false}
        onPressBack={() => {
          dispatch(onResetFilters());
          navigation.goBack();
        }}
      />
      <ServiceHeader
        isSorted={providersSortIndex === -1 ? false : true}
        onPressSort={() => refRBSheet.current?.open()}
        onPressFilter={() => refRBSheetProviders.current?.open()}
      />
      <MapView
        ref={mapRef}
        showsUserLocation
        provider={PROVIDER_GOOGLE}
        clusterColor={COLORS.primary}
        clusterTextColor={COLORS.white}
        onMapReady={onMapReady}
        onLayout={onMapReady}
        style={{flex: 1}}
        initialRegion={INITIAL_REGION}>
        {filteredCategoryProviders.map((p, i) => (
          <Marker
            title={p?.name}
            onPress={() =>
              onPressMarker({
                index: i,
                id: p?.id,
                lat: helpers.toFloat(p?.provider_lat),
                lng: helpers.toFloat(p.provider_lng),
              })
            }
            key={p?.id + i + p?.name}
            coordinate={{
              latitude: helpers.toFloat(p?.provider_lat),
              longitude: helpers.toFloat(p?.provider_lng),
            }}>
            <CustomMarker img={p?.avatar} />
          </Marker>
        ))}
      </MapView>
      <RBSheet
        ref={refRBSheet}
        height={370}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
          }}>
          <SortBy
            onClose={() => refRBSheet.current?.close()}
            onPress={selectedValue => {
              if (selectedValue) {
                const index = labels.providerSortTitles.indexOf(selectedValue);
                dispatch(ProvidersSortBy({value: selectedValue?.label, index}));
                refRBSheet.current?.close();
              }
            }}
          />
        </ScrollView>
      </RBSheet>
      <RBSheet
        ref={refRBSheetProviders}
        height={400}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        <FilterBottomSheet
          onClose={() => {
            refRBSheetProviders?.current.close();
            setTimeout(() => {
              setActiveCardId(null);
              onMapReady();
            }, 500);
          }}
        />
      </RBSheet>
      {filteredCategoryProviders.length > 0 ? (
        <View style={styles.cardContainer}>
          <FlatList
            ref={cardRef}
            contentContainerStyle={{paddingBottom: 10}}
            data={filteredCategoryProviders}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                cardRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
            renderItem={({item, index}) => (
              <ServicesInfoCard
                active={activeCardId === item?.id}
                item={item}
                extraInfo={true}
                otherStyles={{
                  paddingHorizontal: 5,
                }}
                onPressIcon={() => {
                  navigation.navigate('provider', {
                    item: item,
                    service: 'Products',
                  });
                }}
                onPress={() => {
                  onPressCard({
                    index: index,
                    id: item?.id,
                    lat: helpers.toFloat(item?.provider_lat),
                    lng: helpers.toFloat(item.provider_lng),
                  });
                }}
              />
            )}
          />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    height: SIZES.height / 3,
    paddingTop: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
});
