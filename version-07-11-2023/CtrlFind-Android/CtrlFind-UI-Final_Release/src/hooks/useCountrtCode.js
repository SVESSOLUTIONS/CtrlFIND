import {useEffect, useState} from 'react';
import DeviceCountry, {TYPE_TELEPHONY} from 'react-native-device-country';
import CountrtCodes from '../constants/CountryCodes.json';

export default useCountryCode = () => {
  const [dialCode, setDialCode] = useState('');
  useEffect(() => {
    DeviceCountry.getCountryCode(TYPE_TELEPHONY)
      .then(result => {
        if (result) {
          const {code} = result;
          CountrtCodes.map(c =>
            c.code.toUpperCase() === code.toUpperCase()
              ? setDialCode(c.dial_code)
              : null,
          );
        }
      })
      .catch(e => {
        DeviceCountry.getCountryCode()
          .then(result => {
            if (result) {
              const {code} = result;
              CountrtCodes.map(c =>
                c.code.toUpperCase() === code.toUpperCase()
                  ? setDialCode(c.dial_code)
                  : null,
              );
            }
          })
          .catch(e => console.log(e));
      });
  }, []);

  return {dialCode};
};
