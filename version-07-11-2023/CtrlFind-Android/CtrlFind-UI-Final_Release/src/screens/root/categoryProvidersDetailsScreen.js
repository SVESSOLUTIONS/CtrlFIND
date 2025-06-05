import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, RefreshControl, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppHeader,
  AppNoDataFound,
  BaseView,
  ServiceHeader,
  ServicesInfoCard,
  SortBy,
} from '../../components';
import labels from '../../constants/labels';
import {COLORS, FONTS} from '../../constants/theme';
import useLocation from '../../hooks/useLocation';
import localStorage from '../../server/localStorage';
import {
  getDashboardProvidersByCategory,
  onResetFilters,
  ProvidersSortBy,
  setProvidersCoordinates,
} from '../../store/reducers/buyerDashboard';
import axios from "axios";
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import {baseURL} from "../../server/baseUrl";
import {translate} from "../../multiLang/translation";
import helpers from "../../constants/helpers";
import AuthContext from "../../context/AuthContext";

export const CategoryProvidersDetailsScreen = ({navigation, route}) => {
    const {user} = React.useContext(AuthContext);
  const dispatch = useDispatch();
  const {filteredCategoryProviders, providersSortIndex, initial_loading} =
    useSelector(state => state.buyerDashboard);

  const {getLocation} = useLocation();
  useEffect(() => {
    getLocation();
  }, []);
  const {userCoordinates, permission} = useSelector(
    state => state.buyerDashboard,
  );
  const {service} = route.params;
    // {console.log("service"+JSON.stringify(service))}
  // execute when user press on card
  const onPressCard = item =>
    navigation.navigate('provider', {
      item: item,
      service: 'Products',
      id: service?.id,
    });

  // getting list when component mounted
  useEffect(() => {
    gettingData();

    if (helpers.getRole(user?.role_id) !== helpers.GUEST){
        getTagsList();

    }




  }, []);
  function gettingData() {
    dispatch(
      getDashboardProvidersByCategory({
        id: service?.id,
        params: userCoordinates,
      }),
    );
  }

    const getTagsList = async() => {

        let token = await localStorage.getToken();
        axios.get(baseURL+'/get_tags', { headers: {"Authorization" : `Bearer ${token}`} })
            .then(function (response) {


                const data=response?.data
                data.sort((a, b) => a.name.localeCompare(b.name))
                setTagsList(response?.data)
            })
            .catch(function (error) {
                alert(error.message);
            })
    };

    const getProvider_List_byTags =  async(selectedList) => {

         // console.log("selectedListpost function===>",selectedList)
        let token = await localStorage.getToken();
        // console.log("token===>",token)
        axios.post(baseURL+'/get_provider_by_tags', {tags:selectedList}, { headers: {"Authorization" : `Bearer ${token}`} })
            .then(function (response) {
                // handle success
                console.log("Providers===",JSON.stringify(response?.data));
                setProviderList(response?.data)
            })
            .catch(function (error) {
                // handle error
                // alert("hy")
                alert(error.message);
            })
    };
  // local state
    const [selectedList, setSelectedList] = React.useState([]);
    const [tagsList, setTagsList] = React.useState([]);
    const [providerList, setProviderList] = React.useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isTagsVisible, setIsTagsVisible] = useState(false);
    const arr = [];

    tagsList.forEach(object => {
        arr.push({value:object.name,key : object.id});
         // console.log("array=hy=",arr)
    });

  return (
    <>
      <AppHeader tagTitle={isTagsVisible?translate("Clear"):translate("filterByTags")} tagSearch={true} onPressTags={()=>{
          setIsTagsVisible(!isTagsVisible)
          setProviderList([])

      }} title={service?.name} shadow={false} />
        {/*{console.log("filteredCategoryProviders===",filteredCategoryProviders)}*/}
        <ScrollView style={{flex:1}}>
        {isTagsVisible?
            <MultipleSelectList
                checkBoxStyles={{backgroundColor:"white"}}
                badgeTextStyles={{color:COLORS.primary}}
                badgeStyles={{backgroundColor:"#ffffff"}}
                boxStyles={{margin:10}}
                dropdownStyles={{margin:10}}
                dropdownTextStyles={{color:COLORS.primary}}
                setSelected={(key) => setSelectedList(key)}
                data={arr}
                save="key"
                onSelect={() => {
                    getProvider_List_byTags(selectedList)
                }}
                label="Tags"
            />
            :null}
      {!initial_loading && (
        <ServiceHeader
          onPressSort={() => setIsVisible(true)}
          isSorted={providersSortIndex === -1 ? false : true}
          onPressFilter={() => navigation.navigate('service_filter')}
          onPressMap={() => {
            if (!permission) getLocation();
            else {
              dispatch(setProvidersCoordinates());
              dispatch(onResetFilters());
              setTimeout(() => {
                navigation.navigate('map');
              }, 200);
            }
          }}
        />
      )}
      <BaseView styles={styles.container} loading={initial_loading}>
          {console.log("providerList:oo=="+providerList)}
        <FlatList
          contentContainerStyle={{paddingBottom: 10,}}
          data={providerList?.length<=0?filteredCategoryProviders:providerList}
          showsVerticalScrollIndicator={false}
          // keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={initial_loading}
              onRefresh={() => gettingData()}
            />
          }
          renderItem={({item}) => (
            <ServicesInfoCard
              item={item}
              extraInfo={true}
              onPress={() => onPressCard(item)}
              onPressIcon={() => onPressCard(item)}


            />
          )}
          ListEmptyComponent={() => <AppNoDataFound />}
        />
      </BaseView>
      <Modal
        isVisible={isVisible}
        hideModalContentWhileAnimating
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationOutTiming={1}>
        <SortBy
          onClose={() => setIsVisible(false)}
          onPress={selectedValue => {
            if (selectedValue) {
              const index = labels.providerSortTitles.indexOf(selectedValue);
              dispatch(ProvidersSortBy({value: selectedValue?.label, index}));
              setIsVisible(false);
            }
          }}
        />
      </Modal>
        </ScrollView>
    </>



  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingHorizontal: 15,
  },
});
