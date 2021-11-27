import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RootState } from 'store';
import {
  saveUserInfo as saveUserInfoAction,
  trackVisitor as trackVisitorAction,
} from '.';

export const useUser = () => {
  const { uuid, regionId, installed, referer } = useSelector(
    (state: RootState) => ({
      uuid: state.user.uuid,
      regionId: state.user.regionId,
      installed: state.user.installed,
      referer: state.user.referer,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  const saveUserInfo = useCallback(
    (
      uuid: string,
      regionId: string,
      installed: string,
      referer: 'FEED' | 'NEAR_BY' | 'SHARE' | 'UNKNOWN'
    ) => {
      dispatch(saveUserInfoAction({ uuid, regionId, installed, referer }));
    },
    [dispatch]
  );

  const trackVisitor = () => {
    dispatch(trackVisitorAction());
  };
  return {
    uuid,
    regionId,
    installed,
    referer,
    saveUserInfo,
    trackVisitor,
  };
};
