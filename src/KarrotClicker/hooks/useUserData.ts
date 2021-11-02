import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'KarrotClicker/reducers/rootReducer';
import {
  updateRegionData,
  updateAccessToken,
  updateUserData,
} from 'KarrotClicker/reducers/userDataReducer';

export default function useUserData() {
  const {
    accessToken,
    regionId: userRegionId,
    townId: userDistrictId,
    townName: userDistrictName,
    id: userId,
    nickname: userNickname,
    score: userScore,
    rank: userRank,
    comment: userComment,
  } = useSelector((state: RootState) => ({
    accessToken: state.userDataReducer.accessToken,
    regionId: state.userDataReducer.regionId,
    townId: state.userDataReducer.townId,
    townName: state.userDataReducer.townName,
    id: state.userDataReducer.id,
    nickname: state.userDataReducer.nickname,
    score: state.userDataReducer.score,
    rank: state.userDataReducer.rank,
    comment: state.userDataReducer.comment,
  }));
  const dispatch = useDispatch();

  const onUpdateAccessToken = useCallback(
    (accessToken: string) => dispatch(updateAccessToken(accessToken)),
    [dispatch]
  );

  const onUpdateRegionData = useCallback(
    (regionId: string, townId: string, townName: string) => {
      console.log(regionId);
      return dispatch(updateRegionData(regionId, townId, townName));
    },
    [dispatch]
  );
  const onUpdateUserData = useCallback(
    (
      id: string,
      nickname: string,
      score: number,
      rank: number,
      comment: string
    ) => dispatch(updateUserData(id, nickname, score, rank, comment)),
    [dispatch]
  );

  return {
    accessToken,
    userRegionId,
    userDistrictId,
    userDistrictName,
    userId,
    userNickname,
    userScore,
    userRank,
    userComment,
    onUpdateAccessToken,
    onUpdateRegionData,
    onUpdateUserData,
  };
}
