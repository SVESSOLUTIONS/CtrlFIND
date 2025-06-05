import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {AppCheckBox, AppIcon, AppInput, AppTags} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from "../../multiLang/translation";

export const AppTagsPicker = ({
  selectedTags = [],
  tags = [],
  onSelect = () => {},
  onSearch = () => {},
  onAddTag = () => {},
}) => {
  const [search, setSearch] = React.useState('');
  const showTagRef = React.useRef(null);
  return (
    <View style={{marginTop: 10}}>
      <Text
        style={{
          ...FONTS.h4,
          color: COLORS.gray,
        }}>
          {translate("selectAddTags")}
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: COLORS.gray,
          borderRadius: 5,
          paddingVertical: 10,
        }}>
        <View
          style={{
            marginTop: 10,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray,
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
            {selectedTags.map((tag, i) => (
              <AppTags
                key={tag.name + i}
                tag={tag?.name}
                onPress={() => {
                  onSelect(tag);
                }}
              />
            ))}
          </ScrollView>
        </View>
        <View style={{paddingHorizontal: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '75%'}}>
              <AppInput
                placeholder={translate("searchTags")}
                otherStyles={{height: 40}}
                value={search}
                onChangeText={value => {
                  setSearch(value);
                  onSearch(value);
                }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (search) {
                  let tag_data = {
                    id: Math.random(),
                    name: search,
                  };
                  onAddTag(tag_data);
                  setSearch('');
                }
              }}
              style={{
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.gray,
                marginTop: 10,
                marginLeft: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                flex: 1,
                height: 40,
              }}>
              <AppIcon icon={icons.plus} size={15} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{maxHeight: 250}}>
            {tags.slice(0, 3).map((tag, i) => (
              <AppCheckBox
                key={tag.name + i}
                isChecked={
                  selectedTags.filter(st => st.name === tag.name).length > 0
                }
                setIsChecked={() => onSelect(tag)}
                title={tag.name}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
