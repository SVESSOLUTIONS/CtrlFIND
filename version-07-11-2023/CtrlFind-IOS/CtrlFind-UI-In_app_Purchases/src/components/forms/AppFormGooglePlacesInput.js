import {useFormikContext} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {GooglePlacesInput} from '..';
import geocoding from '../../constants/geocoding';
import {ErrorMessage} from './ErrorMessage';

export const AppFormGooglePlacesInput = ({
  name,
  onGetPlaceId = () => {},
  ...otherProps
}) => {
  const {values, errors, touched, setFieldValue, setFieldTouched} =
    useFormikContext();
  return (
    <>
      <GooglePlacesInput
        {...otherProps}
        onPress={(data, details = null) => {
            // alert("details===",details)
            console.log("details===",JSON.stringify(details)+"data==="+JSON.stringify(data))
          const {description, place_id} = data;
          let region;
          for (var i = 0; i < details.address_components.length; i++) {
            if (
              details.address_components[i].types[0] ==
              'administrative_area_level_1'
            ) {
              region = details.address_components[i]?.short_name;
            }
          }
          const location = details?.geometry?.location;
          setFieldValue(name, description);
          onGetPlaceId(place_id, description, location, region);
        }}
        onBlur={() => setFieldTouched(name)}
        value={values[name]}
      />
      <View style={{marginHorizontal: 10}}>
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      </View>
    </>
  );
};
