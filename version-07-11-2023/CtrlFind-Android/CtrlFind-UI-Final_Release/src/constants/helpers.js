import moment from 'moment';
import en from '../multiLang/en.json';
import fr from '../multiLang/fr.json';
import {URL} from '../server/baseUrl';
import labels from './labels';

const SERVICE_PROVIDER = 'Service Provider';
const BUYER = 'Buyer';
const GUEST = 'Guest';

const ORDER_PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
};

const provider_menu_items = [
  {title: 'home', icon: 'home', route: 'home'},
  {
    title: 'appointmentTitle',
    icon: 'appointments',
    route: 'appointments',
  },
  {
    title: 'notificationsTitle',
    icon: 'notifications',
    route: 'notifications',
  },
  {title: 'profile', icon: 'profile', route: 'profile'},
  {title: 'shopTitle', icon: 'shop', route: 'shop'},
  {title: 'basketTitle', icon: 'basket', route: 'basket'},
  {
    title: 'subscriptionTitle',
    icon: 'subscriptions',
    route: 'subscriptions',
  },
  {title: 'faqsTitle', icon: 'faqs', route: 'faqs'},
  {title: 'privacyPolicy', icon: 'privacy', route: 'privacy'},
  {title: 'chatTitle', icon: 'chat', route: 'chat'},
  {title: 'logout', icon: 'logout', route: 'logout'},
];

// {id: 5, name: 'Orders', icon: icons.orders, route: 'orders'},

const buyer_menu_items = [
  {title: 'home', icon: 'home', route: 'home'},
  {title: 'orders', icon: 'orders', route: 'buyerOrders'},
  {
    title: 'appointmentTitle',
    icon: 'appointments',
    route: 'buyer_appointments_stack',
  },
  {
    title: 'notificationsTitle',
    icon: 'notifications',
    route: 'notifications',
  },
  {title: 'profile', icon: 'profile', route: 'profile'},
  {title: 'basketTitle', icon: 'basket', route: 'basket'},
  {title: 'faqsTitle', icon: 'faqs', route: 'faqs'},
  {title: 'chatTitle', icon: 'chat', route: 'chat'},
  {title: 'logout', icon: 'logout', route: 'logout'},
];

const getMenuItems = role_id =>
    getRole(role_id) === BUYER ? buyer_menu_items : provider_menu_items;

const guest = {
  avatar: 'users/default.png',
  created_at: '2022-01-20T08:06:18.000000Z',
  email: 'guest@gmail.com',
  email_verified_at: null,
  fb_id: null,
  id: 99999,
  name: 'Guest',
  otp: null,
  phone: '+11111111111',
  phone_number_confirmed: 0,
  role_id: 9,
  settings: [],
  updated_at: '2022-01-25T18:29:55.000000Z',
};

const get_Appointment_Document = appointment_File =>
    appointment_File
        ? appointment_File?.includes('http')
            ? appointment_File
            : appointment_File?.includes('base64')
                ? appointment_File
                : 'https://ctrlfind.ca//storage/appointments/' + appointment_File
        : null;

const get_image = user_Img =>
    user_Img
        ? user_Img?.includes('http')
            ? user_Img
            : user_Img?.includes('base64')
                ? user_Img
                : URL + user_Img
        : null;

const getRole = role_id =>
    role_id === 2
        ? BUYER
        : role_id === 3
            ? SERVICE_PROVIDER
            : role_id === 9
                ? GUEST
                : null;

const getItemPrice = item => {
  if (item?.discount_available == 'Y') {
    if (moment(item?.discount_start_date).isAfter(new Date())) {
      return parseFloat(item?.price).toFixed(1);
    }
    if (moment(item?.discount_end_date).isBefore(new Date())) {
      return parseFloat(item?.price).toFixed(1);
    }
    if (moment(item?.discount_end_date).isAfter(item?.discount_start_date)) {
      if (item?.discount_type === 'FLAT') {
        return parseFloat(item?.price - item?.discount).toFixed(1);
      } else {
        return parseFloat(
            item?.price - (item?.discount / 10) * (item?.price / 10),
        ).toFixed(1);
      }
    } else {
      return parseFloat(item?.price).toFixed(1);
    }
  } else {
    return parseFloat(item?.price).toFixed(1);
  }
};
const getDiscountPrice = item => {
  if (item?.discount_available == 'Y') {
    if (moment(item?.discount_start_date).isAfter(new Date())) {
      return null;
    }
    if (moment(item?.discount_end_date).isBefore(new Date())) {
      return null;
    }
    if (moment(item?.discount_end_date).isAfter(item?.discount_start_date)) {
      if (item?.discount_type === 'FLAT') {
        return '' + parseFloat(item?.price - item?.discount).toFixed(1);
      } else {
        return (
            '' +
            parseFloat(
                item?.price - (item?.discount / 10) * (item?.price / 10),
            ).toFixed(1)
        );
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const getRating = rating =>
    rating !== null || rating !== undefined ? Math.floor(rating) : 0;

const getDistanceInKm = distance => (distance ? parseInt(distance / 1000) : 0);

const toFloat = val => (val ? parseFloat(val) : 0);

const islimitExceeed = (subscribe, type, count = 0) => {
  if (subscribe && type) {
    return subscribe?.[`allowed_${type}`] <= count ? true : false;
  }
};

const isProfileIsNotComplete = user =>
    user.phone === null ||
    user.phone === '' ||
    (user.address_home === null && user.address_office === null);

const getDeliverAddress = user => {
  if (user?.home_lat && user?.office_lat) {
    return labels.ALL_ADDRESSES;
  }
  if (user?.home_lat) {
    return labels.WITH_HOME;
  }
  if (user?.office_lat) {
    return labels.WITH_OFFICE;
  } else {
    return labels.ELSE_OTHERS;
  }
};

const getProductDeliveryTypes = label => {
  if (label === en.pickup || label === fr.pickup) {
    return 'pickup';
  }
  if (label === en.expressDelivery || label === fr.expressDelivery) {
    return 'expressDelivery';
  }
  if (label === en.standardDelivery || label === fr.standardDelivery) {
    return 'standardDelivery';
  }
};

const getServiceDeliveryTypes = label => {
  if (label === en.PickupService || label === fr.PickupService) {
    return 'PickupService';
  }
  if (label === en.DeliveryService || label === fr.DeliveryService) {
    return 'DeliveryService';
  }
};

const checkOrderExtraFees = order => {
  if (order?.service_status === 'InProgress')
    return order?.extra_service_fee_status;
  else return 'null';
};

const getTaxableAmount = (item, percent) => {
  if (item.taxable !== 'Y') return 0;
  const taxablePrice = parseFloat(item.price) * item.qty;
  const percentPrice = (percent / 100) * taxablePrice;
  return parseFloat(percentPrice).toFixed(2);
};

const getSubscriptionPercentagePrice = (price,discount) => {
  const percentagePrice= (discount/100)*price

  return parseFloat(percentagePrice).toFixed(2)

};



const getPercentagePrice = (cartItem, discount, type, user1) => {
  const totalAmount = getTotalAmount(cartItem.items);
  // const taxableAmount = cartItem.items.reduce((acc, item) => {
  //   const itemTaxableAmount = getTaxableAmount(item, percent);
  //   return acc + itemTaxableAmount;
  // }, 0);
  const discountAmount =
      discount === undefined
          ? 0
          : type === 'flat'
              ? discount
              : (totalAmount * discount) / 100;
  const discountedTotal = totalAmount - discountAmount;
  const gstAmount = getTaxableAmount(
      cartItem,
      user1?.buyer_province?.gst_tax_percentage,
  );
  const pstAmount = getTaxableAmount(
      cartItem,
      user1?.buyer_province?.pst_tax_percentage,
  );
  const totalTaxAmount = parseFloat(gstAmount) + parseFloat(pstAmount);
  const totalPrice = parseFloat(discountedTotal) + parseFloat(totalTaxAmount);
  return parseFloat(totalPrice).toFixed(2);
};

const getItemDiscountAmount = (
    item,
    total,
    discount,
    user,
    selectedProvider,
) => {
  console.log('item.price' + JSON.stringify(item.price));
  console.log('total' + JSON.stringify(total));
  console.log('discount' + JSON.stringify(discount));

  if (!discount) return 0;

  if (item?.taxable === 'Y') {
    const gst =
        item?.taxable === 'Y' && selectedProvider?.is_paying_taxes === 1
            ? getPercentagePrice(
                item?.price - discount,
                user?.buyer_province?.gst_tax_percentage,
            )
            : 0;
    const pst =
        item?.taxable === 'Y' && selectedProvider?.is_paying_taxes === 1
            ? getPercentagePrice(
                item?.price - discount,
                user?.buyer_province?.pst_tax_percentage,
            )
            : 0;
    const pricewithgstpst =
        item?.price - discount + (Number(gst) + Number(pst));
    console.log('pricewith gst pst' + pricewithgstpst);
    const percentPrice = (total / discount) * pricewithgstpst;
    return parseFloat(percentPrice).toFixed(1);
  }

  const percentPrice = (total / discount) * item?.price;
  return parseFloat(percentPrice).toFixed(1);
};
const getTotalAmountWithTaxas = (province, price) => {
  if (!province) return price;
  const actualPrice = Number(price);
  const gstPrice = (province?.gst_tax_percentage / 100) * actualPrice;
  const pstPrice = (province?.pst_tax_percentage / 100) * actualPrice;
  const priceWithTaxes = actualPrice + gstPrice + pstPrice;
  return parseFloat(priceWithTaxes).toFixed(2);
};

const getTotalAmountWithItemTaxas = (
    user,
    buyerData,
    price,
    items,
    discount,
    type,
) => {
  const role = 'provider';
  if (!discount) {
    if (role === 'provider')
      if (!user?.is_paying_taxes || items.taxable === 'N') return price;
    if (!buyerData?.buyer_province) return price;
    const actualPrice = Number(price);
    const taxableItemsPrice = getTotalAmount(
        items.filter(i => i.taxable === 'Y'),
    );
    const gstPrice =
        (buyerData?.buyer_province?.gst_tax_percentage / 100) * taxableItemsPrice;
    const pstPrice =
        (buyerData?.buyer_province?.pst_tax_percentage / 100) * taxableItemsPrice;
    const priceWithTaxes = actualPrice + gstPrice + pstPrice;
    return parseFloat(priceWithTaxes).toFixed(2);
  } else {
    if (type === 'flat') {
      if (role === 'provider') {
        if (!user?.is_paying_taxes || !buyerData?.buyer_province) {
          const priceWithDiscount = price;
          return priceWithDiscount;
        }
      } else {
        if (!buyerData?.buyer_province) {
          const priceWithDiscount = price;
          return priceWithDiscount;
        }
      }

      const actualPrice = Number(price);
      const taxableItemsPrice = getTotalAmount(
          items.filter(i => i.taxable === 'Y'),
      );
      const taxableItemsPriceAfterGstPst = taxableItemsPrice - discount;
      {
        console.log(
            'taxableItemsPriceAfterGstPst' + taxableItemsPriceAfterGstPst,
        );
      }
      const gstPrice =
          (buyerData?.buyer_province?.gst_tax_percentage / 100) *
          taxableItemsPriceAfterGstPst;
      const pstPrice =
          (buyerData?.buyer_province?.pst_tax_percentage / 100) *
          taxableItemsPriceAfterGstPst;
      const priceWithTaxes = actualPrice + gstPrice + pstPrice;
      {
        console.log('actual' + actualPrice);
      }
      {
        console.log('priceWithTaxes' + priceWithTaxes);
      }

      const priceWithDiscount = priceWithTaxes - discount;
      return parseFloat(priceWithDiscount).toFixed(2);
    } else {
      if (role === 'provider') {
        if (!user?.is_paying_taxes || !buyerData?.buyer_province) {
          const priceWithDiscount = price - (price * discount) / 100;
          return priceWithDiscount;
        }
      } else {
        if (!buyerData?.buyer_province) {
          const priceWithDiscount = price - (price * discount) / 100;
          return priceWithDiscount;
        }
      }
      const actualPrice = Number(price);
      const taxableItemsPrice = getTotalAmount(
          items.filter(i => i.taxable === 'Y'),
      );
      const taxableItemsPriceAfterGstPst =
          type === (taxableItemsPrice * discount) / 100;
      {
        console.log(
            'taxableItemsPriceAfterGstPst' + taxableItemsPriceAfterGstPst,
        );
      }
      const gstPrice =
          (buyerData?.buyer_province?.gst_tax_percentage / 100) *
          taxableItemsPriceAfterGstPst;
      const pstPrice =
          (buyerData?.buyer_province?.pst_tax_percentage / 100) *
          taxableItemsPriceAfterGstPst;
      const priceWithTaxes = actualPrice + gstPrice + pstPrice;
      const priceWithDiscount =
          priceWithTaxes - (priceWithTaxes * discount) / 100;
      return parseFloat(priceWithDiscount).toFixed(2);
    }
  }
};

const getDiscountActualAmount = (
    item,
    total,
    discount,
    type,
    user,
    selectedProvider,
) => {
  if (discount === undefined) return 0;

  console.log('discount' + discount);
  console.log('item.taxtable' + item?.taxable);
  console.log(
      'selectedProvider?.is_paying_taxes' + selectedProvider?.is_paying_taxes,
  );

  if (type === 'flat') {
    //
    // if (item?.gst||item?.pst){
    //  const pricewithgstpst=(item.price+(item?.gst+item?.pst))
    //
    //   const discountPriceInPercentage=((pricewithgstpst/total)*100)
    //
    //   console.log("discountPriceInPercentage"+discountPriceInPercentage)
    //
    //   const discountAmount=((discountPriceInPercentage/100)*discount)
    //   console.log("discountPriceInPercentage"+discountAmount)
    //
    //   return Number(discountAmount);
    //
    // }

    if (item?.taxable === 'Y') {
      const gst =
          item?.taxable === 'Y' && selectedProvider?.is_paying_taxes === 1
              ? getPercentagePrice(
                  item?.price - discount,
                  user?.buyer_province?.gst_tax_percentage,
              )
              : 0;
      const pst =
          item?.taxable === 'Y' && selectedProvider?.is_paying_taxes === 1
              ? getPercentagePrice(
                  item?.price - discount,
                  user?.buyer_province?.pst_tax_percentage,
              )
              : 0;

      const pricewithgstpst = item.price - discount + Number(gst) + Number(pst);

      console.log('Number(gst)' + Number(gst));
      console.log('Number(pst)' + Number(pst));
      console.log('item.price (pst)' + item.price);

      const discountPriceInPercentage = (pricewithgstpst / total) * 100;

      console.log('discountPriceInPercentage' + discountPriceInPercentage);

      const discountAmount = (discountPriceInPercentage / 100) * discount;
      console.log('discountPriceInPercentage' + discountAmount);

      return Number(discountPriceInPercentage);
    }

    const discountPriceInPercentage = (item.price / total) * 100;

    console.log('discountPriceInPercentage' + discountPriceInPercentage);

    const discountAmount = (discountPriceInPercentage / 100) * discount;
    console.log('discountPriceInPercentage' + discountAmount);

    return Number(discountAmount);
  } else {
    const percentPrice = ((total * discount) / 100 / discount) * 100;
    return Number(percentPrice.toFixed(2));
  }
};

const getProductPriceWithTaxes = (item, user, discount, selectedProvider) => {
  console.log('price next screen==' + Number(item?.price));
  const productPrice = Number(item?.price) - discount;
  if (item?.taxable === 'Y') {
    const gst =
        item?.taxable === 'Y' && selectedProvider?.is_paying_taxes === 1
            ? getPercentagePrice(
                item?.price - discount,
                user?.buyer_province?.gst_tax_percentage,
            )
            : 0;
    const pst =
        item?.taxable === 'Y' && selectedProvider?.is_paying_taxes === 1
            ? getPercentagePrice(
                item?.price - discount,
                user?.buyer_province?.pst_tax_percentage,
            )
            : 0;
    return item?.price - discount + Number(gst) + Number(pst);
  } else {
    return productPrice;
  }
};

const getAccurateTimeSlot = slots => {
  if (!Object.keys(slots).length) return '-';
  const startingTimeArray = slots.map(slot => slot.split('-')[0]);
  const closingTimeArray = slots.map(slot => slot.split('-')[1]);

  const startTime24Format = startingTimeArray.map(time =>
      parseInt(moment(time, ['h:mm A']).format('HHmm')),
  );

  const closeTime24Format = closingTimeArray.map(time =>
      parseInt(moment(time, ['h:mm A']).format('HHmm')),
  );

  const startString = Math.min(...startTime24Format);
  const closeString = Math.max(...closeTime24Format);

  const startfindIndex = startTime24Format.findIndex(i => i == startString);

  const closefindIndex = closeTime24Format.findIndex(i => i == closeString);

  const startTime = startingTimeArray[startfindIndex];
  const closeTime = closingTimeArray[closefindIndex];

  return startTime + '-' + closeTime;
};

const getTotalAmount = items => {
  const price_array = items?.map(item => item?.price * item.qty);
  const total_amout = price_array?.reduce((a, b) => a + b, 0);
  return parseFloat(total_amout).toFixed(3);
};

const getTotalAmoutWithCoupon = (items, discount, type) => {
  const totalAmount = getTotalAmount(items);
  const discountAmount =
      discount === undefined
          ? 0
          : type === 'flat'
              ? discount
              : (totalAmount * discount) / 100;
  return (totalAmount - discountAmount);
};

const calculateTax = (items, TaxPercentage, discount, type) => {

  const price_array = items?.map(item => item?.price * item.qty);
  const total_amout = price_array?.reduce((a, b) => a + b, 0);

  console.log("items price",total_amout)

  if (!TaxPercentage||total_amout===0) {
    return 0;
  }

  let ordersTotalAmount = getTotalAmount(items);

  let totalDiscount = 0;
  // Apply discount to item
  if (discount !== undefined && discount > 0) {
    if (type === 'flat') {
      totalDiscount = discount;
    } else {
      totalDiscount = (ordersTotalAmount * discount) / 100;
    }
  }

  const taxableItems = items.filter(item => item.taxable === 'Y');

  let totalTax = 0;

  taxableItems.forEach(item => {
    let itemTotalAmount = parseFloat(item.price) * item.qty;

    let itemDiscount = (itemTotalAmount / ordersTotalAmount) * totalDiscount;
    itemTotalAmount -= itemDiscount;

    itemTax = (itemTotalAmount * TaxPercentage) / 100;
    totalTax += itemTax;
  });

  return totalTax.toFixed(3);
};

const calculateGrandTotal = (
    cartItem,
    discount,
    type,
    gstTaxPercentage,
    pstTaxPercentage,
    selectedProvider,
) => {
  let totalAmount = 0;
  let totalDiscount = 0;
  let totalGstTax = 0;
  let totalPstTax = 0;

  let ordersTotalAmount = getTotalAmount(cartItem.items);
  const price_array = cartItem?.items?.map(item => item?.price * item.qty);
  const total_amout = price_array?.reduce((a, b) => a + b, 0);
  if (total_amout===0){
    totalAmount=0;
    return 0;

  }

  // Apply discount to item
  if (discount !== undefined && discount > 0) {
    if (type === 'flat') {
      totalDiscount = discount;
    } else {
      totalDiscount = (ordersTotalAmount * discount) / 100;
    }
  }

  cartItem?.items?.forEach(item => {
    let itemTotalAmount = parseFloat(item.price) * item.qty;

    console.log('itemTotalAmountBefore--->', itemTotalAmount);
    console.log('item type--->', item?.type);

    // Apply discount to item
    let itemDiscount = (itemTotalAmount / ordersTotalAmount) * totalDiscount;
    itemTotalAmount -= itemDiscount;

    console.log('item amount after discount--->', itemTotalAmount);

    // Apply taxes to item if taxable
    if (item.taxable === 'Y' && selectedProvider?.is_paying_taxes === 1) {
      let itemGstTax = 0;
      let itemPstTax = 0;
      if (gstTaxPercentage !== null && gstTaxPercentage > 0) {
        itemGstTax = (itemTotalAmount * gstTaxPercentage) / 100;
        totalGstTax += itemGstTax;
      }
      if (pstTaxPercentage !== null && pstTaxPercentage > 0) {
        itemPstTax = (itemTotalAmount * pstTaxPercentage) / 100;
        totalPstTax += itemPstTax;
      }
      console.log('item amount before tax--->', itemTotalAmount);
      itemTotalAmount += itemGstTax + itemPstTax;
      console.log('itemGstTax--->', itemGstTax);
      console.log('itemPstTax--->', itemPstTax);
    }

    console.log('itemDiscount--->', itemDiscount);

    console.log('itemTotalAmount--->', itemTotalAmount);

    totalAmount += itemTotalAmount;
  });

  console.log('totalAmount--->', totalAmount);

  if (totalAmount <= 0) {
    return 0;
  }
  else {
    return totalAmount.toFixed(3);
  }
};

export default {
  get_image,
  get_Appointment_Document,
  getRole,
  getMenuItems,
  getDiscountPrice,
  getDistanceInKm,
  getRating,
  toFloat,
  islimitExceeed,
  getItemPrice,
  getTotalAmount,
  getDeliverAddress,
  isProfileIsNotComplete,
  getProductDeliveryTypes,
  getServiceDeliveryTypes,
  checkOrderExtraFees,
  getPercentagePrice,
  getSubscriptionPercentagePrice,
  getTotalAmountWithTaxas,
  getTotalAmountWithItemTaxas,
  getAccurateTimeSlot,
  getProductPriceWithTaxes,
  getDiscountActualAmount,
  getItemDiscountAmount,
  getTotalAmoutWithCoupon,
  calculateTax,
  calculateGrandTotal,
  ORDER_PAYMENT_STATUS,
  guest,
  SERVICE_PROVIDER,
  BUYER,
  GUEST,
};
