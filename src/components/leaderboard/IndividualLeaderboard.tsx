/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import DefaultUserRow from './DefaultUserRow';
import TopUserRow from './TopUserRow';
import { ReactComponent as RefreshIcon } from 'assets/refresh.svg';
import { updateUserData } from 'reducers/userDataReducer';
import BackendApi from 'services/backendApi/backendApi';

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

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const accessToken = window.localStorage.getItem('ACCESS_TOKEN');
  const getUserData = useCallback(
    async (baseUrl, accessToken) => {
      const response = await BackendApi.getUserInfo({
        baseUrl: baseUrl,
        accessToken: accessToken,
      });
      if (response.isFetched === true && response.data) {
        const { nickname, score, rank, comment } = response.data.data;
        dispatch(updateUserData(nickname, score, rank, comment));
        console.log('user data refreshed');
      }
    },
    [dispatch]
  );

  const getTownLeaderboard = useCallback(async (baseUrl, townId) => {
    const response = await BackendApi.getTownUserRank({
      baseUrl: baseUrl,
      townId: townId,
    });
    if (response.isFetched && response.data) {
      const responseData = response.data.data;
      const indexedTownRankData = responseData.map(
        (item: any, index: number) => ({
          rank: index + 1,
          ...item,
        })
      );
      setTownRankData(indexedTownRankData);
      console.log('leaderboard data refreshed');
    }
  }, []);

  const refreshLeaderboard = async () => {
    await getUserData(baseUrl, accessToken);
    await getTownLeaderboard(baseUrl, townId);
  };

  useEffect(() => {
    refreshLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div css={divStyle}>
      <div css={refreshDivStyle}>
        <p>이번 주 랭킹</p>
        <button onClick={refreshLeaderboard} css={refreshIconStyle}>
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
