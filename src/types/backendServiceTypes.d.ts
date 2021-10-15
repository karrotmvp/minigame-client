export interface BackendServiceRequest {
  regionId: string | null;
  code: string;
}

export interface BackendServiceResponse {
  townId: string;
  townName: string;

  // nickname: string;
  // score: number;
  // rank: number | null;
  // comment: string;
  // void: () => void;
}
