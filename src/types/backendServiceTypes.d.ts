export interface BackendServiceRequest {
  regionId: string | null;
  code: string;
}

export interface BackendServiceResponse {
  townId: string;
  townName: string;
  // void: () => void;
}
