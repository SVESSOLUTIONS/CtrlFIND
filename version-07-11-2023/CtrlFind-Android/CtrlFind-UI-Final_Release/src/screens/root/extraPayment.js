import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppForm,
  AppFormInput,
  AppHeader,
  BaseView,
  SubmitButton,
} from '../../components';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
import {extraPaymentRequest} from '../../store/reducers/orders';

const validationSchema = Yup.object().shape({
  amount: Yup.string().required().label('Amount'),
  discription: Yup.string().label('Description'),
});

export const ExtraPaymentScreen = ({navigation, route}) => {
  const {order} = route.params;
  const dispatch = useDispatch();
  const {serverLoading} = useSelector(state => state.orders);

  return (
    <>
      <AppHeader title={translate('extraServiceFees')} />
      <BaseView styles={styles.container}>
        <AppForm
          initialValues={{
            amount: '',
            discription: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values =>
            dispatch(extraPaymentRequest({id: order?.id, values: values}))

          }>

          <Text numberOfLines={1} style={styles.inputTitle}>
            Amount
          </Text>
          <AppFormInput
            name="amount"
            placeholder="amount"
            keyboardType="number-pad"
            otherStyles={{
              marginTop: 3,
            }}
          />
          <Text numberOfLines={1} style={styles.inputTitle}>
            Description
          </Text>
          <AppFormInput
            name="discription"
            placeholder="description"
            inputStyles={{
              textAlignVertical: 'top',
              justifyContent: 'flex-start',
              height: 100,
              paddingTop: 10,
            }}
            otherStyles={{
              height: 100,
              marginTop: 3,
            }}
            multiline={true}
            numberOfLines={4}
          />
          <SubmitButton title="Update" loading={serverLoading} />
        </AppForm>
        <View style={{height: 40}} />
      </BaseView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  inputTitle: {
    ...FONTS.body4,
    fontWeight: '600',
    color: COLORS.gray,
    marginTop: 10,
  },
});
