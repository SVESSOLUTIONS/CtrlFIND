import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    PermissionsAndroid,
    Platform, Alert,
} from 'react-native';
import helpers from '../../constants/helpers';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import ReadMore from '@fawazahmed/react-native-read-more';
import {FlatGrid} from 'react-native-super-grid';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import {baseURL} from "../../server/baseUrl";
import ReactNativeBlobUtil from "react-native-blob-util";


export const ServiceOrderCard = ({data}) => {
  const slots = data?.appointment_time?JSON.parse(data?.appointment_time) :  [];
  // const img = data?.images?data?.images[0]:null;
  const service = data?.service?data?.service:null;


    const downloadFile = (url,  file_name) => {
        let FILE_URL = `${url.startsWith("/") ? url.slice(1) : url}`;
        let file_ext = getFileExtension(FILE_URL);
        file_ext = "." + file_ext[0];
        var date = new Date();

        const {
            dirs: { DownloadDir, DocumentDir },
        } = ReactNativeBlobUtil.fs;
        const { config } = ReactNativeBlobUtil;
        const isIOS = Platform.OS == "ios";
        const aPath = Platform.select({ ios: DocumentDir, android: DownloadDir });
        const fPath =
            aPath +
            "/" +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            "/file_" +
            file_name +
            file_ext;

        const configOptions = Platform.select({
            ios: {
                fileCache: true,
                path: fPath,
                // mime: 'application/xlsx',
                // appendExt: 'xlsx',
                //path: filePath,
                //appendExt: fileExt,
                notification: true,
            },

            android: {
                fileCache: false,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: fPath,
                    description: "Downloading xlsx...",
                },
            },
        });

        if (isIOS) {
            config(configOptions)
                .fetch("GET", FILE_URL)
                .then((res) => {
                    //this.refs.toast.show('File download successfully');
                    setTimeout(() => {
                        ReactNativeBlobUtil.ios.openDocument(res.data);
                        // Alert.alert(CONSTANTS.APP_NAME,'File download successfully');
                        Alert.alert(translate("successfuloperation")+ translate("filedownloaded"));
                    }, 300);
                })
                .catch((errorMessage) => {
                    console.log(errorMessage, 2000);
                });
        } else {
            config(configOptions)
                .fetch("GET", FILE_URL)
                .then((res) => {
                    ReactNativeBlobUtil.android.actionViewIntent(res.path());

                    console.log("File download successfully", 2000);
                    Alert.alert(translate("successfuloperation")+ translate("filedownloaded"));
                })
                .catch((errorMessage, statusCode) => {
                    console.log(errorMessage, 2000);
                });
        }
    };


    const checkFilePermission = async (url,  file_name)  => {
        if (Platform.OS === 'ios') {
            downloadFile(url,  file_name);

        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: translate("StoragePermission"),
                        message: translate("Appaccessstorage"),
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Storage Permission Granted.');
                    downloadFile(url,  file_name);
                } else {
                    alert(translate("PermissionNotGranted"));
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };




  const checkPermission = async url => {
    if (Platform.OS === 'ios') {
        saveToCameraRoll(url);
      // onDownload(url);

    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: translate("StoragePermission"),
            message: translate("Photoaccessstorage"),
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage Permission Granted.');
          onDownload(url);
        } else {
            alert(translate("PermissionNotGranted"));
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };


    const onDownload = image_URL => {
        let date = new Date();
        let ext = getExtention(image_URL);

        console.log(image_URL)
        ext = '.' + ext[0];
        const {config, fs} = ReactNativeBlobUtil;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path:
                    PictureDir +
                    '/image_' +
                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                    ext,
                description: 'Image',
            },
        };
        config(options)
            .fetch('GET', image_URL)
            .then(res => {
                // Showing alert after successful downloading
                // console.log('res -> ', JSON.stringify(res));
                alert(translate("ImageDownloaded"));
            });
    };


   const saveToCameraRoll = (image) => {
       console.log("Image=======",image)
       console.log("OS=======",Platform.OS)

        if (Platform.OS === 'android') {
            ReactNativeBlobUtil
                .config({
                    fileCache : true,
                    appendExt : 'jpg'
                })
                .fetch('GET', image)
                .then((res) => {
                    CameraRoll.save(res.path())
                        .then(()=>{
                            console.log("Success","Success")
                            Alert.alert(translate("success")+ translate("Photoaddedcamera"))})
                        .catch(err => console.log('err:', err))})
        } else {
            CameraRoll.save(image)
                .then(()=>{
                    console.log("Success","Success")
                    Alert.alert(translate("success")+ translate("Photoaddedcamera"))})
                .catch(err => console.log('err:', err))
        }
    }

  const getExtention = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

    const getFileExtension = (fileUrl) => {
        return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
    };
  return (
    <View
      style={{
        marginTop: 0,
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1,
        paddingBottom: 20,
      }}>
        <View style={{flex:1,alignItems:'flex-end',marginVertical:10,marginBottom:5}}>
            <View style={{flexDirection: 'row', alignItems: 'flex-start',}}>
                <Text
                    style={{
                        ...FONTS.body4,
                        color: COLORS.gray,
                        fontSize: 13,
                        marginRight: 2,
                    }}>

                    {
                        data?.amount<=0? 0 :data?.service_status==="Decline"||data?.service_status==="Cancelled"?data.sub_total:
                            data?.require_appointment === 'Y' ? parseFloat((data?.sub_total) / slots.length).toFixed(1): parseFloat(data?.sub_total).toFixed(2)} CAD
                </Text>
                <Text
                    style={{
                        ...FONTS.body4,
                        color: COLORS.gray,
                        fontSize: 13,
                        marginRight: 2,
                    }}>
                    x {
                    data?.require_appointment === 'Y' ? slots.length :  1}
                </Text>

                {/*{console.log(data?.provider)}*/}

                {data?.provider?.is_paying_taxes===1 && data?.service?.taxable==="Y"?
                    <Text
                        style={{
                            ...FONTS.body4,
                            color: COLORS.gray,
                            fontSize: 13,
                            marginRight: 2,
                        }}>
                        + Taxes
                    </Text>
                    :null}

            </View>
            {data?.extra_service_fee_status === 'paid' ? (
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Text style={{...FONTS.body4, color: COLORS.gray, fontSize: 13}}>
                        + {data?.extra_service_fee-(data?.extra_fee_gst+data?.extra_fee_pst)} CAD
                    </Text>
                    <Text
                        style={{
                            ...FONTS.body4,
                            color: COLORS.gray,
                            fontSize: 13,
                            marginLeft: 2,
                        }}>
                        + Taxes
                    </Text>
                </View>

            ) : null}





        </View>

        <View
        style={{
          flexDirection: 'row',
            flex:1
        }}>

        <View style={{flexDirection: 'row', flex: 1}}>
          <View
            style={{
              width: 80,
              height: 85,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.lightGray,
            }}>
              {console.log("img"+JSON.stringify(data?.service?.file_path))}
            {data?.service?.file_path ? (
              <Image
                source={{uri: helpers.get_image(data?.service?.file_path)}}
                style={{
                  width: 80,
                  height: 85,
                  borderRadius: 10,
                }}
              />
            ) : (
              <Text style={{...FONTS.body4, fontSize: 9}}>
                {translate('noImage')}
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginHorizontal: 15,
              flex: 1,
            }}>
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.black,
                fontWeight: '600',
                fontSize: 18,
                lineHeight: 20,
              }}>
              {service?.title}
            </Text>

            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.gray,
                lineHeight: 14,
                fontSize: 12,
              }}>
              {data?.appointment_date}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.gray,
                lineHeight: 14,
                fontSize: 12,
              }}>
              {translate(data?.location)}
            </Text>
            <Text
              style={{
                ...FONTS.body4,
                color: COLORS.gray,
                lineHeight: 16,
                fontSize: 12,
              }}>
              {data?.require_appointment === 'Y' ? (
                <>
                  <Text style={{fontSize: 10}}>
                    {helpers.getAccurateTimeSlot(slots)}
                  </Text>
                </>
              ) : null}
            </Text>
            <Text
              style={{
                color: COLORS.black,
                fontWeight: 'bold',
                fontSize: 18,
                  flex:1
              }}>
              {data?.amount<=0? 0 :parseFloat(data?.sub_total).toFixed(2)} CAD
            </Text>
          </View>
        </View>

          {/*{console.log("yeh data"+JSON.stringify(data))}*/}

      </View>
      {data?.information ? (
        <View>
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.black,
              fontWeight: '700',
              fontSize: 15,
              marginTop: 10,
              lineHeight: 20,
            }}>
            Additional Information:
          </Text>
          <ReadMore
            seeMoreStyle={{color: COLORS.primary}}
            seeLessStyle={{color: COLORS.primary}}
            numberOfLines={2}
            style={{
              ...FONTS.body4,

              color: COLORS.gray,
              lineHeight: 16,
              fontSize: 12,
            }}>
            {data?.information}
          </ReadMore>
        </View>
      ) : null}
      {data?.images?.length > 0 ? (
        <FlatGrid
          itemDimension={90}
          data={data?.images}
          style={{flex: 1, marginHorizontal: -8}}
          // staticDimension={300}
          // fixed
          spacing={7}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: '#eeeeee',
                borderRadius: 11,
                borderColor: COLORS.gray,
                borderWidth: 1,
              }}>
              <Image
                style={{
                  height: undefined,
                  width: '100%',
                  aspectRatio: 1,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                source={{uri: helpers.get_image(item?.file_path)}}
              />
              <TouchableOpacity
                onPress={() =>
                  checkPermission(helpers.get_image(item?.file_path))
                }>
                <Image
                  source={require('../../assets/downloadArrow.png')}
                  style={{
                    width: 15,
                    height: 15,
                    alignSelf: 'flex-end',
                    marginVertical: 5,
                    marginHorizontal: 3,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : null}
        <View style={{flex:1}}>
        {data?.attachment||data?.attachment_1||data?.attachment_2?
                <Text
                    style={{
                        ...FONTS.h2,
                        color: COLORS.black,
                        fontWeight: '700',
                        fontSize: 15,
                        marginTop: 10,
                        lineHeight: 20,
                    }}>
                    Document:
                </Text>
            :null}

                <View style={{flexDirection:'row',justifyContent:"space-between"}}>

                    {data?.attachment?
                <TouchableOpacity
                    onPress={() =>
                        checkFilePermission(helpers.get_Appointment_Document(data?.attachment),data?.attachment)
                    }
                    style={{
                        marginTop:7,
                        backgroundColor: "#eeeeee",
                        borderRadius: 11,
                        borderColor: COLORS.gray,
                        borderWidth: 1,
                     height:110,
                        width:95,
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                    <Image
                        style={{
                            height: 85,
                            width: 75,

                        }}
                        source={require("../../assets/downloadattachmentFile.png")}
                    />
                    </TouchableOpacity>
                        :null}
                    {data?.attachment_1?
                <TouchableOpacity
                    onPress={() =>
                        checkFilePermission(helpers.get_Appointment_Document(data?.attachment_1),data?.attachment_1)
                    }
                    style={{
                        marginTop:7,
                        backgroundColor: "#eeeeee",
                        borderRadius: 11,
                        borderColor: COLORS.gray,
                        borderWidth: 1,
                        height:110,
                        width:95,
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                    <Image
                        style={{
                            height: 85,
                            width: 75,

                        }}
                        source={require("../../assets/downloadattachmentFile.png")}
                    />

                </TouchableOpacity>:null}
                    {data?.attachment_2 ?
                        <TouchableOpacity
                            onPress={() =>
                                checkFilePermission(helpers.get_Appointment_Document(data?.attachment_2),data?.attachment_1)
                            }
                            style={{
                                marginTop: 7,
                                backgroundColor: "#eeeeee",
                                borderRadius: 11,
                                borderColor: COLORS.gray,
                                borderWidth: 1,
                                height: 110,
                                width: 95,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <Image
                                style={{
                                    height: 85,
                                    width: 75,

                                }}
                                source={require("../../assets/downloadattachmentFile.png")}
                            />
                        </TouchableOpacity> : null
                    }
                </View>




        </View>

    </View>
  );
};
