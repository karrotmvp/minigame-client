import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { useCallback } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';

export const useMyGameData = () => {
  const minigameApi = useMinigameApi();
  const {
    rank,
    gameType,
    updateMyScore: updateMy2048PuzzleScore,
    updateMyComment: updateMy2048PuzzleComment,
    updateMyHighestScore,
  } = useMyGame2048Data();

  const updateMyGameData = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
      if (data) {
        if (data.score && data.rank) {
          gameType === 'GAME_2048'
            ? updateMy2048PuzzleScore({
                score: data.score,
                rank: data.rank,
              })
            : updateMy2048PuzzleScore({
                score: data.score,
                rank: data.rank,
              });
          if (data.comment) {
            gameType === 'GAME_2048'
              ? updateMy2048PuzzleComment(data.comment)
              : updateMy2048PuzzleComment(data.comment);
          }
          return 'success';
        }
      }
      return 'fail';
    },
    [
      minigameApi.gameUserApi,
      updateMy2048PuzzleComment,
      updateMy2048PuzzleScore,
    ]
  );

  return {
    updateMyGameData,
  };
};
