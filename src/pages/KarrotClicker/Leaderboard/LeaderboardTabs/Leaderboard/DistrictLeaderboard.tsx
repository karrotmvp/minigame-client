/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { RefreshButton } from 'components/Button';
import { useCallback, useEffect, useState } from 'react';
import { DefaultDistrictRow, TopDistrictRow } from '../Row';
import { WeeklyCountdown } from 'components/Timer';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyKarrotClickerData } from 'pages/KarrotClicker/hooks';
import { useAnalytics } from 'services/analytics';

export const DistrictLeaderboard: React.FC = () => {
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { gameType } = useMyKarrotClickerData();
  const [districtRankData, setDistrictRankData] = useState<any[]>([]);

  const updateDistrictLeaderboard = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(gameType);
      if (data) {
        const indexedDistrictRankData = data.map(
          (item: any, index: number) => ({
            rank: index + 1,
            ...item,
          })
        );
        setDistrictRankData(indexedDistrictRankData);
      }
      console.log('update district leaderboard');
    } catch (error) {
      console.error(error);
    }
  }, [gameType, minigameApi.gameTownApi]);

  const refreshLeaderboard = useCallback(() => {
    analytics.logEvent('click_refresh_button', {
      game_type: 'karrot-clicker',
      button_type: 'town_leaderboard',
    });

    updateDistrictLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    refreshLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div css={divStyle}>
      <Refresh>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '4px',
          }}
        >
          <p>
            이번 주 랭킹&nbsp;&nbsp;
            <span>
              | 초기화 까지
              <span>
                <WeeklyCountdown />
              </span>
            </span>
          </p>
        </div>
        <RefreshButton handleRefresh={refreshLeaderboard} />
      </Refresh>

      <div css={leaderboardWrapperStyle}>
        {districtRankData.slice(0, 10).map((district) => {
          return (
            <TopDistrictRow
              key={district.name2}
              rank={district.rank}
              cityName={district.name1}
              districtName={district.name2}
              playerCount={district.playerCount}
              // participant={district.participant}
              score={district.score}
            />
          );
        })}

        {districtRankData.slice(10).map((district) => {
          return (
            <DefaultDistrictRow
              key={district.name2}
              rank={district.rank}
              cityName={district.name1}
              districtName={district.name2}
              playerCount={district.playerCount}
              score={district.score}
            />
          );
        })}
      </div>
    </div>
  );
};

const divStyle = css`
  max-height: inherit;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
const Refresh = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;

  margin: 14px 2px 12px 0;
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 161.7%;
    /* or 19px */

    color: #5b5b5b;

    span {
      font-size: 10px;
      line-height: 161.7%;
      font-style: normal;
      font-weight: normal;
      /* or 16px */

      color: #5b5b5b;
      span {
        color: #eb5d0e;
      }
    }
  }
`;
const leaderboardWrapperStyle = css`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 60px;

  // Hide scrollbar but keep functionality
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
