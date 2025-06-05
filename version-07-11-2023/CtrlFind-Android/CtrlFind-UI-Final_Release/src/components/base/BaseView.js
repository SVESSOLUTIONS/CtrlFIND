import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {COLORS} from '../../constants/theme';

export const BaseView = ({styles, loading, overlayLoading, children}) => {
  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator
          animating={loading}
          color={COLORS.primary}
          size="large"
        />
      </View>
    );
  }

  return (
    <View style={[{marginTop: 0, paddingTop: 10}, styles]}>
      {overlayLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 10000,
          }}>
          <ActivityIndicator
            animating={overlayLoading}
            color={COLORS.primary}
            size="large"
          />
        </View>
      )}
      {children}
    </View>
  );
};
