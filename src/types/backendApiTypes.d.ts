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
