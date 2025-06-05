import {DrawerActions} from '@react-navigation/native';
import React from 'react';

export const navigationRef = React.createRef();

const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

const jumpTo = (name, params) => {
  navigationRef.current?.jumpTo(name, params);
};

const goBack = () =>
  navigationRef.current?.canGoBack() ? navigationRef.current?.goBack() : null;

const closeDrawer = () =>
  navigationRef.current?.dispatch(DrawerActions.closeDrawer());

export default {
  navigate,
  goBack,
  closeDrawer,
  jumpTo,
};
