import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RootState } from 'store';
import {
  saveUserInfo as saveUserInfoAction,
  trackVisitor as trackVisitorAction,
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
  const dispatch = useDispatch();

  const saveUserInfo = useCallback(
    ({
      uuid,
      regionId,
      isSubscribed,
      referer,
    }: {
      uuid?: string;
      regionId?: string;
      isSubscribed?: boolean;
      referer?:
        | 'FEED'
        | 'NEAR_BY'
        | 'UNKNOWN'
        | 'SHARE_GAME_2048'
        | 'SHARE_GAME_KARROT'
        | 'SHARE_PLATFORM';
    }) => {
      dispatch(saveUserInfoAction({ uuid, regionId, isSubscribed, referer }));
    },
    [dispatch]
  );

  const trackVisitor = () => {
    dispatch(trackVisitorAction());
  };

  return {
    uuid,
    regionId,
    isSubscribed,
    referer,
    saveUserInfo,
    trackVisitor,
  };
};
