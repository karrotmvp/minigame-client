import { useDispatch, useSelector } from 'react-redux';
import {
  setGameTypeAction,
  updateUserGameDataAction,
  updateMyCommentAction,
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

  const updateMyScore = (score: number, rank: number) => {
    dispatch(updateUserGameDataAction(score, rank));
  };

  const updateMyComment = (comment: string) => {
    dispatch(updateMyCommentAction(comment));
  };
  const setGameTypeToGame2048 = () => {
    dispatch(setGameTypeAction('GAME_2048'));
  };
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
