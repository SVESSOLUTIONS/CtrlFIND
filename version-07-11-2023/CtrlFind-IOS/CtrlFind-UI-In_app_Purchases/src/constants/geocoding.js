import Geocoder from 'react-native-geocoding';
import keys from './keys';

Geocoder.init(keys.GOOGLE_API_KEY, {language: 'en'});

export const getLatLng = location => {
  Geocoder.from(location)
    .then(json => json.results[0].geometry.location)
    .catch(error => console.warn(error));
};

export default {
  getLatLng,
};
