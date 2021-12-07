import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RootState } from 'store';
import {
  saveUserInfo as saveUserInfoAction,
  trackVisitor as trackVisitorAction,
  setMissionPreference as setMissionPreferenceAction,
  setNotificationPreference as setNotificationPreferenceAction,
} from '../redux/user/user';

export const useUser = () => {
  const { uuid, regionId, isSubscribed, referer } = useSelector(
    (state: RootState) => ({
      uuid: state.user.uuid,
      regionId: state.user.regionId,
      isSubscribed: state.user.isSubscribed,
      referer: state.user.referer,
    }),
    shallowEqual
  );

  const { isMissionCheckedOut, hasMissionPopupSeen } = useSelector(
    (state: RootState) => ({
      isMissionCheckedOut: state.user.isMissionCheckedOut,
      hasMissionPopupSeen: state.user.hasMissionPopupSeen,
    }),
    shallowEqual
  );

  const { notification } = useSelector((state: RootState) => ({
    notification: {
      newGame: {
        isNotificationOn: state.user.notification.newGame.isNotificationOn,
      },
      nextMission: {
        isNotificationOn: state.user.notification.nextMission.isNotificationOn,
      },
    },
  }));

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
      isMissionCheckedOut,
      hasMissionPopupSeen,
    }: {
      isMissionCheckedOut?: boolean;
      hasMissionPopupSeen?: boolean;
    }) => {
      dispatch(
        setMissionPreferenceAction({ isMissionCheckedOut, hasMissionPopupSeen })
      );
    },
    [dispatch]
  );

  const setNotificationPreference = useCallback(
    ({
      isNewGameNotificationOn,
      isNextMissionNotificationOn,
    }: {
      isNewGameNotificationOn?: boolean;
      isNextMissionNotificationOn?: boolean;
    }) => {
      dispatch(
        setNotificationPreferenceAction({
          isNewGameNotificationOn,
          isNextMissionNotificationOn,
        })
      );
    },
    [dispatch]
  );
  return {
    uuid,
    regionId,
    isSubscribed,
    referer,
    isMissionCheckedOut,
    hasMissionPopupSeen,
    notification,
    saveUserInfo,
    trackVisitor,
    setMissionPreference,
    setNotificationPreference,
  };
};
