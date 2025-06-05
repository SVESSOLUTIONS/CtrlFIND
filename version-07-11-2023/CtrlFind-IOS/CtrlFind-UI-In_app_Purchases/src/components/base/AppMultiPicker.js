import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {COLORS, FONTS} from '../../constants/theme';
import {AppButton, AppCheckBox, AppIcon, AppTags} from '..';
import icons from '../../constants/icons';
import {getBottomSpace} from 'react-native-iphone-x-helper';

export const AppMultiPicker = ({
  items = [],
  selected = [],
  placeholder = 'select item',
  onSelect = () => {},
  icon,
  type,
  otherStyles,
}) => {
  const pickerRef = React.useRef();

  const showTagRef = React.useRef(null);

  function close() {
    pickerRef.current?.close();
  }

  function open() {
    pickerRef.current?.open();
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={open}
        style={[
          {
            width: '100%',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            paddingHorizontal: 10,
            borderColor: COLORS.gray,
            borderWidth: 1,
            borderRadius: 5,
            overflow: 'hidden',
            backgroundColor: 'white',
          },
          otherStyles,
        ]}>
        {selected?.length ? (
          selected?.map((s, i) => (
            <View
              key={s.value + i}
              style={{
                marginRight: 3,
                paddingHorizontal: type === 'color' ? 10 : 5,
                borderRadius: 5,
                backgroundColor: type === 'color' ? s.value : COLORS.primary,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  ...FONTS.body4,
                  fontSize: 10,
                  color: COLORS.white,
                }}>
                {type === 'color' ? null : s.label}
              </Text>
            </View>
          ))
        ) : (
          <Text
            numberOfLines={1}
            style={{
              ...FONTS.body4,
              fontSize: 12,
              flex: 1,
              color: COLORS.black,
            }}>
            {placeholder}
          </Text>
        )}
        {icon && (
          <View style={{marginLeft: 'auto'}}>
            <AppIcon icon={icons.arrow_down} color={COLORS.gray} size={14} />
          </View>
        )}
      </TouchableOpacity>
      <RBSheet
        ref={pickerRef}
        height={items.length > 2 ? 350 : 250}
        openDuration={250}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        <>
          <View>
            {selected.length ? (
              <ScrollView
                ref={showTagRef}
                onContentSizeChange={() =>
                  showTagRef.current?.scrollToEnd({animated: true})
                }
                horizontal
                style={{
                  margin: 10,
                }}>
                {selected.map((s, i) => (
                  <AppTags
                    key={s.value + i}
                    tag={s.label}
                    onPress={() => {
                      onSelect({
                        label: s.label,
                        value: s.value,
                      });
                    }}
                  />
                ))}
              </ScrollView>
            ) : null}
          </View>

          <ScrollView>
            {items.map((item, index) => (
              <View
                key={item.id}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 2,
                }}>
                <AppCheckBox
                  isChecked={
                    selected.filter(s => s.value === item.value).length > 0
                  }
                  setIsChecked={() => {
                    onSelect({
                      label: item.label,
                      value: item.value,
                    });
                  }}
                  title={item.label}
                />
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              marginBottom: getBottomSpace(),
              paddingHorizontal: 15,
            }}>
            <AppButton title={'Done'} onPress={() => close()} />
          </View>
        </>
      </RBSheet>
    </>
  );
};
