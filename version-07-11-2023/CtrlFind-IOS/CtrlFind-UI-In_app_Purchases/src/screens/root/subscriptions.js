import React, {useEffect, useLayoutEffect, useState, useReducer} from 'react';
import {View, StyleSheet, ScrollView, Text, Platform, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppHeader, AppSubscriptions, BaseView} from '../../components';
import {COLORS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import server from '../../server/server';
import {getPackages} from '../../store/reducers/subscriptions';
import AuthContext from "../../context/AuthContext";
import {getProducts, requestPurchase, finishTransaction} from 'react-native-iap';
import platform from "react-native/Libraries/Utilities/Platform";
import * as InAppUtils from "react-native-iap";


export const SubscriptionsScreen = ({navigation}) => {

    const dummyArray = [
        {
            "introductoryPriceAsAmountIOS": "",
            "introductoryPriceSubscriptionPeriodIOS": "",
            "title": "Gold_Package",
            "subscriptionPeriodUnitIOS": "",
            "productId": "gold_100",
            "subscriptionPeriodNumberIOS": "0",
            "countryCode": "USA",
            "price": 14.99,
            "introductoryPricePaymentModeIOS": "",
            "currency": "USD",
            "type": "iap",
            "localizedPrice": "$14.99",
            "introductoryPriceNumberOfPeriodsIOS": "",
            "discounts": [],
            "introductoryPrice": "",
            "description": "This is Gold Subscription Package of CtrlFind",
            "id": 5,
            "name": "Gold",
            "expiry": 30,
            "allowed_products": 50,
            "allowed_services": 50,
            "allowed_employees": 50,
            "allowed_addresses": 10,
            "created_at": "2023-01-24T11:36:48.000000Z",
            "updated_at": "2023-05-19T13:04:31.000000Z",
            "commission": "0.00",
            "is_restricted": 0
        },
        {
            "discounts": [],
            "introductoryPriceNumberOfPeriodsIOS": "",
            "description": "This is Premium Package of CtrlFind",
            "productId": "premium_20",
            "subscriptionPeriodUnitIOS": "",
            "currency": "USD",
            "price": 9.99,
            "introductoryPricePaymentModeIOS": "",
            "countryCode": "USA",
            "subscriptionPeriodNumberIOS": "0",
            "introductoryPriceSubscriptionPeriodIOS": "",
            "title": "Premium_Package ",
            "introductoryPrice": "",
            "type": "iap",
            "localizedPrice": "$9.99",
            "introductoryPriceAsAmountIOS": "",
            "id": 3,
            "name": "Premium",
            "expiry": 30,
            "allowed_products": 10,
            "allowed_services": 10,
            "allowed_employees": 5,
            "allowed_addresses": 3,
            "created_at": "2022-01-31T22:32:32.000000Z",
            "updated_at": "2023-05-19T13:03:23.000000Z",
            "commission": "0.00",
            "is_restricted": 0
        },
        {
            "subscriptionPeriodNumberIOS": "0",
            "countryCode": "USA",
            "discounts": [],
            "introductoryPriceNumberOfPeriodsIOS": "",
            "introductoryPriceAsAmountIOS": "",
            "subscriptionPeriodUnitIOS": "",
            "productId": "standard_14.99",
            "localizedPrice": "$4.99",
            "type": "iap",
            "title": "Standard_Package",
            "introductoryPriceSubscriptionPeriodIOS": "",
            "currency": "USD",
            "price": 4.99,
            "introductoryPricePaymentModeIOS": "",
            "description": "This is Standard Package of CtrlFind",
            "introductoryPrice": "",
            "id": 2,
            "name": "Standard",
            "expiry": 30,
            "allowed_products": 5,
            "allowed_services": 5,
            "allowed_employees": 1,
            "allowed_addresses": 1,
            "created_at": "2022-01-31T22:32:06.000000Z",
            "updated_at": "2023-05-19T13:00:45.000000Z",
            "commission": "0.00",
            "is_restricted": 0
        },
        {
            "id": 1,
            "name": "Basic",
            "expiry": 30,
            "allowed_products": 1,
            "allowed_services": 1,
            "allowed_employees": 1,
            "allowed_addresses": 1,
            "price": 0,
            "created_at": "2022-01-31T22:31:46.000000Z",
            "updated_at": "2023-05-19T12:59:38.000000Z",
            "commission": "0.00",
            "is_restricted": 0
        }
    ]
    const {loading} = useSelector(state => state.subscriptions);
    const dispatch = useDispatch();
    const [province, setProvince] = useState(null);
    const [newPackagesArray, setNewPackagesArray] = useState([]);
    const [packages, setPackages] = useState([
      {
        "id": 1,
        "name": "Basic",
        "expiry": 30,
        "allowed_products": 1,
        "allowed_services": 1,
        "allowed_employees": 1,
        "allowed_addresses": 1,
        "price": 9.99,
        "created_at": "2022-01-31T23:31:46.000000Z",
        "updated_at": "2023-05-29T12:24:19.000000Z",
        "commission": "0.00",
        "is_restricted": 0
      },
      {
        "id": 2,
        "name": "Standard",
        "expiry": 30,
        "allowed_products": 5,
        "allowed_services": 5,
        "allowed_employees": 1,
        "allowed_addresses": 1,
        "price": 14.99,
        "created_at": "2022-01-31T23:32:06.000000Z",
        "updated_at": "2023-05-29T12:24:07.000000Z",
        "commission": "0.00",
        "is_restricted": 0
      },
      {
        "id": 3,
        "name": "Premium",
        "expiry": 30,
        "allowed_products": 10,
        "allowed_services": 10,
        "allowed_employees": 5,
        "allowed_addresses": 3,
        "price": 19.99,
        "created_at": "2022-01-31T23:32:32.000000Z",
        "updated_at": "2023-05-29T12:23:56.000000Z",
        "commission": "0.00",
        "is_restricted": 0
      },
      {
        "id": 5,
        "name": "Gold",
        "expiry": 30,
        "allowed_products": 50,
        "allowed_services": 50,
        "allowed_employees": 50,
        "allowed_addresses": 10,
        "price": 24.99,
        "created_at": "2023-01-24T12:36:48.000000Z",
        "updated_at": "2023-05-29T12:23:35.000000Z",
        "commission": "0.00",
        "is_restricted": 0
    },{
        "id": 9,
        "name": "Trial 3 Months",
        "expiry": 90,
        "allowed_products": 10,
        "allowed_services": 10,
        "allowed_employees": 5,
        "allowed_addresses": 3,
        "price": 0,
        "created_at": "2023-05-29T12:13:59.000000Z",
        "updated_at": "2023-05-29T12:13:59.000000Z",
        "commission": "0.00",
        "is_restricted": 0
      },   ]);
    const {user} = React.useContext(AuthContext);

    const handleGetProducts = async () => {
        try {
            const productList = await getProducts({skus: ['Basic_9.99','standard_14.99','premium_20','gold_100',]});



          const products = productList.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          console.log("productList===", JSON.stringify(products))
          console.log("packages===",JSON.stringify(packages))
            const mergedArray = products.map((product, index) => {
                return {
                    ...product,
                    ...packages[index]
                };
            });
            const concatenatedArray = [packages[4],...mergedArray,];

            setNewPackagesArray(concatenatedArray);
            console.log("array==2", JSON.stringify(concatenatedArray));
        } catch (error) {
            console.log('Error loading products:', error);
        }
    };


    const clearProductsIOS = async () => {
        try {
            await InAppUtils.clearProductsIOS();
            console.log('Products cleared successfully');
        } catch (error) {
            console.log('Error clearing products:', error);
        }
    };

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            setProvince(user?.province)

        });
        return unsubscribe;
    }, [navigation]);


    useEffect(() => {
        dispatch(getPackages());
        setProvince(user?.province)

    }, []);


    //
    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(getPackages());
                clearProductsIOS();
                await handleGetProducts();
            } catch (error) {
                console.log('Error loading data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <>
            <AppHeader isMenu title={translate('subscriptionTitle')}/>
            <BaseView styles={styles.container} loading={loading}>
                <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>


                    {

                        newPackagesArray?.map(p => (
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
                        ))
                    }

                    <View style={{height: 40}}/>
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
