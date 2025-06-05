import images from '../constants/images';
import {translate} from '../multiLang/translation';
const services = [
  {id: 1, title: translate('fix'), image: images.fixAppliance},
  {id: 2, title: translate('paint'), image: images.paintMyHome},
  {id: 3, title: translate('clean'), image: images.cleanMyHome},
  {id: 4, title: translate('plumbing'), image: images.plumbingWork},
  {id: 5, title: translate('electric'), image: images.electricWork},
  {id: 6, title: translate('laundry'), image: images.laundryCloths},
];

const ActiveAppointments = [
  {
    id: 1,
    title: 'Fix my Appliances',
    subtitle: 'Air Conditioner',
    price: '140.00 CAD',
    date: '13 June',
    time: '11:00 am',
    location: 'home',
    type: 'active',
  },
  {
    id: 2,
    title: 'Paint my Home',
    subtitle: 'Air Conditioner',
    price: '100.00 CAD',
    date: '15 June',
    time: '02:00 pm',
    location: 'office',
    type: 'active',
  },
];

const PastAppointments = [
  {
    id: 1,
    title: 'Repair my Vehicle',
    subtitle: 'Air Conditioner',
    price: '120.00 CAD',
    date: '13 June',
    time: '11:00 am',
    location: 'home',
    type: 'past',
  },
  {
    id: 2,
    title: 'Fix my Appliances',
    subtitle: 'Air Conditioner',
    price: '200.00 CAD',
    date: '20 June',
    time: '05:00 pm',
    location: 'Home',
    type: 'past',
  },
];

const today_notifications = [
  {
    id: 1,
    title: 'notification title 1',
    details: 'Praesent mi magna, volutpat non commodo sed, fermentum sed quam.',
    date: '3:24 am',
  },
  {
    id: 2,
    title: 'notification title 2',
    details: 'Praesent mi magna, volutpat non commodo sed, fermentum sed quam.',
    date: '11:04 pm',
  },
];

const yesterday_notifications = [
  {
    id: 1,
    title: 'notification title 3',
    details: 'Praesent mi magna, volutpat non commodo sed, fermentum sed quam.',
    date: '5:14 am',
  },
];

const other_notifications = [
  {
    id: 1,
    title: 'notification title 4',
    details: 'Praesent mi magna, volutpat non commodo sed, fermentum sed quam.',
    date: '8:10 am',
  },
  {
    id: 2,
    title: 'notification title 5',
    details: 'Praesent mi magna, volutpat non commodo sed, fermentum sed quam.',
    date: '3:04 pm',
  },
];

const FAQs = [
  {
    id: 1,
    title: 'How to Login to App?',
    subtitle:
      'orem ipsum dolor sit amet, consectetur adipiscing elit. In sapien eros, finibus sit amet rhoncus eget, suscipit et sem. Vestibulum efficitur posuere pharetra. Nunc eleifend felis sed odio egestas faucibus. Ut sit amet lectus quis urna pellentesque rutrum. Mauris pretium cursus tellus. Mauris facilisis nisi nec lectus vestibulum consequat',
  },
  {
    id: 2,
    title: 'How to book an Appointment?',
    subtitle:
      'orem ipsum dolor sit amet, consectetur adipiscing elit. In sapien eros, finibus sit amet rhoncus eget, suscipit et sem. Vestibulum efficitur posuere pharetra. Nunc eleifend felis sed odio egestas faucibus. Ut sit amet lectus quis urna pellentesque rutrum. Mauris pretium cursus tellus. Mauris facilisis nisi nec lectus vestibulum consequat',
  },
  {
    id: 3,
    title: 'How to cancel an Appointment?',
    subtitle:
      'orem ipsum dolor sit amet, consectetur adipiscing elit. In sapien eros, finibus sit amet rhoncus eget, suscipit et sem. Vestibulum efficitur posuere pharetra. Nunc eleifend felis sed odio egestas faucibus. Ut sit amet lectus quis urna pellentesque rutrum. Mauris pretium cursus tellus. Mauris facilisis nisi nec lectus vestibulum consequat',
  },
];

const tags = [
  'Tag 1',
  'Tag 2',
  'Tag 3',
  'Tag 4',
  'Tag 5',
  'Tag 6',
  'Tag 7',
  'Tag 8',
];
export default {
  services,
  ActiveAppointments,
  PastAppointments,
  today_notifications,
  yesterday_notifications,
  other_notifications,
  FAQs,
  tags,
};
