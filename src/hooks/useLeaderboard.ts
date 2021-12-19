import { useCallback, useState } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';
import type {
  TownRankingDto,
  UserRankingDtoWithTown,
} from 'services/openapi_generator/api';

export interface TownLeaderboardType extends TownRankingDto {
  rank: number;
}
export interface UserLeaderboardType extends UserRankingDtoWithTown {
  rank: number;
}

export const useLeaderboard = () => {
  const minigameApi = useMinigameApi();
  const [townLeaderboard, setTownLeaderboard] = useState<TownLeaderboardType[]>(
    []
  );
  const [userLeaderboard, setUserLeaderboard] = useState<UserLeaderboardType[]>(
    []
  );

  const getTownLeaderboard = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      const {
        data: { data },
      } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(gameType);
      if (data) {
        const indexedDistrictRankData = data.map(
          (item: TownRankingDto, index: number) => ({
            ...item,
            rank: index + 1,
            name1: item.name1.replace(
              /(특별시|광역시|특별자치시|특별자치도)$/,
              ''
            ),
          })
        );
        return indexedDistrictRankData;
      } else {
        return undefined;
      }
    },
    [minigameApi.gameTownApi]
  );

  const getUserLeaderboard = useCallback(
    async ({
      gameType,
      size = 100,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      size: number;
    }) => {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
        gameType,
        undefined,
        size
      );
      if (data) {
        const indexedUserRankData = data.map(
          (item: UserRankingDtoWithTown, index: number) => ({
            ...item,
            rank: index + 1,
            town: {
              ...item.town,
              name1: item.town.name1.replace(
                /(특별시|광역시|특별자치시|특별자치도)$/,
                ''
              ),
            },
          })
        );

        return indexedUserRankData;
      } else {
        return undefined;
      }
    },
    [minigameApi.gameUserApi]
  );

  const updateUserLeaderboard = useCallback(
    async ({
      gameType,
      size,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      size: number;
    }) => {
      const response = await getUserLeaderboard({ gameType, size });
      if (response) {
        setUserLeaderboard(response);
        return response;
      } else {
        return null;
      }
    },
    [getUserLeaderboard]
  );

  const updateTownLeaderboard = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      const response = await getTownLeaderboard({ gameType });
      if (response) {
        setTownLeaderboard(response);
        return response;
      } else {
        return null;
      }
    },
    [getTownLeaderboard]
  );

  return {
    townLeaderboard,
    userLeaderboard,
    updateUserLeaderboard,
    updateTownLeaderboard,
  };
};
