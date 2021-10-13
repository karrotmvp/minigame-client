/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import DefaultUserRow from './DefaultUserRow';
import TopUserRow from './TopUserRow';
const axios = require('axios').default;

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
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL_PRODUCTION}/users/me`, {
        headers: {
          Authorization: window.localStorage.getItem('ACCESS_TOKEN'),
        },
      })
      .then((response: any) => {
        const townId = response.data.data.town.id;
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL_PRODUCTION}/towns/${townId}/user-rank`
          )
          .then((response: any) => {
            const responseData: any = response.data.data;
            const indexedTownRankData = responseData.map(
              (item: any, index: number) => ({
                rank: index + 1,
                ...item,
              })
            );
            console.log(indexedTownRankData);

            setTownRankData(indexedTownRankData);
          })
          .catch((error: any) => console.error(error));
      })
      .catch((error: any) => console.error(error));
  }, []);
  return (
    <div css={divStyle}>
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
          🎉 서초구 TOP 10 🎉 이 되어서
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
