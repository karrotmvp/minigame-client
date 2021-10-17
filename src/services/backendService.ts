// import { BackendApiRequest } from 'types/backendApiTypes';

const axios = require('axios').default;

const baseUrl = process.env.REACT_APP_BASE_URL_PRODUCTION;
// const accessToken = window.localStorage.getItem('ACCESS_TOKEN');

async function postOauth(code: any, regionId: any) {
  const { data } = await axios.post(
    `${baseUrl}/oauth`,
    { code: code, regionId: regionId },

    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const { accessToken } = await data.data;
  return window.localStorage.setItem('ACCESS_TOKEN', accessToken);
}
// const postOauth = (code: string, regionId: string) => {
//   return axios.post(`${process.env.REACT_APP_BASE_URL_PRODUCTION}/oauth`, {
//     code: code,
//     regionId: regionId,
//   });
// };
const getTownRank = async (townId: string) => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL_PRODUCTION}/towns/${townId}/user-rank`
  );
};

const getCurrentUserInfo = async () => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL_PRODUCTION}/users/me`,
    {
      headers: {
        Authorization: window.localStorage.getItem('ACCESS_TOKEN'),
      },
    }
  );
};

const patchCurrentScore = async (score: number) => {
  console.log(score);
  return await axios.patch(
    `${process.env.REACT_APP_BASE_URL}/user-rank`,
    {
      score: score,
    },
    {
      headers: {
        Authorization: window.localStorage.getItem('ACCESS_TOKEN'),
        'Content-Type': 'application/json',
      },
    }
  );
};

const patchComment = async (comment: string) => {
  return await axios.patch(
    `${process.env.REACT_APP_BASE_URL}/user-rank/comment`,
    {
      comment: `${comment}`,
    },
    {
      headers: {
        Authorization: window.localStorage.getItem('ACCESS_TOKEN'),
        'Content-Type': 'application/json',
      },
    }
  );
};
const BackendService = {
  postOauth,
  getTownRank,
  getCurrentUserInfo,
  patchCurrentScore,
  patchComment,
};

export default BackendService;
