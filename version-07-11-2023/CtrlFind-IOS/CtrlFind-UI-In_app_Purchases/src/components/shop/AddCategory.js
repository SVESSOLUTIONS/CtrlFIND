import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppButton, AppCheckBox, AppIcon, AppInput, AppTags} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  addProviderCategories,
  getCategories,
  searchProviderCategories,
  selectAllCategoriesForProvider,
  setIsRequestVisible,
  setIsVisible,
  setProviderCategoriesId,
} from '../../store/reducers/categories';

export const AddCategory = () => {
  const dispatch = useDispatch();
  const {
    loading,
    loaded,
    filterdProviderCategories,
    categories,
    provider_categories_ids,
  } = useSelector(state => state.categories);

  const showTagRef = React.useRef(null);

  React.useEffect(() => {
    dispatch(getCategories());
  }, []);

  const onSelectAll = () => {
    Keyboard.dismiss();
    let ids = [];
    for (let i = 0; i < categories.length; ++i) ids.push(categories[i].id);
    dispatch(selectAllCategoriesForProvider(ids));
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator
          animating={loading}
          color={COLORS.primary}
          size="large"
        />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <View
          style={{
            height: 50,
            backgroundColor: COLORS.primary,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.white,
              fontWeight: '500',
              flex: 1,
            }}>
            {translate('addCategory')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => dispatch(setIsVisible(false))}>
            <AppIcon icon={icons.close} size={15} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 15, marginTop: 10}}>
          <Text
            style={{
              ...FONTS.body4,
            }}>
            {translate('category')}
          </Text>
          <View
            style={{
              marginTop: 10,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.lightGray,
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <ScrollView
              ref={showTagRef}
              onContentSizeChange={() =>
                showTagRef.current?.scrollToEnd({animated: true})
              }
              horizontal
              contentContainerStyle={{paddingBottom: 10}}
              keyboardShouldPersistTaps="handled">
              {provider_categories_ids.map(tag => (
                <AppTags
                  key={tag}
                  tag={categories.find(c => c.id === tag)?.name}
                  onPress={() => {
                    Keyboard.dismiss();
                    dispatch(setProviderCategoriesId(tag));
                  }}
                />
              ))}
            </ScrollView>
          </View>
          <AppInput
            placeholder={translate('searchTags')}
            otherStyles={{height: 40}}
            onChangeText={value =>
              dispatch(searchProviderCategories({search: value}))
            }
          />
          <AppCheckBox
            isChecked={provider_categories_ids.length === categories.length}
            setIsChecked={onSelectAll}
            title={translate('selectAll')}
          />
          <ScrollView
            style={{maxHeight: 250}}
            keyboardShouldPersistTaps="handled">
            {filterdProviderCategories.map(tag => (
              <AppCheckBox
                key={tag.id}
                isChecked={provider_categories_ids.includes(tag.id)}
                setIsChecked={() => {
                  Keyboard.dismiss();
                  dispatch(setProviderCategoriesId(tag.id));
                }}
                title={tag.name}
              />
            ))}
          </ScrollView>

          <AppButton
            loading={loaded}
            title={translate('done')}
            onPress={() => {
              Keyboard.dismiss();
              dispatch(addProviderCategories(provider_categories_ids));
            }}
            otherStyles={{marginBottom: 5}}
          />
          <AppButton
            title={translate('requestCategory')}
            onPress={() => {
              dispatch(setIsVisible(false));
              setTimeout(() => {
                dispatch(setIsRequestVisible(true));
              }, 1000);
            }}
            otherStyles={{
              marginTop: 5,
              marginBottom: 10,
              backgroundColor: COLORS.black,
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
