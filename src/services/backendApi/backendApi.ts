import { postOauth2 } from './api/oAuth2Api';
import { getTownId } from './api/townApi';
import { getUserInfo } from './api/userApi';

// const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
// const accessToken = window.localStorage.getItem('ACCESS_TOKEN');

interface BackendApiRequest {
  code: string | null;
  regionId: string | null;
}
const BackendApi = {
  getTownId,
  postOauth2,
  getUserInfo,
};

export default BackendApi;
