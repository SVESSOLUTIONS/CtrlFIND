const PRICE_LOW_TO_HIGH = 'Price: Low to High';
const PRICE_HIGH_TO_LOW = 'Price: High to Low';
const CUSTOMER_LOW_RATING = 'Rating: Low';
const CUSTOMER_HIGH_RATING = 'Rating: High';

const HOME_ADDRESS = 'Home Address';
const OFFICE_ADDRESS = 'Office Address';
const OTHERS = 'Others';

const providerSortTitles = [
  {
    label: PRICE_HIGH_TO_LOW,
  },
  {
    label: PRICE_LOW_TO_HIGH,
  },

  {
    label: CUSTOMER_HIGH_RATING,
  },
  {
    label: CUSTOMER_LOW_RATING,
  },
];

const ALL_ADDRESSES = [
  {
    label: HOME_ADDRESS,
  },
  {
    label: OFFICE_ADDRESS,
  },
  {
    label: OTHERS,
  },
];

const WITH_HOME = [
  {
    label: HOME_ADDRESS,
  },
  {
    label: OTHERS,
  },
];

const WITH_OFFICE = [
  {
    label: OFFICE_ADDRESS,
  },
  {
    label: OTHERS,
  },
];

const ELSE_OTHERS = [
  {
    label: OTHERS,
  },
];

export default {
  PRICE_LOW_TO_HIGH,
  PRICE_HIGH_TO_LOW,
  CUSTOMER_LOW_RATING,
  CUSTOMER_HIGH_RATING,
  providerSortTitles,
  HOME_ADDRESS,
  OFFICE_ADDRESS,
  OTHERS,
  ALL_ADDRESSES,
  WITH_HOME,
  WITH_OFFICE,
  ELSE_OTHERS,
};
