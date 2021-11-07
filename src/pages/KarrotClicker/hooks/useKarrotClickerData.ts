import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserGameDataAction,
  setGameTypeAction,
} from 'reducers/karrotClickerDataReducer';
import { RootState } from 'reducers/rootReducer';

export const useKarrotClickerData = () => {
  const { score, rank, comment } = useSelector((state: RootState) => ({
    score: state.game2048DataReducer.score,
    rank: state.game2048DataReducer.rank,
    comment: state.game2048DataReducer.comment,
  }));
  const dispatch = useDispatch();

  const updateKarrotClickerData = (
    score: number,
    rank: number,
    comment: string
  ) => {
    dispatch(updateUserGameDataAction(score, rank, comment));
  };

  const setGameTypeToKarrotClicker = (gameType: string) => {
    dispatch(setGameTypeAction(gameType));
  };

  return {
    score,
    rank,
    comment,
    updateKarrotClickerData,
    setGameTypeToKarrotClicker,
  };
};
