import React, {useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {useDispatch, useSelector} from 'react-redux';
import {AppHeader, AppNoDataFound, BaseView, ItemsList} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  getEmployeeServices,
  removeEmployeeService,
} from '../../store/reducers/employees';

export const EmployeeServicesScreen = ({route}) => {
  const {employee} = route.params;
  const {employee_services, initial_loading} = useSelector(
    state => state.employees,
  );
  const [rowIndex, setRowIndex] = useState(null);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getEmployeeServices(employee.id));
  }, []);

  const onSwipeOpen = index => {
    setRowIndex(index);
  };
  const onSwipeClose = index => {
    if (rowIndex === index) {
      setRowIndex(null);
    }
  };

  return (
    <>
      <AppHeader title={employee.name.toUpperCase()} />
      <BaseView styles={styles.container} loading={initial_loading}>
        <FlatList
          contentContainerStyle={{paddingBottom: 10}}
          data={employee_services}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <Swipeout
              right={[
                {
                  text: 'REMOVE',
                  backgroundColor: 'red',
                  onPress: () => dispatch(removeEmployeeService(item?.id)),
                },
              ]}
              onOpen={() => onSwipeOpen(index)}
              close={rowIndex !== index}
              onClose={() => onSwipeClose(index)}
              rowIndex={index}
              sectionId={0}
              autoClose={true}>
              <ItemsList title={translate('service')} item={item} />
            </Swipeout>
          )}
          ListEmptyComponent={() => (
            <AppNoDataFound title={translate('noService')} />
          )}
        />
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
