/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import { DefaultDistrictRow } from './DefaultRow';
import { TopDistrictRow } from './TopRow';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import RefreshButton from 'components/buttons/RefreshButton';

const divStyle = css`
  padding-top: 10px;
  padding-bottom: 10px;
  max-height: inherit;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
const leaderboardWrapperStyle = css`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px; /* Increase/decrease this value for cross-browser compatibility */
  box-sizing: content-box; /* So the width will be 100% + 17px */
`;
const refreshDivStyle = css`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin-bottom: 12px;
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 161.7%;
    /* or 19px */

    color: #5b5b5b;
  }
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
      <div css={refreshDivStyle}>
        <p>이번 주 랭킹</p>
        <RefreshButton
          refreshLeaderboard={() => refreshLeaderboard(karrotRaiseApi)}
        />
      </div>

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
