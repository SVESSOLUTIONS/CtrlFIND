import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddEmployees,
  AppGradientButton,
  AppHeader,
  AppNoDataFound,
  BaseView,
  EmployeeCard,
} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  getEmployees,
  onAddEmployee,
  onEditEmployee,
  setIsVisible,
} from '../../store/reducers/employees';

export const EmployeesScreen = ({navigation}) => {
    const [isEdit, setSetIsEdit] = useState(false);
    const {employees, initial_loading, isVisible} = useSelector(
    state => state.employees,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployees());
  }, []);

  return (
    <>
      <AppHeader title={translate('employeesTitle')} />
      <BaseView styles={styles.container} loading={initial_loading}>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 100,
          }}
          data={employees}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <EmployeeCard
              item={item}
              onPress={() => navigation.navigate('employee_profile', {item})}
              onPressIcon={() => {
                dispatch(onEditEmployee(item));
                dispatch(setIsVisible(true));
              }}
            />
          )}
          ListEmptyComponent={() => (
            <AppNoDataFound title={translate('noEmployees')} />
          )}
        />
        <AppGradientButton
          onPress={() => {
            dispatch(onAddEmployee());
            dispatch(setIsVisible(true));
          }}
          title={translate('addEmployee')}
        />
      </BaseView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        animationOutTiming={300}
        useNativeDriver>
        <AddEmployees />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});
