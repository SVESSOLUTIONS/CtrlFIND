import React from 'react';
import {View, Text, TouchableOpacity, Alert,PermissionsAndroid, Platform } from 'react-native';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';
import {AppButton, AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {AppForm} from '../forms/AppForm';
import {AppFormInput} from '../forms/AppFormInput';
import {SubmitButton} from '../forms/SubmitButton';
import Geolocation from 'react-native-geolocation-service';
import keys from "../../constants/keys";
const URL =
    /^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\\+,;=]|:)@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\\+,;=]|:|@)))?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?))?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\\+,;=]|:|@)|\/|\?))?$/i;



const GOOGLE_API_KEY = keys.GOOGLE_API_KEY;



const getLiveLocationUrl = () => {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then(granted => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        getCurrentLocation(resolve, reject);
                    } else {
                        reject('Permission denied');
                    }
                })
                .catch(error => {
                    reject(error);
                });
        } else if (Platform.OS === 'ios') {
            getCurrentLocation(resolve, reject);
        }
    });
};

const getCurrentLocation = (resolve, reject) => {
    Geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const locationUrl = generateLocationUrl(latitude, longitude);
            console.log('Live Location URL:', locationUrl);
            resolve(locationUrl);
        },
        error => {
            console.log(error.code, error.message);
            reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
};

const generateLocationUrl = (latitude, longitude) => {
    const mapUrlTemplate = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    return mapUrlTemplate;
};






const validationSchema = Yup.object().shape({
    url: Yup.string().required().matches(URL, 'Enter a valid url').label('URL'),
});

export const TrackLocation = ({onPress, onUpdateTrackingState}) => {
    const {serverLoading, orderdetail} = useSelector(state => state.orders);

    const onPressLiveLocation = values => {
        Alert.alert(
            translate("confirmTitle") + (values.is_tracking === 0 ? translate("Turnofflivelocation") : translate("Turnonlivelocation")),
            '',
            [
                {
                    text: translate("OK"),
                    onPress: async () => {
                        try {
                            const url = await getLiveLocationUrl();
                            console.log("URL:", url);
                            onUpdateTrackingState({
                                url: values.is_tracking === 0 ? "" : url,
                                is_tracking: values?.is_tracking,
                            });
                        } catch (error) {
                            console.log('Error:', error);
                        }
                    },
                },
                {
                    text: translate("cancel"),
                    onPress: () => {},
                    style: 'cancel',
                },
            ]
        );
    };

    return (
        <View
            style={{
                backgroundColor: COLORS.white,
                borderRadius: 10,
                overflow: 'hidden',
            }}>
            <View
                style={{
                    height: 50,
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        ...FONTS.h3,
                        color: COLORS.white,
                        fontWeight: '500',
                        flex: 1,
                    }}>
                    {translate('trackLocation')}
                </Text>

                <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
                    <AppIcon icon={icons.close} size={15} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            <AppForm
                initialValues={{
                    url: orderdetail?.tracking_url ? orderdetail.tracking_url : '',
                }}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={values =>
                    onUpdateTrackingState({
                        url: values.url,
                        is_tracking: orderdetail?.is_tracking,
                    })
                }>
                <View
                    style={{
                        marginTop: 20,
                        paddingHorizontal: 15,
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            ...FONTS.h3,
                            fontWeight: '500',
                        }}>
                        {translate('liveUrl')}
                    </Text>


                    <AppFormInput placeholder="Enter url" name="url" />
                </View>
                <View style={{paddingHorizontal: 15, marginTop: 10}}>
                    <SubmitButton
                        title={translate('submit')}
                        loading={serverLoading}
                        otherStyles={{marginBottom: 20, backgroundColor: COLORS.black}}
                    />
                    <Text
                        style={{
                            ...FONTS.h3,
                            textAlign: 'center',
                            color: COLORS.gray,
                        }}>
                        OR
                    </Text>
                    {orderdetail?.is_tracking ? (
                        <AppButton
                            title={translate("OFFLiveLocation")}
                            loading={serverLoading}
                            onPress={() =>
                                onPressLiveLocation({
                                    is_tracking: 0,
                                })
                            }
                            otherStyles={{marginBottom: 20, backgroundColor: COLORS.error}}
                        />
                    ) : (
                        <AppButton
                            title={translate("ONLiveLocation")}
                            loading={serverLoading}
                            onPress={() =>
                                onPressLiveLocation({
                                    is_tracking: 1,
                                })
                            }
                            otherStyles={{marginBottom: 20}}
                        />
                    )}
                </View>
            </AppForm>
        </View>
    );
};
