import { createContext, useContext } from 'react';
import {
  GetDistrictRankResponse,
  GetTownIdResponse,
  GetUserRankResponse,
  GetDailyUserCountResponse,
  GetUserInfoResponse,
  PatchUserCommmentResponse,
  PatchUserScoreResposne,
  PostDemandResponse,
  PostOauth2Response,
} from 'KarrotClicker/types/karrotRaiseApiTypes';

export interface KarrotRaiseApi {
  postOauth2(code: string, regionId: string): Promise<PostOauth2Response>;
  getTownId(regionId: string): Promise<GetTownIdResponse>;
  getUserRank(): Promise<GetUserRankResponse>;
  getDistrictRank(): Promise<GetDistrictRankResponse>;
  getDailyUserCount(): Promise<GetDailyUserCountResponse>;
  getUserInfo(accessToken: string): Promise<GetUserInfoResponse>;
  patchUserScore(
    accessToken: string,
    score: number
  ): Promise<PatchUserScoreResposne>;
  patchUserComment(
    accessToken: string,
    comment: string
  ): Promise<PatchUserCommmentResponse>;
  postDemand(accessToken: string): Promise<PostDemandResponse>;
}

// wow, such empty...
export const emptyKarrotRaiseApi: KarrotRaiseApi = {
  postOauth2(...args) {
    console.log(...args);
    return new Promise(() => {});
  },
  getTownId(...args) {
    return new Promise(() => {
      console.log(...args);
    });
  },
  getUserRank(...args) {
    console.log(...args);
    return new Promise(() => {});
  },
  getDistrictRank(...args) {
    console.log(...args);
    return new Promise(() => {});
  },
  getDailyUserCount(...args) {
    console.log(...args);
    return new Promise(() => {});
  },
  getUserInfo(...args) {
    console.log(...args);
    return new Promise(() => {});
  },
  patchUserScore(...args) {
    console.log(...args);
    return new Promise(() => {});
  },
  patchUserComment(...args) {
    console.log(...args);
    return new Promise(() => {});
  },
  postDemand(...args) {
    console.log(...args);
    return new Promise(() => {});
  },
};

export const KarrotRaiseApiContext = createContext(emptyKarrotRaiseApi);
export const useKarrotRaiseApi = () => useContext(KarrotRaiseApiContext);
