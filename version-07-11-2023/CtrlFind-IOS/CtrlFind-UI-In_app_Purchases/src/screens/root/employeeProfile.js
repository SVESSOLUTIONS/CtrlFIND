import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppButton, AppHeader, AppIcon, BaseView} from '../../components';
import helpers from '../../constants/helpers';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {deleteEmployee} from '../../store/reducers/employees';

const renderUserInfo = (icon, info) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        width: '47%',
        paddingVertical: 5,
      }}>
      <AppIcon icon={icon} size={15} color={COLORS.black} />
      <Text style={{...FONTS.body4, fontSize: 13, marginLeft: 7}}>{info}</Text>
    </View>
  );
};

const RenderAccountInfo = ({img, name}) => {
  return (
    <View
      style={{
        width: '100%',
        height: 150,
        backgroundColor: COLORS.white,
      }}>
      <View
        style={{
          marginTop: 15,
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}>
        <Image
          source={{uri: helpers.get_image(img)}}
          style={{
            height: 80,
            width: 80,
            borderRadius: 40,
            marginRight: 15,
            borderWidth: 1,
            borderColor: COLORS.gray,
          }}
        />

        <View style={{marginTop: 10, flex: 1}}>
          <Text style={{color: COLORS.black, ...FONTS.h2}}>{name}</Text>
          <Text
            style={{
              color: COLORS.gray,
              ...FONTS.body5,
            }}>
            Employee
          </Text>
        </View>
      </View>
    </View>
  );
};

export const EmployeesProfileScreen = ({navigation, route}) => {
  const {loading} = useSelector(state => state.employees);
  const dispatch = useDispatch();
  const {item} = route.params;
  return (
    <>
      <AppHeader
        title={`${item?.name.toUpperCase()}`}
        rightIcon={icons.trash}
        iconColor={'#4d2328'}
        iconSize={20}
        loading={loading}
        onPressRight={() => {
          Alert.alert(
            translate('deleteEmployee'),
            translate('deleteEmployeeText'),
            [
              {
                text: translate('yes'),
                onPress: () => dispatch(deleteEmployee(item?.id)),
              },
              {
                text: translate('no'),
                onPress: () => {},
                style: 'cancel',
              },
            ],
          );
        }}
      />
      <BaseView styles={styles.container}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}>
          <RenderAccountInfo img={item?.image} name={item?.name} />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {renderUserInfo(icons.phone, item?.phone)}
            {renderUserInfo(icons.email, item?.email)}
            {renderUserInfo(icons.services, item?.designation)}
          </View>
          <AppButton
            icon={icons.services}
            onPress={() =>
              navigation.navigate('employee_services', {employee: item})
            }
            title={translate('services')}
            otherStyles={{
              justifyContent: 'center',
              width: '80%',
              alignSelf: 'center',
              marginTop: 30,
            }}
            textStyles={{
              textAlign: 'center',
              flex: 0,
            }}
          />
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
