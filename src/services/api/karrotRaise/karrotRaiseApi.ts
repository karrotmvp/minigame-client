import { KarrotRaiseApi } from 'services/karrotRaiseApi';
// import { useAxios } from 'services/useAxios';
import { KarrotRaiseApiConfig } from './config';
const axios = require('axios').default;
// REMOVE AXIOS DEPENDENCY!
export function createKarrotRaiseApi(
  config: KarrotRaiseApiConfig
): KarrotRaiseApi {
  const baseUrl = config.baseUrl;
  // const accessToken = ;
  // const axios = useAxios();

  // OAUTH2
  async function postOauth2(code: string, regionId: string) {
    try {
      const response = await axios.post(
        `${baseUrl}/oauth`,
        {
          code: code,
          regionId: regionId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      return { isFetched: true, data: data };
    } catch (error) {
      console.error(error);
      return { isFetched: false };
    }
  }

  // TOWN
  async function getTownId(regionId: string) {
    try {
      const { data } = await axios.get(`${baseUrl}/town?regionId=${regionId}`);
      return { isFetched: true, data: data };
    } catch (error) {
      console.error(error);
      return { isFetched: false };
    }
  }
  async function getTownUserRank(townId: string) {
    try {
      const { data } = await axios.get(`${baseUrl}/towns/${townId}/users/rank`);
      return { isFetched: true, data: data };
    } catch (error) {
      console.error(error);
      return { isFetched: false };
    }
  }
  async function getDistrictRank() {
    try {
      const { data } = await axios.get(`${baseUrl}/towns/rank`);
      return { isFetched: true, data: data };
    } catch (error) {
      console.error(error);
      return { isFetched: false };
    }
  }

  // USER
  async function getUserInfo(accessToken: string) {
    try {
      const { data } = await axios.get(`${baseUrl}/users/me`, {
        headers: {
          Authorization: accessToken,
        },
      });
      return { isFetched: true, data: data };
    } catch (error) {
      console.error(error);
      return { isFetched: false };
    }
  }

  // USER RANK
  async function patchUserScore(accessToken: string, score: number) {
    try {
      await axios.patch(
        `${baseUrl}/user-rank`,
        {
          score: score,
        },
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        }
      );
      return { isFetched: true };
    } catch (error) {
      console.error(error);
      return { isFetched: false };
    }
  }
  async function patchUserComment(accessToken: string, comment: string) {
    try {
      await axios.patch(
        `${baseUrl}/user-rank/comment`,
        {
          comment: comment,
        },
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        }
      );
      return { isFetched: true };
    } catch (error) {
      console.error(error);
      return { isFetched: false };
    }
  }

  // DEMAND CONTROLLER
  async function postDemand(accessToken: string) {
    try {
      await axios.post(`${baseUrl}/demand`, null, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      });
      return { isFetched: true };
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      if (errorMessage === 'Already Completed') {
        return { isFetched: true };
      } else {
        return { isFetched: false };
      }
    }
  }

  return {
    postOauth2,
    getTownId,
    getTownUserRank,
    getDistrictRank,
    getUserInfo,
    patchUserScore,
    patchUserComment,
    postDemand,
  };
}
