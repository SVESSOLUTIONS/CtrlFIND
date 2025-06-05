import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import keys from '../../constants/keys';
import {COLORS} from '../../constants/theme';

export const GooglePlacesInput = ({
  value,
  getFocus = () => {},
  ...otherProps
}) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText(value ? value : '');
  }, [value]);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      fetchDetails={true}
      styles={{
        container: styles.container,
        textInputContainer: styles.textInputContainer,
        textInput: styles.textInput,
        predefinedPlacesDescription: styles.predefinedPlacesDescription,
        poweredContainer: styles.poweredContainer,
        powered: styles.powered,
        listView: styles.listView,
        row: styles.row,
        separator: styles.separator,
        description: styles.description,
        loader: styles.loader,
      }}
      query={{
        key: keys.GOOGLE_API_KEY,
        language: 'en',
        components: 'country:ca'
      }}
      {...otherProps}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    borderRadius: 5,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: COLORS.black,
    fontSize: 15,
    flex: 1,
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: '#c8c7cc',
    borderTopWidth: 0.5,
  },
  powered: {},
  listView: {},
  row: {
    backgroundColor: '#FFFFFF',
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#c8c7cc',
  },
  description: {},
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
});
