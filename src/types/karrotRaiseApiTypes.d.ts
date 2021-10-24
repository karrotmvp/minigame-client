// oauth2 api types
export interface PostOauth2Response {
  data?: {
    data: {
      accessToken: string;
    };
  };
  isFetched: boolean;
}

// town api types
export interface GetTownIdResponse {
  data?: {
    data: {
      id: string;
      name1: string;
      name2: string;
    };
  };
  isFetched: boolean;
}
export interface GetTownUserRankResponse {
  data?: {
    data: {
      comment: string;
      nickname: string;
      score: number;
      userId: string;
    }[];
  };
  isFetched: boolean;
}
export interface GetDistrictRankResponse {
  data?: {
    data: {
      name1: string;
      name2: string;
      score: number;
    }[];
  };
  isFetched: boolean;
}
// user api types
export interface getUserInfoResponse {
  data?: {
    data: {
      id: string;
      comment: string;
      nickname: string;
      rank: number;
      score: number;
      town: {
        id: string;
        name1: string;
        name2: string;
      };
    };
  };
  isFetched: boolean;
}

// user-rank api types

export interface PatchUserScoreResposne {
  isFetched: boolean;
}
export interface PatchUserCommmentResponse {
  isFetched: boolean;
}

// demand-controller api types
export interface PostDemandResponse {
  isFetched: boolean;
  error?: {
    response: {
      data: {
        message: string;
      };
    };
  };
}
