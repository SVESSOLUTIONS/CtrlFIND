import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  AppHeader,
  AppIcon,
  AppSlider,
  AppSwitch,
  BaseView,
  Search,
} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import icons from '../../constants/icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  onResetFilters,
  SetProviderFilterBy,
  setProviderFilterDistance,
  setProviderFilterIsFeatured,
  setProviderFilterPrice,
  setProviderFilterRating,
  setProviderFilterSearch,
  setProviderFilterTrusted,
} from '../../store/reducers/buyerDashboard';
import helpers from '../../constants/helpers';
import {translate} from '../../multiLang/translation';

export const ServiceFilterScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {provider_filter, provider_filter_state} = useSelector(
    state => state.buyerDashboard,
  );

  return (
    <>
      <AppHeader
        title={translate('filters')}
        shadow={false}
        iconTitle="Reset"
        iconColor={COLORS.lightGray}
        onPressRight={() => dispatch(onResetFilters())}
      />
      <View style={{backgroundColor: COLORS.primary, height: 25}}></View>
      <BaseView styles={styles.container}>
        <Search
          iconSize={18}
          otherStyles={styles.otherStyles}
          placeholder={translate('filterProvider')}
          value={provider_filter_state?.search}
          onChangeText={v => {
            dispatch(setProviderFilterSearch(v));
            dispatch(SetProviderFilterBy());
          }}
        />
        <ScrollView
          style={{flex: 1, marginTop: 25}}
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
            title={`Distance(${helpers.getDistanceInKm(
              provider_filter?.min_distance,
            )} - ${Math.floor(provider_filter_state?.distance)}) km`}
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
            title={`Price(${parseInt(provider_filter?.min_price)} - ${parseInt(
              provider_filter_state?.price,
            )})`}
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
          <View style={{height: 40}} />
        </ScrollView>
      </BaseView>
      <View
        style={{
          paddingVertical: 10,
          backgroundColor: 'rgba(83,127,190,0.78)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 15,
          height: 60,
        }}>
        <Text style={styles.txt}>
          {provider_filter?.search_count}/{provider_filter?.total_counts}{' '}
          {translate('entries')}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            dispatch(SetProviderFilterBy({navigate: true, modal: false}))
          }
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.txt}>{translate('showResult')}</Text>
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
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  txt: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '300',
    marginRight: 5,
  },
  otherStyles: {
    position: 'absolute',
    top: -25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    borderWidth: 2,
  },
});
