import { useDispatch, useSelector } from 'react-redux';
import {
  setGameTypeAction,
  updateUserGameDataAction,
} from 'reducers/game2048DataReducer';
import { RootState } from 'reducers/rootReducer';

export const useMyGame2048Data = () => {
  const { score, rank, comment, gameType } = useSelector(
    (state: RootState) => ({
      score: state.game2048DataReducer.score,
      rank: state.game2048DataReducer.rank,
      comment: state.game2048DataReducer.comment,
      gameType: state.game2048DataReducer.gameType,
    })
  );
  const dispatch = useDispatch();

  const updateMyGame2048Data = (
    score: number,
    rank: number,
    comment: string
  ) => {
    dispatch(updateUserGameDataAction(score, rank, comment));
  };

  const setGameTypeToGame2048 = () => {
    dispatch(setGameTypeAction('GAME_2048'));
  };
  return {
    score,
    rank,
    comment,
    gameType,
    updateMyGame2048Data,
    setGameTypeToGame2048,
  };
};
