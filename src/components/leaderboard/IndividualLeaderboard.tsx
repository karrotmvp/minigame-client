/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import DefaultUserRow from './DefaultUserRow';
import TopUserRow from './TopUserRow';
import { ReactComponent as RefreshIcon } from 'assets/refresh.svg';
import { updateUserData } from 'reducers/userDataReducer';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';

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
  const [townRankData, setTownRankData] = useState<any[]>([]);
  const { townId, townName } = useSelector((state: RootState) => ({
    townId: state.userDataReducer.townId,
    townName: state.userDataReducer.townName,
  }));
  const dispatch = useDispatch();
  const karrotRaiseApi = useKarrotRaiseApi();

  const getUserData = useCallback(
    async function (karrotRaiseApi: KarrotRaiseApi) {
      try {
        const response = await karrotRaiseApi.getUserInfo();
        if (response.isFetched === true && response.data) {
          console.log('individualLeaderboard, getUserData', response.data);
          const { nickname, score, rank, comment } = response.data.data;
          dispatch(updateUserData(nickname, score, rank, comment));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const getTownLeaderboard = useCallback(async function (
    karrotRaiseApi: KarrotRaiseApi,
    townId: string
  ) {
    try {
      const response = await karrotRaiseApi.getTownUserRank(townId);
      console.log('individualLeaderboard, getTownLeaderbarod', response.data);
      if (response.isFetched && response.data) {
        const responseData = response.data.data;
        const indexedTownRankData = responseData.map(
          (item: any, index: number) => ({
            rank: index + 1,
            ...item,
          })
        );
        setTownRankData(indexedTownRankData);
      }
    } catch (error) {
      console.error(error);
    }
  },
  []);

  const refreshLeaderboard = useCallback(
    (karrotRaiseApi: KarrotRaiseApi, townId: string) => {
      getUserData(karrotRaiseApi);
      getTownLeaderboard(karrotRaiseApi, townId);
    },
    [getTownLeaderboard, getUserData]
  );

  useEffect(() => {
    refreshLeaderboard(karrotRaiseApi, townId);
  }, [karrotRaiseApi, refreshLeaderboard, townId]);

  return (
    <div css={divStyle}>
      <div css={refreshDivStyle}>
        <p>이번 주 랭킹</p>
        <button
          onClick={() => {
            refreshLeaderboard(karrotRaiseApi, townId);
          }}
          css={refreshIconStyle}
        >
          <RefreshIcon />
        </button>
      </div>

      <div css={leaderboardWrapperStyle}>
        {townRankData.slice(0, 10).map((user) => {
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
          🎉 {townName} TOP 10 🎉 이 되어서
          <br />
          이웃들에게 한 마디를 남겨보세요!
        </p>
        {townRankData.slice(10).map((user) => {
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
