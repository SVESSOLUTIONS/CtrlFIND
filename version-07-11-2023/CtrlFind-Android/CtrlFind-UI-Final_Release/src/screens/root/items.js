import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {
  BaseView,
  Header,
  ItemsSearch,
  Search,
  SearchServices,
  ServicesCard,
} from '../../components';
import helpers from '../../constants/helpers';
import AuthContext from '../../context/AuthContext';
import localStorage from '../../server/localStorage';
import {setCoordinates} from '../../store/reducers/buyerDashboard';
import {
  getCategories,
  searchServices,
  setLoading,
} from '../../store/reducers/categories';

export const ItemsScreen = ({navigation}) => {
  const {user, trigger} = useContext(AuthContext);
  const {filterdCategories, loading} = useSelector(state => state.categories);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getCategories());
    });
    return unsubscribe;
  }, [navigation]);

  const getSavedLocation = async () => {
    const location = await localStorage.getLocation();
    if (location) dispatch(setCoordinates(JSON.parse(location)));
  };
  useEffect(() => {
    getSavedLocation();
    dispatch(getCategories());
  }, []);
  return (
    <View style={styles.container}>
      <View style={{marginBottom: 30}}>
        {/* Services Header */}
        <Header
          hideMenu={helpers.getRole(user.role_id) === 'Guest' ? true : false}
          onLogout={() => trigger.signout()}
        />
        {/* Services Search */}
        <ItemsSearch
          onPress={() => {
            setIsVisible(true);
          }}
          // onChangeText={value => dispatch(searchServices({search: value}))}
        />
      </View>

      {/* Services  */}
      <ScrollView style={{flex: 1}}>
        <BaseView loading={loading}>
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              paddingBottom: 10,
            }}>
              {/*{console.log("filterdCategories"+JSON.stringify(filterdCategories))}*/}
            {filterdCategories?.map(service => (
              <ServicesCard
                onPress={() =>
                  navigation.navigate('service_details', {service})
                }
                key={service.id}
                image={helpers.get_image(service.photo)}
                title={service.name}
              />
            ))}
          </View>
        </BaseView>
      </ScrollView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        style={{
          margin: 0,
        }}
        animationOutTiming={300}
        useNativeDriver>
        <SearchServices
          onPressBack={() => setIsVisible(false)}
          onDoneSearch={value => dispatch(searchServices({search: value}))}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});
