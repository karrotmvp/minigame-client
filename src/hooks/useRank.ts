import { useCallback, useState } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';

export const useRank = () => {
  const minigameApi = useMinigameApi();
  const [userInFront, setUserInFront] = useState<{
    nickname: string;
    rank: number;
    score: number;
  }>({
    nickname: '',
    rank: 0,
    score: 0,
  });

  // // get my current rank
  const getMyRank = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      const { data } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(
        gameType
      );
      if (data.data) {
        const myGameData = {
          rank: data.data.rank,
          score: data.data.score,
          comment: data.data.comment,
        };
        return myGameData;
      } else {
        return 'fail';
      }
    },
    [minigameApi.gameUserApi]
  );
  const getUserInFront = useCallback(
    async ({
      gameType,
      score,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      score: number;
    }) => {
      const { data } = await minigameApi.gamePlayApi.getHigherScoreUsingGET(
        gameType,
        score
      );
      return data.data;
    },
    [minigameApi.gamePlayApi]
  );

  const updateUserInFront = useCallback(
    async ({
      gameType,
      score,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      score: number;
    }) => {
      const response = await getUserInFront({ gameType, score });
      if (response) {
        // 앞 등수가 있는경우
        const userInFront = {
          nickname: response.nickname,
          rank: response.rank,
          score: response.score,
        };
        setUserInFront(userInFront);
        return userInFront;
      } else if (response === null) {
        // 유저가 현재 1등일 경우
        return 'user is in the first place';
      } else {
        return 'fail';
      }
    },
    [getUserInFront]
  );

  return {
    userInFront,
    updateUserInFront,
    getMyRank,
  };
};
