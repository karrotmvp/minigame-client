// oauth2 api types
export interface PostOauth2Request {
  code: string | null;
  regionId: string;
}
export interface PostOauth2Response {
  data?: {
    data: {
      accessToken: string;
    };
  };
  isFetched: boolean;
}

// town api types
export interface GetTownIdRequest {
  regionId: string;
}
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
export interface GetTownUserRankRequest {
  townId: string;
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
// user api types
export interface getUserInfoRequest {}

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
export interface PatchUserScoreRequest {
  score: number;
}
export interface PatchUserScoreResposne {
  isFetched: boolean;
}
export interface PatchUserCommmentRequest {
  comment: string;
}
export interface PatchUserCommmentResponse {
  isFetched: boolean;
}

// demand-controller api types
export interface PostDemandRequest {}
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
