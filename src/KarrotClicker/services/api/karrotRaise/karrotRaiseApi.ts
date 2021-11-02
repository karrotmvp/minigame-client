import { KarrotRaiseApi } from 'KarrotClicker/services/karrotRaiseApi';
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
  // 당근 Oauth2
  async function postOauth2(code: string, regionId: string) {
    console.log('oauth api', code, regionId);
    try {
      const { data } = await axios.post(
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
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // RANK
  // 한마디 추가
  async function patchUserComment(accessToken: string, comment: string) {
    try {
      console.log(comment);
      const { data } = await axios.patch(
        `${baseUrl}/rank/comment`,
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
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  // 스코어 갱신
  async function patchUserScore(accessToken: string, score: number) {
    try {
      const { data } = await axios.patch(
        `${baseUrl}/rank/score`,
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
      return data;
    } catch (error) {
      console.error(error);
      return { isFetched: false };
    }
  }
  // 동네 랭킹 조회
  async function getDistrictRank() {
    try {
      const { data } = await axios.get(`${baseUrl}/rank/towns`);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  // 유저 랭킹 조회
  async function getUserRank() {
    try {
      const { data } = await axios.get(`${baseUrl}/rank/users`);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // TOWN
  // RegionId로 Town 정보 조회
  async function getTownId(regionId: string) {
    try {
      const { data } = await axios.get(`${baseUrl}/town?regionId=${regionId}`);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // USER
  // 24시간 내에 플레이한 유저 수
  async function getDailyUserCount() {
    try {
      const { data } = await axios.get(`${baseUrl}/users/daily-count`);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  // 내 정보 조회
  async function getUserInfo(accessToken: string) {
    try {
      const { data } = await axios.get(`${baseUrl}/users/me`, {
        headers: {
          Authorization: accessToken,
        },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // 사전 신청
  // demand
  async function postDemand(accessToken: string) {
    try {
      await axios.post(`${baseUrl}/demand`, null, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      if (errorMessage === 'Already Completed') {
        return { success: true };
      } else {
        return { success: false };
      }
    }
  }

  return {
    postOauth2,
    getTownId,
    getUserRank,
    getDistrictRank,
    getUserInfo,
    getDailyUserCount,
    patchUserScore,
    patchUserComment,
    postDemand,
  };
}
