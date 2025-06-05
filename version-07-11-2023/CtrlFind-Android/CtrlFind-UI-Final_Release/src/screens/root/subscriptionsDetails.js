import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  AppButton,
  AppHeader,
  BaseView,
  SubscriptionInfo,
} from '../../components';
import helpers from '../../constants/helpers';
import {COLORS, FONTS} from '../../constants/theme';
import AuthContext from '../../context/AuthContext';
import {translate} from '../../multiLang/translation';
import server from '../../server/server';
import apis from "../../server/apis";

export const SubscriptionsDetailsScreen = ({navigation, route}) => {
    const {user, trigger} = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);

  const is_subscribed = user.is_subscribed?.package?.id;

  const {item, province} = route.params;


    const subscribe_package = async () => {

         try {
            const resp = await apis.subscribePackage(item.id, {
                sub_total: 0,
                gst:0,
                pst:0,
                price:  0,

            });
            console.log("subscribe package response==",JSON.stringify(resp))
            const {user, invoice, package_id} = resp.data;
            const payload = {
                package_id,
                invoice,
            };
            console.log("payload==1"+JSON.stringify(payload))
            server.sendSubscriptionDetailsMail(payload).then(resp => {
                console.log("response on cart paymet==1"+JSON.stringify(resp))

                trigger.updateUser(user);
                navigation.goBack();
                setTimeout(() => {
                    trigger.setRoute('edit_profile');
                    navigation.navigate('edit_profile');
                }, 1000);
            });
        } catch (error) {

        }
    };


  return (
    <>
      <AppHeader title={item.name} />
      <BaseView styles={styles.container}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View
            style={{
              borderBottomColor: COLORS.gray,
              borderBottomWidth: 1,
              paddingBottom: 20,
              paddingTop: 10,
            }}>
            <SubscriptionInfo
              title={translate('validityLabel')}
              subtitle={`${item.expiry} Days`}
              subtitleStyles={{...FONTS.body3, fontWeight: '800'}}
              otherStyles={{
                borderBottomWidth: 0,
                paddingBottom: 6,
                paddingTop: 0,
              }}
            />
              <SubscriptionInfo
                  title={translate('commission')}
                  subtitle={`${item.commission}%`}
                  subtitleStyles={{...FONTS.body3, fontWeight: '800'}}
                  otherStyles={{
                      borderBottomWidth: 0,
                      paddingBottom: 0,
                      paddingTop: 0,
                  }}
              />
            <SubscriptionInfo
              title={'Start Date:'}
              subtitle={moment().format('DD/MM/YYYY')}
              otherStyles={{
                borderBottomWidth: 0,
                paddingBottom: 0,
              }}
            />
            <SubscriptionInfo
              title={'End Date:'}
              subtitle={moment().add(item.expiry, 'days').format('DD/MM/YYYY')}
              otherStyles={{
                borderBottomWidth: 0,
                paddingBottom: 0,
              }}
            />
          </View>
            {console.log("item data==="+JSON.stringify(item))}
          <SubscriptionInfo
            title={translate('noOfProducts')}
            subtitle={item.allowed_products}
          />
          <SubscriptionInfo
            title={translate('noOfServices')}
            subtitle={item.allowed_services}
          />
          <SubscriptionInfo
            title={translate('noOfEmployees')}
            subtitle={item.allowed_employees}
          />

          <SubscriptionInfo
            title={translate('noOfAddresses')}
            subtitle={item.allowed_addresses}
          />
            {/*<SubscriptionInfo*/}
            {/*    title={translate('commission')}*/}
            {/*    subtitle={item.commission}*/}
            {/*/>*/}
          <View
            style={{
              borderBottomColor: COLORS.gray,
              borderBottomWidth: 1,
              paddingBottom: 20,
              paddingTop: 10,
            }}>
            <SubscriptionInfo
              otherStyles={{
                borderBottomWidth: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              titleStyles={{color: COLORS.primary}}
              subtitleStyles={{color: COLORS.primary, ...FONTS.body3}}
              title={translate('priceLabel')}
              subtitle={item.price}
            />
            {/*{province ? (*/}
            {/*  <>*/}
            {/*    <SubscriptionInfo*/}
            {/*      otherStyles={{*/}
            {/*        borderBottomWidth: 0,*/}
            {/*        paddingBottom: 0,*/}
            {/*      }}*/}
            {/*      titleStyles={{color: COLORS.primary}}*/}
            {/*      subtitleStyles={{color: COLORS.primary}}*/}
            {/*      title={translate("Estimated")+' GST/HST'}*/}
            {/*      isTax={"("+province?.gst_tax_percentage+"%)"}*/}
            {/*      subtitle={helpers.getSubscriptionPercentagePrice(*/}
            {/*        item?.price,*/}
            {/*        province?.gst_tax_percentage,*/}
            {/*      )}*/}
            {/*    />*/}
            {/*    <SubscriptionInfo*/}
            {/*      otherStyles={{*/}
            {/*        borderBottomWidth: 0,*/}
            {/*        paddingBottom: 0,*/}
            {/*      }}*/}
            {/*      titleStyles={{color: COLORS.primary}}*/}
            {/*      subtitleStyles={{color: COLORS.primary}}*/}
            {/*      title={translate("Estimated")+' PST/RST/QST'}*/}
            {/*      isTax={"("+province?.pst_tax_percentage+"%)"}*/}
            {/*      subtitle={helpers.getSubscriptionPercentagePrice(*/}
            {/*        item?.price,*/}
            {/*        province?.pst_tax_percentage,*/}
            {/*      )}*/}
            {/*    />*/}
            {/*  </>*/}
            {/*) : null}*/}
          </View>
          <SubscriptionInfo
            otherStyles={{
              borderBottomWidth: 0,
              marginTop: 10,
            }}
            titleStyles={{...FONTS.body2, fontWeight: '800'}}
            subtitleStyles={{
              ...FONTS.body2,
              fontWeight: '800',
            }}
            title={'Total'}
            // subtitle={`${helpers.getTotalAmountWithTaxas(
            //   province,
            //   item?.price,
            // )} CAD`}
              subtitle={`${
              item?.price} CAD`}
          />




          <AppButton
            loading={is_subscribed === item.id ? true : loading}
            disabled={is_subscribed === item.id}
            onPress={() => {
                if (item?.price === 0) {
                    subscribe_package()
                } else {
                    navigation.navigate('subscription_payment', {

                        item,
                        sub_total: item.price,
                        gst: province
                            ? helpers.getSubscriptionPercentagePrice(
                                item?.price,
                                province?.gst_tax_percentage,
                            )
                            : 0,
                        pst: province
                            ? helpers.getSubscriptionPercentagePrice(
                                item?.price,
                                province?.pst_tax_percentage,
                            )
                            : 0,
                        price: helpers.getTotalAmountWithTaxas(province, item?.price),
                    })
                }
            }
            }

            title={translate('buyNow')}
            otherStyles={{
              marginTop: 30,
            }}
          />
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
