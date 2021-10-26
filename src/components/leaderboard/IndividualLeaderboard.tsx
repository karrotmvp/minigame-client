/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { DefaultUserRow } from './DefaultRow';
import useUserData from 'hooks/useUserData';
import { TopUserRow } from './TopRow';
import RefreshButton from '../buttons/RefreshButton';

const divStyle = css`
  // max-height: inherit;
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
const LeaderboardWrapper = styled.div`
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
  const { accessToken, userId, onUpdateUserData } = useUserData();
  const getUserData = useCallback(
    async function (karrotRaiseApi: KarrotRaiseApi, accessToken: string) {
      try {
        const { data, status } = await karrotRaiseApi.getUserInfo(accessToken);
        if (status === 200) {
          const { nickname, score, rank, comment } = data;
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
      const { data, status } = await karrotRaiseApi.getUserRank();
      if (status === 200) {
        // console.log(response.data);
        const indexedindividualRankData = data.map(
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
      <Refresh>
        <p>이번 주 랭킹</p>
        <RefreshButton
          refreshLeaderboard={() =>
            refreshLeaderboard(karrotRaiseApi, accessToken)
          }
        />
      </Refresh>

      <LeaderboardWrapper>
        {individualRankData.slice(0, 10).map((user) => {
          return (
            <TopUserRow
              key={user.userId}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment}
              score={user.score}
              districtName={user.town.name2}
            />
          );
        })}
        <p css={infoText}>
          🎉 TOP 10 🎉 이 되어서
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
              districtName={user.town.name2}
            />
          );
        })}
      </LeaderboardWrapper>
    </div>
  );
};

export default IndividualLeaderboard;
