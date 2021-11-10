import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserGameDataAction,
  setGameTypeAction,
} from 'reducers/karrotClickerDataReducer';
import { RootState } from 'reducers/rootReducer';

export const useMyKarrotClickerData = () => {
  const { score, rank, comment, gameType } = useSelector(
    (state: RootState) => ({
      score: state.game2048DataReducer.score,
      rank: state.game2048DataReducer.rank,
      comment: state.game2048DataReducer.comment,
      gameType: state.game2048DataReducer.gameType,
    })
  );
  const dispatch = useDispatch();

  const updateMyKarrotClickerData = (
    score: number,
    rank: number,
    comment: string
  ) => {
    dispatch(updateUserGameDataAction(score, rank, comment));
  };

  const setGameTypeToKarrotClicker = () => {
    dispatch(setGameTypeAction('GAME_KARROT'));
  };

  return {
    score,
    rank,
    comment,
    gameType,
    updateMyKarrotClickerData,
    setGameTypeToKarrotClicker,
  };
};
