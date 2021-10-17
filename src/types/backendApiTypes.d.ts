// oauth2 api types
export interface oAuth2ApiRequest {
  code: string | null;
  regionId: string;
}
export interface oAuth2ApiResponse {
  data?: {
    data: {
      accessToken: string;
    };
  };
  isFetched: boolean;
}

// town api types
export interface getTownIdRequest {
  regionId: string;
}
export interface getTownIdResponse {
  data?: {
    data: {
      id: string;
      name1: string;
      name2: string;
    };
  };

  isFetched: boolean;
}
export interface getTownUserRankRequest {
  baseUrl: string;
  townId: string;
}
export interface getTownUserRankResponse {
  data?: [
    {
      comment: string;
      nickname: string;
      score: number;
      userId: string;
    }
  ];
  isFetched: boolean;
}
// user api types
export interface getUserInfoRequest {
  baseUrl: string;
  accessToken: string;
}

export interface getUserInfoResponse {
  data?: {
    data: {
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
