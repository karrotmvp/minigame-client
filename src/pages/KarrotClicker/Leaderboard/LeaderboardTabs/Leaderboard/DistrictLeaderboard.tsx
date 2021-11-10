/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { RefreshButton } from 'components/Button';
import { useCallback, useEffect, useState } from 'react';
import { DefaultDistrictRow, TopDistrictRow } from '../Row';
// import { WeeklyCountdown } from 'components/Timer';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyKarrotClickerData } from 'pages/KarrotClicker/hooks';

export const DistrictLeaderboard: React.FC = () => {
  const minigameApi = useMinigameApi();
  const { gameType } = useMyKarrotClickerData();
  const [districtRankData, setDistrictRankData] = useState<any[]>([]);

  const updateDistrictLeaderboard = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(gameType);
    if (data) {
      const indexedDistrictRankData = data.map((item: any, index: number) => ({
        rank: index + 1,
        ...item,
      }));
      setDistrictRankData(indexedDistrictRankData);
    }
    console.log('update district leaderboard');
  }, [gameType, minigameApi.gameTownApi]);

  useEffect(() => {
    updateDistrictLeaderboard();
  }, [updateDistrictLeaderboard]);

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
          <p>이번 주 랭킹</p>
          {/* <WeeklyCountdown /> */}
        </div>
        <RefreshButton handleRefresh={updateDistrictLeaderboard} />
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
