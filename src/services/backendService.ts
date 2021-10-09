// import axios from "axios";
const axios = require('axios').default;

const baseURL = `http://e0fe-222-106-174-149.ngrok.io/api/v1`;
const ACCESS_TOEKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqIiwiZXhwIjoxNjMzODQ2MTI2fQ.hQ9WWveNCatWeJTbimRi_bP1wqGuxBzdx7_egYE8JT2yJpVF2_qT7LRidUjy5m-557FP3jKRNcFhNDr1KRTUcg";

// interface BackendServiceData {
//   townId?: any | null,

// }
// let regionId = 9bdfe83b68f3;
const postOauth = (code: any, regionId:any) => {
  return axios.post(`${baseURL}/oauth`, {
    code: code,
    regionId: regionId
  })
}
const getTownRank = async(townId: any) => {
  return await axios.get(`${baseURL}/towns/${townId}/user-rank`);
};

const getCurrentUserInfo = async() => {
  return await axios.get(`${baseURL}/users/me`, {
    headers: {
      "Authorization": ACCESS_TOEKEN
    }
  })
}

const patchCurrentScore = async(score: number) => {
  console.log(score)
  return await axios.patch(`${baseURL}/user-rank`, {
    score: score
  }, {
    headers: {
      Authorization: ACCESS_TOEKEN,
      "Content-Type": "application/json"

    }
  })
}

const patchComment = async(comment: string) => {
  return await axios.patch(`${baseURL}/user-rank/comment`, {
    comment: comment
  }, {
    headers: {
      "Authorization": ACCESS_TOEKEN,
      "Content-Type": "application/json"
    }
    
  })
}
const BackendService = {
  postOauth,
  getTownRank,
  getCurrentUserInfo,
  patchCurrentScore,
  patchComment
};

export default BackendService;


// const getCurrentuserInfo = async () => {
//   try {
//     const response = await BackendService.getCurrentUserInfo();
//     // const responseData: any = response.data[`data`];
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// };

// let townId = `9bdfe83b68f3`;
// const getTownRank = async () => {
//   try {
//     const response = await BackendService.getTownRank(townId);
//     const responseData: any = response.data[`data`];
//     const indexedTownRankData = responseData.map((item: any, index: any) => ({
//       rank: index + 1,
//       ...item,
//     }));
//     // console.log(indexedTownRankData);
//     return indexedTownRankData;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const patchCurrentScore = async ({ score }: any) => {
//   try {
//     const response = await BackendService.patchCurrentScore(score);
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const patchComment = ({ comment }: any) => {
//   try {
//     const response = BackendService.patchComment(comment);
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// };
