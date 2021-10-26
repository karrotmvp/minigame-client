/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { DefaultDistrictRow } from './DefaultRow';
import { TopDistrictRow } from './TopRow';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import RefreshButton from 'components/buttons/RefreshButton';

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

  margin: 19px 2px 12px 0;
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

// interface DistrictRankData {}
const DistrictLeaderboard = () => {
  const [districtRankData, setDistrictRankData] = useState<any[]>([]);
  const karrotRaiseApi = useKarrotRaiseApi();

  const getDistrictLeaderboardData = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi) => {
      try {
        const response = await karrotRaiseApi.getDistrictRank();
        if (response.isFetched && response.data) {
          console.log(response.data);
          const responseData = response.data.data;
          const indexedDistrictRankData = responseData.map(
            (item: any, index: number) => ({
              rank: index + 1,
              ...item,
            })
          );

          setDistrictRankData(indexedDistrictRankData);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const refreshLeaderboard = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi) => {
      await getDistrictLeaderboardData(karrotRaiseApi);
    },
    [getDistrictLeaderboardData]
  );

  useEffect(() => {
    refreshLeaderboard(karrotRaiseApi);
  }, [karrotRaiseApi, refreshLeaderboard]);

  return (
    <div css={divStyle}>
      <Refresh>
        <p>이번 주 랭킹</p>
        <RefreshButton
          refreshLeaderboard={() => refreshLeaderboard(karrotRaiseApi)}
        />
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

export default DistrictLeaderboard;
