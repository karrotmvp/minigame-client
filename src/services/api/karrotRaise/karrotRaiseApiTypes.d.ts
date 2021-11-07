// Oauth2
export interface PostOauth2Response {
  data: {
    accessToken: string;
  };
  message: string;
  status: number;
  timestamp: string;
}

// Rank
export interface PatchUserScoreResposne {
  data: object;
  message: string;
  status: number;
  timestamp: string;
}
export interface PatchUserCommmentResponse {
  data: object;
  message: string;
  status: number;
  timestamp: string;
}
export interface GetUserRankResponse {
  data: {
    comment: string;
    userName: string;
    score: number;
    town: {
      id: string;
      name1: string;
      name2: string;
    };
    userId: string;
  }[];
  message: string;
  status: number;
  timestamp: string;
}
export interface GetDistrictRankResponse {
  data: {
    name1: string;
    name2: string;
    playerCount: number;
    score: number;
  }[];
  message: string;
  status: number;
  timestamp: string;
}

// Town
export interface GetTownIdResponse {
  data: {
    id: string;
    name1: string;
    name2: string;
  };
  message: string;
  status: number;
  timestamp: string;
}

// User
export interface GetDailyUserCountResponse {
  data: number;
  message: string;
  status: number;
  timestamp: string;
}
export interface GetUserInfoResponse {
  data: {
    id: string;
    comment: string;
    userName: string;
    rank: number;
    score: number;
    town: {
      id: string;
      name1: string;
      name2: string;
    };
  };
  message: string;
  status: number;
  timestamp: string;
}

// 사전 신청
export interface PostDemandResponse {
  // data: object;
  // message: string;
  // status: number;
  // timestamp: string;

  success: boolean;

  error?: {
    response: {
      data: {
        message: string;
      };
    };
  };
}
