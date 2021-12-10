import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import {
  setUser as setUserAction,
  setMission as setMissionAction,
  setSubscription as setSubscriptionAction,
  setNewGame as setNewGameAction,
} from '../redux/user/user';
import type { User, Mission, Subscription, NewGame } from '../redux/user';

export const useUser = () => {
  // state
  const user = useSelector((state: RootState) => state.user.user);
  const subscription = useSelector(
    (state: RootState) => state.user.subscription
  );
  const mission = useSelector((state: RootState) => state.user.mission);
  const newGame = useSelector((state: RootState) => state.user.newGame);

  // dispatch
  const dispatch = useDispatch();

  // const saveQueryString = useCallback(
  //   ({
  //     uuid,
  //     regionId,
  //     referer,
  //     isSubscribed,
  //   }: {
  //     uuid?: string | null;
  //     regionId?: string;
  //     referer?: RefererEnum;
  //     isSubscribed?: boolean;
  //   }) => {
  //     dispatch(
  //       saveQueryStringAction({
  //         uuid,
  //         regionId,
  //         referer,
  //         isSubscribed,
  //       })
  //     );
  //   },
  //   [dispatch]
  // );

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
    subscription,
    mission,
    newGame,
    // saveQueryString,
    setUser,
    setMission,
    setSubscription,
    setNewGame,
  };
};
