import { postOauth2 } from './api/oAuth2';
import { getTownId } from './api/town';
import { getUserInfo } from './api/userApi';
const BackendApi = {
  postOauth2,
  getTownId,
  getUserInfo,
};

export default BackendApi;
