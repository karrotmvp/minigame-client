import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  setGameTypeAction,
  updateUserGameDataAction,
  updateMyCommentAction,
} from 'reducers/game2048DataReducer';
import { RootState } from 'store';

export const useMyGame2048Data = () => {
  const { score, rank } = useSelector(
    (state: RootState) => ({
      score: state.game2048DataReducer.score,
      rank: state.game2048DataReducer.rank,
    }),
    shallowEqual
  );

  const { comment } = useSelector((state: RootState) => ({
    comment: state.game2048DataReducer.comment,
  }));

  const { gameType } = useSelector((state: RootState) => ({
    gameType: state.game2048DataReducer.gameType,
  }));

  const dispatch = useDispatch();

  const updateMyScore = useCallback(
    ({ score, rank }: { score: number; rank: number }) => {
      dispatch(updateUserGameDataAction(score, rank));
    },
    [dispatch]
  );

  const updateMyComment = useCallback(
    (comment: string) => {
      dispatch(updateMyCommentAction(comment));
    },
    [dispatch]
  );
  const setGameTypeToGame2048 = useCallback(() => {
    dispatch(setGameTypeAction('GAME_2048'));
  }, [dispatch]);

  return {
    score,
    rank,
    comment,
    gameType,
    updateMyScore,
    updateMyComment,
    setGameTypeToGame2048,
  };
};
