import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setTownInfoAction } from 'reducers/userDataReducer';

export const useUserData = () => {
  const { townId, townName1, townName2, townName3 } = useSelector(
    (state: RootState) => ({
      townId: state.userDataReducer.townId,
      townName1: state.userDataReducer.townName1,
      townName2: state.userDataReducer.townName2,
      townName3: state.userDataReducer.townName3,
    })
  );
  const dispatch = useDispatch();

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

  return {
    townId,
    townName1,
    townName2,
    townName3,
    setTownInfo,
  };
};
