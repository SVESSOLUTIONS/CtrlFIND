import React from 'react';
import {View, Image, TouchableOpacity, Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AppIcon} from '..';
import icons from '../../constants/icons';
import {COLORS} from '../../constants/theme';
import {translate} from "../../multiLang/translation";

const size = 80;

const cameraOptions = {
  mediaType: 'photo',
  maxWidth: 300,
  maxHeight: 300,
  quality: 1,
  cameraType: 'back',
  includeBase64: true,
};

export const AppImagePicker = ({onPickImage, image}) => {
  const onPressImagePicker = (async = () => {
    Alert.alert(translate("Selectavatar"), '', [
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
        const base64_image = result.assets[0].base64;
        onPickImage(`data:image/png;base64,${base64_image}`);
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
        width: size,
        height: size,
        borderWidth: 1,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {!image ? (
        <>
          <AppIcon icon={icons.profile} size={50} color={COLORS.black} />
          <View
            style={{
              position: 'absolute',
              right: -5,
              bottom: 3,
              backgroundColor: COLORS.white,
              borderRadius: 15,
            }}>
            <AppIcon icon={icons.camera} size={30} color={COLORS.black} />
          </View>
        </>
      ) : (
        <Image
          source={{uri: image}}
          style={{
            width: size,
            height: size,
            borderWidth: 1,
            borderRadius: size / 2,
          }}
        />
      )}
    </TouchableOpacity>
  );
};
