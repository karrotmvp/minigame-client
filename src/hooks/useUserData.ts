import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import {
  setUserInfoAction,
  setRegionInfoAction,
  setTownInfoAction,
  setIsInstalledAction,
} from 'reducers/userDataReducer';

export const useUserData = () => {
  const {
    userId,
    nickname,
    regionId,
    townId,
    townName1,
    townName2,
    townName3,
    isInstalled,
  } = useSelector((state: RootState) => ({
    userId: state.userDataReducer.userId,
    nickname: state.userDataReducer.nickname,
    regionId: state.userDataReducer.regionId,
    townId: state.userDataReducer.townId,
    townName1: state.userDataReducer.townName1,
    townName2: state.userDataReducer.townName2,
    townName3: state.userDataReducer.townName3,
    isInstalled: state.userDataReducer.isInstalled,
  }));
  const dispatch = useDispatch();

  const setRegionInfo = useCallback(
    (regionId: string) => {
      dispatch(setRegionInfoAction(regionId));
    },
    [dispatch]
  );

  const setTownInfo = useCallback(
    (
      townId: string,
      townName1: string,
      townName2: string,
      townName3: string
    ) => {
      dispatch(setTownInfoAction(townId, townName1, townName2, townName3));
    },
    [dispatch]
  );

  const setUserInfo = useCallback(
    (userId: string, nickname: string) => {
      dispatch(setUserInfoAction(userId, nickname));
    },
    [dispatch]
  );

  const setIsInstalled = useCallback(
    (isInstalled: boolean) => {
      dispatch(setIsInstalledAction(isInstalled));
    },
    [dispatch]
  );

  return {
    userId,
    nickname,
    regionId,
    townId,
    townName1,
    townName2,
    townName3,
    isInstalled,

    setRegionInfo,
    setTownInfo,
    setUserInfo,
    setIsInstalled,
  };
};
