/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { render } from '@testing-library/react';
import { useEffect, useState } from 'react';
import BackendService from 'services/backendService';
import DefaultUserRow from './DefaultUserRow';
import TopUserRow from './TopUserRow';

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

const IndividualLeaderboard = ({}) => {
  const [townRankData, setTownRankData] = useState<any[]>([]);

  let townId = `9bdfe83b68f3`;
  const getTownRank = async () => {
    try {
      const response = await BackendService.getTownRank(townId);
      const responseData: any = response.data[`data`];
      const indexedTownRankData = responseData.map((item: any, index: any) => ({
        rank: index + 1,
        ...item,
      }));
      return indexedTownRankData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTownRank().then((data) => {
      // setTownRankData((result) => [...result, data]);
      setTownRankData(data);
    });
    // console.log(townRankData[0]);
  }, []);
  // console.log(townRankData.map((user: any) => console.log(user)));
  return (
    <div css={divStyle}>
      <div css={leaderboardWrapperStyle}>
        {townRankData.slice(0, 10).map((user) => {
          // console.log(townRankData);
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
        {/* <hr css={horizontalLine} /> */}
        <p css={infoText}>
          🎉 송파구 TOP 10 🎉 이 되어서
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
