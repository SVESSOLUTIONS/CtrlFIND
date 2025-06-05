import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, useWindowDimensions, TouchableOpacity, Image} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {AllOrdersScreen} from '..';
import {AppHeader, AppNoDataFound, GroupButtons} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {
  getProviderOrders,
  setIndex,
  setServiceIndex,
  setTitle,
} from '../../store/reducers/orders';

const active_color = '#fff';

const status = ['', 'pending', 'Confirmed', 'onTheWay', 'Delivered'];

const Servicestatus = [
  '',
  'Recieved',
  'Confirmed',
  'InProgress',
  'ReadyForPickUp',
  'ReadyForDelivery',
  'onTheWay',
  'onTheWayPickUp',
  'onTheWayDelivery',
  'Delivered',
];

export const OrdersScreen = ({navigation}) => {
  const {index, serviceIndex, title} = useSelector(state => state.orders);
  const dispatch = useDispatch();
  const layout = useWindowDimensions();
  const [routes] = useState([
    {key: 'all', title: translate('all')},
    {key: 'pending', title: translate('pending')},
    {key: 'confirmed', title: translate('confirmed')},
    {key: 'in_progress', title: translate('progress')},
    {key: 'completed', title: translate('completed')},
  ]);

  const [ServiceRoutes] = useState([
    {key: 'all', title: translate('all')},
    {key: 'recieved', title: translate('Recieved')},
    {key: 'confirmed', title: translate('Confirmed')},
    {key: 'in_progress', title: translate('InProgress')},
    {key: 'ready_for_pickup', title: translate('ReadyForPickUp')},
    {key: 'ready_for_delivery', title: translate('ReadyForDelivery')},
    {key: 'on_the_way', title: translate('onTheWay')},
    {key: 'on_the_way_pickup', title: translate('onTheWayPickUp')},
    {key: 'on_the_way_delivery', title: translate('onTheWayDelivery')},
    {key: 'delivered', title: translate('Delivered')},
  ]);

  const renderScene = SceneMap({
    all: AllOrdersScreen,
    pending: AllOrdersScreen,
    in_progress: AllOrdersScreen,
    confirmed: AllOrdersScreen,
    completed: AllOrdersScreen,
  });

  const ServiceRenderScene = SceneMap({
    all: AllOrdersScreen,
    recieved: AllOrdersScreen,
    confirmed: AllOrdersScreen,
    in_progress: AllOrdersScreen,
    ready_for_pickup: AllOrdersScreen,
    ready_for_delivery: AllOrdersScreen,
    on_the_way: AllOrdersScreen,
    on_the_way_pickup: AllOrdersScreen,
    on_the_way_delivery: AllOrdersScreen,
    delivered: AllOrdersScreen,
  });

  function gettingOrders(i) {
    title === 'Products'
      ? dispatch(getProviderOrders(status[i]))
      : dispatch(getProviderOrders(Servicestatus[i]));
  }

  useEffect(() => {
    gettingOrders(title === 'Products' ? index : serviceIndex);
  }, [title]);

  const onChangeIndex = i => {
    title === 'Products' ? dispatch(setIndex(i)) : dispatch(setServiceIndex(i));
    gettingOrders(i);
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{backgroundColor: active_color}}
      style={{backgroundColor: COLORS.primary}}
      tabStyle={{width: 95}}
      renderLabel={({route, focused, color}) => (
        <Text
          style={{
            color: focused ? active_color : "#6288bf",
            textAlign: 'center',
          }}>
          {route.title}
        </Text>
      )}
    />
  );


  return (
    <>
      <AppHeader title={translate('orders')} shadow={false} />
      <TouchableOpacity onPress={()=>{
        gettingOrders(title === 'Products' ? index : serviceIndex)
      }} style={{flexDirection:"row",justifyContent:'flex-end',position:'absolute',alignSelf:'flex-end',top:43,right:20,alignItems:'center'}}>
        <Image
            source={require("../../assets/refresh.png")}
            style={{height: 20, width: 20,marginRight:5 }}
        />
        <Text  numberOfLines={1}
               style={{
                 ...FONTS.h4,
                 color: COLORS.white,
                 fontWeight: '600',}} >Refresh</Text>

      </TouchableOpacity>
      <View style={styles.container}>
        <GroupButtons
          title={title}
          onPress={title => dispatch(setTitle(title))}
        />
        <View style={{flex: 1, backgroundColor: COLORS.white}}>
          <TabView
            renderTabBar={renderTabBar}
            lazy={true}
            renderLazyPlaceholder={() => <AppNoDataFound title="Loading...." />}
            navigationState={{
              index: title === 'Products' ? index : serviceIndex,
              routes: title === 'Products' ? routes : ServiceRoutes,
            }}
            renderScene={
              title === 'Products' ? renderScene : ServiceRenderScene
            }
            onIndexChange={onChangeIndex}
            initialLayout={{width: layout.width}}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});
