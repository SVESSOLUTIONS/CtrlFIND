import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {AppIcon, AppSlider, AppSwitch, BaseView} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import icons from '../../constants/icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  SetProviderFilterBy,
  setProviderFilterDistance,
  setProviderFilterIsFeatured,
  setProviderFilterPrice,
  setProviderFilterRating,
  setProviderFilterTrusted,
  setProvidersCoordinates,
} from '../../store/reducers/buyerDashboard';
import helpers from '../../constants/helpers';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {translate} from '../../multiLang/translation';

export const FilterBottomSheet = ({onClose}) => {
  const dispatch = useDispatch();
  const {provider_filter, provider_filter_state} = useSelector(
    state => state.buyerDashboard,
  );

  return (
    <>
      <BaseView styles={styles.container}>
        <ScrollView
          style={{flex: 1, paddingHorizontal: 15}}
          showsVerticalScrollIndicator={false}>
          <AppSlider
            title={`Review Score(0 - ${provider_filter_state?.rating / 10})`}
            rightIcon={icons.reviews}
            leftIcon={icons.reviews}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray}
            value={provider_filter_state?.rating}
            onSlidingComplete={val => {
              dispatch(setProviderFilterRating(val));
              dispatch(SetProviderFilterBy());
            }}
          />
          <AppSlider
            title={
              translate('distance') +
              `(${helpers.getDistanceInKm(
                provider_filter?.min_distance,
              )} - ${Math.floor(provider_filter_state?.distance)}) km`
            }
            rightText
            leftText
            minimumValue={helpers.getDistanceInKm(
              provider_filter?.min_distance,
            )}
            maximumValue={helpers.getDistanceInKm(
              provider_filter?.max_distance,
            )}
            value={provider_filter_state?.distance}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray}
            onSlidingComplete={val => {
              dispatch(setProviderFilterDistance(val));
              dispatch(SetProviderFilterBy());
            }}
            step={0}
          />

          <AppSlider
            title={
              translate('price') +
              `(${parseInt(provider_filter?.min_price)} - ${parseInt(
                provider_filter_state?.price,
              )})`
            }
            rightText
            leftText
            minimumValue={parseInt(provider_filter?.min_price)}
            maximumValue={provider_filter?.max_price}
            value={provider_filter_state?.price}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray}
            onSlidingComplete={val => {
              dispatch(setProviderFilterPrice(val));
              dispatch(SetProviderFilterBy());
            }}
            step={0}
          />
          <View style={{marginTop: 10}}>
            <AppSwitch
              title={translate('featured')}
              onValueChange={v => {
                dispatch(setProviderFilterIsFeatured(v));
                dispatch(SetProviderFilterBy());
              }}
              value={provider_filter_state?.is_featured ? true : false}
            />
            <AppSwitch
              title={translate('trusted')}
              onValueChange={v => {
                dispatch(setProviderFilterTrusted(v));
                dispatch(SetProviderFilterBy());
              }}
              value={provider_filter_state.is_trusted ? true : false}
            />
          </View>
          <View style={{height: 70, marginBottom: getBottomSpace()}} />
        </ScrollView>
      </BaseView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 99,
          paddingVertical: 10,
          backgroundColor: 'rgba(83,127,190,0.78)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 15,
          paddingBottom: Platform.OS === 'ios' ? getBottomSpace() : 15,
        }}>
        <Text style={styles.txt}>
          {provider_filter?.search_count}/{provider_filter?.total_counts}{' '}
          {translate('entries')}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            dispatch(SetProviderFilterBy({navigate: false, modal: true}));
            dispatch(setProvidersCoordinates());
            onClose();
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.txt}>{translate('showResults')}</Text>
          <AppIcon icon={icons.filter} size={15} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: COLORS.white,
  },
  txt: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '300',
    marginRight: 5,
  },
});
