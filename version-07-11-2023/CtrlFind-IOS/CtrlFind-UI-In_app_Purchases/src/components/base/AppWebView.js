import React from 'react';
import {WebView} from 'react-native-webview';

export const AppWebView = ({html}) => (
  <WebView
    originWhitelist={['*']}
    source={{html: html}}
    textZoom={150}
    setBuiltInZoomControls={false}
  />
);
