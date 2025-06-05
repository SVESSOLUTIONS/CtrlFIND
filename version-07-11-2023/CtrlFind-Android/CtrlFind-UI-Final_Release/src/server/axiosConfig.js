import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {baseURL} from './baseUrl';
import localStorage from './localStorage';
import toast from './toast';

const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(
  async function (options) {
    // NetInfo.fetch().then(state => {
    //   if (state.isInternetReachable !== null && !state.isInternetReachable) {
    //     setTimeout(() => {
    //       toast.no_network();
    //     }, 100);
    //   }
    // });
    const token = await localStorage.getToken();
    if (!token) return options;
    options.headers['Authorization'] = `Bearer ${token}`;
    return options;
  },
  function (error) {
    console.log('Request error: ', error);
    return Promise.reject(error);
  },
);

export default instance;
