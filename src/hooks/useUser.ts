import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RootState } from 'store';
import {
  saveQueryString as saveQueryStringAction,
  setMission as setMissionAction,
  setSubscription as setSubscriptionAction,
  setNotification as setNotificationAction,
} from '../redux/user/user';
import type { Mission, Subscription } from '../redux/user';

export const useUser = () => {
  const { uuid, regionId, referer } = useSelector(
    (state: RootState) => ({
      uuid: state.user.uuid,
      regionId: state.user.regionId,

      referer: state.user.referer,
    }),
    shallowEqual
  );

  const subscription = useSelector(
    (state: RootState) => state.user.subscription
  );
  const mission = useSelector((state: RootState) => state.user.mission);

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

  const saveQueryString = useCallback(
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
        | 'SUBSCRIBE_FEED_1'
        | 'SUBSCRIBE_FEED_2'
        | 'SUBSCRIBE_FEED_3'
        | 'NEAR_BY'
        | 'SHARE_GAME_2048'
        | 'SHARE_GAME_KARROT'
        | 'SHARE_PLATFORM'
        | 'SHARE_COMMUNITY'
        | 'LOGIN'
        | 'UNKNOWN';
    }) => {
      dispatch(
        saveQueryStringAction({ uuid, regionId, isSubscribed, referer })
      );
    },
    [dispatch]
  );

  const setMission = useCallback(
    ({ notification, page, popup }: Mission) => {
      dispatch(setMissionAction({ notification, page, popup }));
    },
    [dispatch]
  );
  const setSubscription = useCallback(
    ({ isSubscribed }: Subscription) => {
      dispatch(setSubscriptionAction({ isSubscribed }));
    },
    [dispatch]
  );
  const setNotification = useCallback(
    ({
      isNewGameNotificationOn,
      isNextMissionNotificationOn,
    }: {
      isNewGameNotificationOn?: boolean;
      isNextMissionNotificationOn?: boolean;
    }) => {
      dispatch(
        setNotificationAction({
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
    referer,
    subscription,
    mission,
    notification,
    saveQueryString,
    setMission,
    setSubscription,
    setNotification,
  };
};
