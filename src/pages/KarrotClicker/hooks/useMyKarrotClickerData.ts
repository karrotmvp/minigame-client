import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserGameDataAction,
  setGameTypeAction,
  updateUserCommentAction,
} from 'reducers/karrotClickerDataReducer';
import { RootState } from 'reducers/rootReducer';

export const useMyKarrotClickerData = () => {
  const { score, rank, comment, gameType } = useSelector(
    (state: RootState) => ({
      score: state.karrotClickerDataReducer.score,
      rank: state.karrotClickerDataReducer.rank,
      comment: state.karrotClickerDataReducer.comment,
      gameType: state.karrotClickerDataReducer.gameType,
    })
  );
  const dispatch = useDispatch();

  const updateMyKarrotClickerData = (score: number, rank: number) => {
    dispatch(updateUserGameDataAction(score, rank));
  };

  const updateMyComment = (comment: string) => {
    dispatch(updateUserCommentAction(comment));
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
    updateMyComment,
    setGameTypeToKarrotClicker,
  };
};
