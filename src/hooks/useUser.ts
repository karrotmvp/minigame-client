import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import {
  setUser as setUserAction,
  setTown as setTownAction,
  setMission as setMissionAction,
  setSubscription as setSubscriptionAction,
  setNewGame as setNewGameAction,
} from '../redux/user/user';
import type { User, Town, Mission, Subscription, NewGame } from '../redux/user';

export const useUser = () => {
  // state
  const user = useSelector((state: RootState) => state.user.user);
  const town = useSelector((state: RootState) => state.user.town);
  const subscription = useSelector(
    (state: RootState) => state.user.subscription
  );
  const mission = useSelector((state: RootState) => state.user.mission);
  const newGame = useSelector((state: RootState) => state.user.newGame);

  // dispatch
  const dispatch = useDispatch();

  const setUser = useCallback(
    ({ uuid, userId, regionId, referer, nickname, referralCode }: User) => {
      dispatch(
        setUserAction({
          uuid,
          userId,
          regionId,
          referer,
          nickname,
          referralCode,
        })
      );
    },
    [dispatch]
  );

  const setTown = useCallback(
    ({ id, name1, name2, name3 }: Town) => {
      dispatch(setTownAction({ id, name1, name2, name3 }));
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

  const setNewGame = useCallback(
    ({ notification }: NewGame) => {
      dispatch(setNewGameAction({ notification }));
    },
    [dispatch]
  );
  return {
    user,
    town,
    subscription,
    mission,
    newGame,
    setUser,
    setTown,
    setMission,
    setSubscription,
    setNewGame,
  };
};
