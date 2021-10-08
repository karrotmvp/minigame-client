import axios from "axios";

const baseURL = `http://192.168.60.167:8080/api/v1`;
const ACCESS_TOEKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhIiwiZXhwIjoxNjMzNzQ4OTY4fQ.Sw1ZwquYShxNgVBJYIRgCXglI922_yAElJSHCE8Xgvj-9PDChn9BvQ4Ya4dFxC7wTmnxghEMCOlAe-EsDZoKzQ";

interface BackendServiceData {
  townId?: any | null,

}

const postOauth = ({code,regionId}: any) => {
  return axios.post(`${baseURL}/oauth`, {
    code: code,
    regionId: regionId
  })
}
const getTownRank = (townId: any) => {
  return axios.get(`${baseURL}/towns/${townId}/user-rank`);
};

const getCurrentUserInfo = () => {
  return axios.get(`${baseURL}/users/me`, {
    headers: {
      "Authorization": ACCESS_TOEKEN
    }
  })
}

const patchCurrentScore = (score: number) => {
  console.log(score)
  return axios.patch(`${baseURL}/user-rank`, {
    score: score
  }, {
    headers: {
      "Authorization": ACCESS_TOEKEN
    }
  })
}

const patchComment = (comment: string) => {
  return axios.patch(`${baseURL}/user-rank/comment`, {
    comment: comment
  }, {
    headers: {
      "Authorization": ACCESS_TOEKEN
    }
  })
}
const BackendService = {
  getTownRank,
  getCurrentUserInfo,
  patchCurrentScore,
  patchComment
  
};

export default BackendService;
// let townId = `9bdfe83b68f3`;

  // const getTownRank = () => {
  //   BackendService.getTownRank(townId)
  //     .then((response) => console.log(response))
  //     .catch((error) => console.log(error));
  // };

  // const patchCurrentScore = ({ score }: any) => {
  //   BackendService.patchCurrentScore(score)
  //     .then((response) => console.log(response))
  //     .catch((error) => console.log(error));
  // };

  // const patchComment = ({ comment }: any) => {
  //   BackendService.patchComment(comment)
  //     .then((response) => console.log(response))
  //     .catch((error) => console.log(error));
  // };