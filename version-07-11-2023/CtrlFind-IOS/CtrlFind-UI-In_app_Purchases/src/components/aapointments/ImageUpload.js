import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {COLORS} from "../../constants/theme";
import {translate} from "../../multiLang/translation";
export const ImageUpload = ({onPickImage}) => {
  const cameraOptions = {
    mediaType: 'photo',
    maxWidth: 300,
    maxHeight: 300,
    quality: 1,
    cameraType: 'front',
    includeBase64: true,
  };

  const onPressImagePicker = (async = () => {
    Alert.alert(translate("Selectimage"), '', [
      {
        text: translate("Takephoto"),
        onPress: () => handlerImagePicker('camera'),
      },
      {
        text: translate("Chooselibrary"),
        onPress: () => handlerImagePicker('library'),
      },
      {
        text: translate("cancel"),
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  });

  const handlerImagePicker = async type => {
    let result;
    try {
      if (type === 'camera') {
        result = await launchCamera(cameraOptions);
      } else if (type === 'library') {
        result = await launchImageLibrary(cameraOptions);
      }
      if (result.didCancel) {
        console.log('canceled');
      }
      if (result.errorCode) {
        console.log(result.errorMessage);
      } else if (result.assets) {
        const {fileName, type, base64} = result.assets[0];
        onPickImage({fileName, type, uri: `data:image/png;base64,${base64}`});
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPressImagePicker}
      style={{
        height: 120,
        borderColor: '#6B6B6B',
        borderWidth: 2,
        borderStyle: 'dotted',
        backgroundColor: '#F1FEFE',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 15,
            fontWeight: 'bold',
            marginLeft: 5,
          }}>
            {translate("Browse")}
        </Text>
      </View>
      {/* <Text style={{color: '#6B6B6B', marginTop: 10}}>Max file size:20MB</Text> */}
    </TouchableOpacity>
  );
};
