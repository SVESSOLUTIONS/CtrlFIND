import React from 'react';
import {View, Text, Image} from 'react-native';
import helpers from '../../constants/helpers';
import {COLORS, FONTS} from '../../constants/theme';
import {translate} from '../../multiLang/translation';
export const OrderCard = ({data,provider}) => {
  return (
      <View>
          <View style={{flexDirection: 'row', justifyContent:'flex-end',marginTop:10}}>
              <Text style={{...FONTS.body4, color: COLORS.gray, fontSize: 15,marginRight:3}}>
                  {(data?.sub_total-data?.discount)<=0? 0:parseFloat(data?.sub_total-data?.discount).toFixed(2)} CAD
              </Text>
              <Text style={{...FONTS.body4, color: COLORS.gray, fontSize: 15,marginRight:3}}>
                  x {data?.qty}
              </Text>
              {(data?.gst||data?.pst>0)&&(provider?.is_paying_taxes===1)?
                  <Text style={{...FONTS.body4, color: COLORS.gray, fontSize: 15}}>
                      + {translate("Taxes")}
                  </Text>
                  :null}
          </View>

    <View
      style={{
        flexDirection: 'row',
        marginTop: 5,
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 1,
        paddingBottom: 20,

      }}>

      <View style={{flexDirection: 'row', flex: 1}}>
        <View
          style={{
            width: 80,
            height: 85,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.lightGray,
          }}>
          {data?.img ? (
            <Image
              source={{uri: helpers.get_image(data?.img)}}
              style={{
                width: 80,
                height: 85,
                borderRadius: 10,
              }}
            />
          ) : (
            <Text style={{...FONTS.body4, fontSize: 9}}>
              {translate('noImage')}
            </Text>
          )}
        </View>
          {/*{console.log("product"+JSON.stringify(provider))}*/}

          <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginHorizontal: 15,
            flex: 1,
          }}>
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.black,
              fontWeight: '600',
              fontSize: 18,
              lineHeight: 20,
            }}>
            {data?.name}
          </Text>

          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.gray,
              lineHeight: 14,
              fontSize: 12,
            }}>
            {translate('size')}
            {data?.size}
          </Text>
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.gray,
              lineHeight: 14,
              fontSize: 12,
            }}>
            {translate('color')} {data?.color}
          </Text>
          <Text
            style={{
              color: COLORS.black,
              fontWeight: 'bold',
              lineHeight: 20,
              fontSize: 18,
            }}>
            {(data?.sub_total-data?.discount)<=0? 0:parseFloat((data?.sub_total-data?.discount) * data?.qty).toFixed(2)} CAD
          </Text>
        </View>
      </View>
    </View>

    </View>
  );
};
