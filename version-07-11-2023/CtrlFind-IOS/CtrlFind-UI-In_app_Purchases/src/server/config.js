import {create} from 'apisauce';
// import NetInfo from '@react-native-community/netinfo';
import {baseURL} from './baseUrl';
import localStorage from './localStorage';
import toast from './toast';

const apiClient = create({baseURL});

apiClient.addAsyncRequestTransform(async request => {
  // NetInfo.fetch().then(state => {
  //   if (state.isInternetReachable !== null && !state.isInternetReachable) {
  //     setTimeout(() => {
  //       toast.no_network();
  //     }, 100);
  //   }
  // });
  const token = await localStorage.getToken();
  if (!token) return;
  request.headers['Authorization'] = `Bearer ${token}`;
});

export default apiClient;
