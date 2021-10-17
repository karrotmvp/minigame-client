export interface postOauth2Request {
  code: string | null;
  regionId: string | null;
}

// interface postOatuh2Response {
//   data: any | undefined;
// }

export interface getTownIdRequest {
  data: {
    id: string;
    name1: string;
    name2: string;
  };
}
