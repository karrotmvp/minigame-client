// Oauth2
export interface PostOauth2Response {
  data?: {
    data: {
      accessToken: string;
    };
  };
  isFetched: boolean;
}

// Rank
export interface PatchUserScoreResposne {
  isFetched: boolean;
}
export interface PatchUserCommmentResponse {
  data?: {
    data: object;
    message: string;
    status: number;
    timestamp: string;
  };
}
export interface GetUserRankResponse {
  data?: {
    data: {
      comment: string;
      nickname: string;
      score: number;
      town: {
        id: string;
        name1: string;
        name2: string;
      };
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
      playerCount: number;
      score: number;
    }[];
  };
  isFetched: boolean;
}

// Town
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

// User
export interface GetDailyUserCountResponse {
  data?: {
    data: number;
  };
  isFetched: boolean;
}
export interface GetUserInfoResponse {
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

// 사전 신청
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
