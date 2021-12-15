import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { useCallback } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';

export const useMyGameData = () => {
  const minigameApi = useMinigameApi();
  const {
    updateMyScore: updateMy2048PuzzleScore,
    updateMyComment: updateMy2048PuzzleComment,
  } = useMyGame2048Data();

  const updateMyGameData = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
      if (data) {
        console.log(data, 'data');
        if (data.score && data.rank) {
          updateMy2048PuzzleScore({
            score: data.score,
            rank: data.rank,
          });
          if (data.comment) {
            updateMy2048PuzzleComment(data.comment);
          }
          return data;
        }
      }
      return undefined;
    },
    [
      minigameApi.gameUserApi,
      updateMy2048PuzzleComment,
      updateMy2048PuzzleScore,
    ]
  );

  const getBoard = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      const { data } = await minigameApi.scoreLogApi.getCurrentLogScoreUsingGET(
        gameType
      );
      if (data.data) {
        const stashedBoard = {
          board: data.data.board,
          score: data.data.score,
        };
        return stashedBoard;
      }
    },
    [minigameApi.scoreLogApi]
  );

  const postBoard = useCallback(
    async ({
      gameType,
      board,
      score,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      board: number[];
      score: number;
    }) => {
      const { data } = await minigameApi.scoreLogApi.logScoreUsingPOST(
        { board, score },
        gameType
      );
      if (data.status === 200) {
        return 'success';
      } else {
        return 'fail';
      }
    },
    [minigameApi.scoreLogApi]
  );

  return {
    updateMyGameData,
    getBoard,
    postBoard,
  };
};
