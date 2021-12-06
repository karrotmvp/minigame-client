import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RootState } from 'store';
import {
  saveUserInfo as saveUserInfoAction,
  trackVisitor as trackVisitorAction,
  setMissionPreference as setMissionPreferenceAction,
} from './user';

export const useUser = () => {
  // const minigameApi = useMinigameApi();

  const { uuid, regionId, isSubscribed, referer } = useSelector(
    (state: RootState) => ({
      uuid: state.user.uuid,
      regionId: state.user.regionId,
      isSubscribed: state.user.isSubscribed,
      referer: state.user.referer,
    }),
    shallowEqual
  );

  const { isMissionChekcedOut, hasMissionPopupSeen } = useSelector(
    (state: RootState) => ({
      isMissionChekcedOut: state.user.isMissionChekcedOut,
      hasMissionPopupSeen: state.user.hasMissionPopupSeen,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const saveUserInfo = useCallback(
    ({
      uuid,
      regionId,
      isSubscribed,
      referer,
    }: {
      uuid?: string | null;
      regionId?: string;
      isSubscribed?: boolean;
      referer?:
        | 'FEED'
        | 'NEAR_BY'
        | 'SHARE_GAME_2048'
        | 'SHARE_GAME_KARROT'
        | 'SHARE_PLATFORM'
        | 'SHARE_COMMUNITY'
        | 'LOGIN'
        | 'UNKNOWN';
    }) => {
      dispatch(saveUserInfoAction({ uuid, regionId, isSubscribed, referer }));
    },
    [dispatch]
  );

  const trackVisitor = () => {
    dispatch(trackVisitorAction());
  };

  const setMissionPreference = useCallback(
    ({
      isMissionChekcedOut,
      hasMissionPopupSeen,
    }: {
      isMissionChekcedOut?: boolean;
      hasMissionPopupSeen?: boolean;
    }) => {
      dispatch(
        setMissionPreferenceAction({ isMissionChekcedOut, hasMissionPopupSeen })
      );
    },
    [dispatch]
  );

  return {
    uuid,
    regionId,
    isSubscribed,
    referer,
    isMissionChekcedOut,
    hasMissionPopupSeen,
    saveUserInfo,
    trackVisitor,
    setMissionPreference,
  };
};
