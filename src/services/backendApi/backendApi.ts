import { postOauth2 } from './api/oAuth2Api';
import { getTownId, getTownUserRank } from './api/townApi';
import { getUserInfo } from './api/userApi';
import { patchUserScore, patchComment } from './api/userRankApi';
import { postDemand } from './api/demandControllerApi';
// const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
// const accessToken = window.localStorage.getItem('ACCESS_TOKEN');

const BackendApi = {
  getTownId,
  getTownUserRank,
  postOauth2,
  getUserInfo,
  patchUserScore,
  patchComment,
  postDemand,
};

export default BackendApi;
