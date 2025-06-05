import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppHeader, AppSubscriptions, BaseView} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import server from '../../server/server';
import {getPackages} from '../../store/reducers/subscriptions';
import AuthContext from "../../context/AuthContext";

export const SubscriptionsScreen = ({navigation}) => {
  const {loading, packages} = useSelector(state => state.subscriptions);
  const dispatch = useDispatch();
  const [province, setProvince] = useState(null);
  const {user} = React.useContext(AuthContext);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getPackages());
      setProvince(user?.province)
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    dispatch(getPackages());
    console.log("user=="+JSON.stringify(user))
    setProvince(user?.province)

  }, []);

  // useEffect(() => {
  //   server.getProvince().then(resp => {
  //     if (!resp.ok) return alert(translate("errorgettingprovince"));
  //     setProvince(resp.data);
  //     // console.log("province=="+JSON.stringify(resp?.data))
  //   });
  // }, []);

  return (
    <>
      <AppHeader isMenu title={translate('subscriptionTitle')} />
      <BaseView styles={styles.container} loading={loading}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {packages.map(p => (
            <AppSubscriptions
              item={p}
              key={p.id}
              onPress={() =>
                navigation.navigate('subscription_details', {
                  item: p,
                  province,
                })
              }
            />
          ))}
          <View style={{height: 40}} />
        </ScrollView>
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
});
