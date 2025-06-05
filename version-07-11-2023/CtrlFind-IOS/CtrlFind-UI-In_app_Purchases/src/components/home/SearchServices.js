import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Keyboard,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {getDashboardProvidersByCategory} from '../../store/reducers/buyerDashboard';
import {AppHeader} from '../base/AppHeader';
import {AppIcon} from '../base/AppIcon';
import {AppNoDataFound} from '../base/AppNoData';
import {BaseView} from '../base/BaseView';

export const SearchServices = ({onPressBack, onDoneSearch}) => {
  const {searchServices, searchLoading} = useSelector(
    state => state.categories,
  );
  // const {initial_loading} = useSelector(state => state.buyerDashboard);
  const dispatch = useDispatch();
  const ref = useRef(null);
  const navigation = useNavigation();
  const [value, setValue] = useState('');

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus();
    }, 500);
  }, []);
  return (
    <>
      <AppHeader
        title={translate("search")}
        onPressBack={() => {
          Keyboard.dismiss();
          onPressBack();
        }}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          paddingHorizontal: 10,
        }}>
        <View
          style={[
            {
              width: '100%',
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              borderColor: COLORS.gray,
              borderWidth: 1,
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: 'white',
            },
          ]}>
          <TextInput
            ref={ref}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setValue}
            returnKeyType="search"
            onSubmitEditing={() => onDoneSearch(value)}
            style={[
              {
                flex: 1,
                justifyContent: 'center',
                color: COLORS.black,
                paddingHorizontal: 15,
              },
            ]}
            placeholder={translate('searchServices')}
            placeholderTextColor={COLORS.gray}
          />

          <View style={{marginRight: 10}}>
            <AppIcon icon={icons.search} color={COLORS.gray} size={16} />
          </View>
        </View>

        <BaseView styles={{flex: 1}} loading={searchLoading}>
            {/*{console.log("searchServices"+JSON.stringify(searchServices))}*/}
          <FlatList
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 70,
            }}
            data={searchServices}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  Keyboard.dismiss();
                  await dispatch(
                    getDashboardProvidersByCategory({
                      id: item?.category_id,
                      params: '',
                    }),
                  );
                  onPressBack();
                  if (item?.item_type === 'product') {
                    navigation.navigate('provider_product_details', {
                      id: item?.id,
                    });
                  } else {
                    navigation.navigate('provider_service_details', {
                      id: item?.id,
                    });
                  }
                }}
                style={{
                  paddingVertical: 5,
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.lightGray,
                  marginBottom: 5,
                  marginHorizontal: 5,
                }}>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  {item?.image ? (
                    <Image
                      source={{uri: helpers.get_image(item.image?.file_path)}}
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: COLORS.gray,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: COLORS.gray,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{fontSize: 7}}>{translate('noImage')}</Text>
                    </View>
                  )}
                  <View style={{marginLeft: 5, alignItems: 'baseline'}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...FONTS.h3,
                        fontWeight: 'bold',
                        marginRight: 5,
                      }}>
                      {item?.title}
                    </Text>

                    <View
                      style={{
                        backgroundColor:
                          item?.item_type === 'product'
                            ? COLORS.primary
                            : COLORS.black,
                        paddingHorizontal: 5,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          ...FONTS.body4,
                          fontSize: 10,
                          lineHeight: 15,
                          color: COLORS.white,
                        }}>
                        {item?.item_type==="service"?translate("service"):item?.item_type==="product"?translate("product"):null}
                      </Text>
                    </View>
                  </View>
                </View>
                  {console.log(JSON.stringify(item))}
                <View style={{alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      ...FONTS.h3,
                      fontWeight: 'bold',
                      color: COLORS.primary,
                    }}>
                    {`${helpers.getItemPrice(item)} CAD`}
                  </Text>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...FONTS.body5,
                        fontWeight: 'bold',
                        marginRight: 5,
                        fontSize: 11,
                      }}>
                      {item?.provider?.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...FONTS.body5,
                        fontWeight: 'bold',
                        marginRight: 5,
                        lineHeight: 15,
                        fontSize: 10,
                        backgroundColor: COLORS.primary,
                        color: COLORS.white,
                        paddingHorizontal: 5,
                        borderRadius: 5,
                      }}>
                      {item?.category?.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <AppNoDataFound title={translate('noSearch')} />
            )}
          />
        </BaseView>
      </View>
    </>
  );
};
