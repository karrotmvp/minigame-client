import { setUserId } from 'firebase/analytics';
import BackendApi from 'services/backendApi/backendApi';
import { analytics } from 'services/firebase/firebaseConfig';

const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
const accessToken = `${window.localStorage.getItem('ACCESS_TOKEN')}`;

export const trackUser = async () => {
  const response = await BackendApi.getUserInfo({
    baseUrl: baseUrl,
    accessToken: accessToken,
  });
  if (response.isFetched === true && response.data) {
    const { id } = response.data.data;
    console.log(id, 'tracking.....');
    setUserId(analytics, id);
  }
};
