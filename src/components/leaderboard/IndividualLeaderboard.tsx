/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as RefreshIcon } from 'assets/refresh.svg';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { DefaultUserRow } from './DefaultRow';
import useUserData from 'hooks/useUserData';
import { TopUserRow } from './TopRow';

const divStyle = css`
  padding-top: 10px;
  padding-bottom: 10px;
  max-height: inherit;
  height: inherit'
  box-sizing: border-box;
`;
const leaderboardWrapperStyle = css`
  display: flex;
  flex-flow: column;
  align-items: center;
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
const refreshIconStyle = css`
  border: none;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

const infoText = css`
  margin: 17px 0 17px;

  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 161.7%;
  /* or 26px */

  text-align: center;

  color: #7c7c7c;
`;

const IndividualLeaderboard = () => {
  const [individualRankData, setIndividualRankData] = useState<any[]>([]);
  const karrotRaiseApi = useKarrotRaiseApi();
  const { accessToken, userId, userDistrictName, onUpdateUserData } =
    useUserData();
  const getUserData = useCallback(
    async function (karrotRaiseApi: KarrotRaiseApi, accessToken: string) {
      try {
        const response = await karrotRaiseApi.getUserInfo(accessToken);
        if (response.isFetched === true && response.data) {
          const { nickname, score, rank, comment } = response.data.data;
          onUpdateUserData(userId, nickname, score, rank, comment);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateUserData, userId]
  );

  const getUserLeaderboardData = useCallback(async function (
    karrotRaiseApi: KarrotRaiseApi
  ) {
    try {
      const response = await karrotRaiseApi.getUserRank();
      if (response.isFetched && response.data) {
        console.log(response.data);
        const responseData = response.data.data;
        const indexedindividualRankData = responseData.map(
          (item: any, index: number) => ({
            rank: index + 1,
            ...item,
          })
        );
        setIndividualRankData(indexedindividualRankData);
        console.log(indexedindividualRankData);
      }
    } catch (error) {
      console.error(error);
    }
  },
  []);

  const refreshLeaderboard = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi, accessToken: string) => {
      await getUserData(karrotRaiseApi, accessToken);
      await getUserLeaderboardData(karrotRaiseApi);
    },
    [getUserLeaderboardData, getUserData]
  );

  useEffect(() => {
    refreshLeaderboard(karrotRaiseApi, accessToken);
  }, [accessToken, karrotRaiseApi, refreshLeaderboard]);

  return (
    <div css={divStyle}>
      <div css={refreshDivStyle}>
        <p>이번 주 랭킹</p>
        <button
          onClick={() => {
            refreshLeaderboard(karrotRaiseApi, accessToken, userDistrictId);
          }}
          css={refreshIconStyle}
        >
          <RefreshIcon />
        </button>
      </div>

      <div css={leaderboardWrapperStyle}>
        {individualRankData.slice(0, 10).map((user) => {
          return (
            <TopUserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment}
              score={user.score}
            />
          );
        })}
        <p css={infoText}>
          🎉 {userDistrictName} TOP 10 🎉 이 되어서
          <br />
          이웃들에게 한 마디를 남겨보세요!
        </p>
        {individualRankData.slice(10).map((user) => {
          return (
            <DefaultUserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              score={user.score}
            />
          );
        })}
      </div>
    </div>
  );
};

export default IndividualLeaderboard;
