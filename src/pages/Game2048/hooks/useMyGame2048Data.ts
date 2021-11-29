import { useDispatch, useSelector } from 'react-redux';
import {
  setGameTypeAction,
  updateUserGameDataAction,
  updateMyCommentAction,
  getMyHighestScoreAction,
} from 'reducers/game2048DataReducer';
import { RootState } from 'store';

export const useMyGame2048Data = () => {
  const { score, rank, comment, gameType, highestScore, highestRank } =
    useSelector((state: RootState) => ({
      score: state.game2048DataReducer.score,
      rank: state.game2048DataReducer.rank,
      comment: state.game2048DataReducer.comment,
      gameType: state.game2048DataReducer.gameType,
      highestScore: state.game2048DataReducer.highestScore,
      highestRank: state.game2048DataReducer.highestRank,
    }));
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

  const updateMyHighestScore = (highestScore: number, highestRank: number) => {
    dispatch(getMyHighestScoreAction(highestScore, highestRank));
  };
  return {
    score,
    rank,
    comment,
    gameType,
    highestScore,
    highestRank,
    updateMyScore,
    updateMyComment,
    setGameTypeToGame2048,
    updateMyHighestScore,
  };
};
