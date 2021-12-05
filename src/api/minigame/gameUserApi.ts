import { MinigameApiType } from 'services/api/minigameApi';

export const gameUserApi = ({
  minigameApi,
}: {
  minigameApi: MinigameApiType;
}) => {
  const getMyRankInfo = async ({
    gameType,
    type,
  }: {
    gameType: 'GAME_KARROT' | 'GAME_2048';
    type: 'BEST' | 'CURRENT';
  }) => {
    try {
      const { data } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(
        gameType,
        type
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getMyRankInfo,
  };
};
