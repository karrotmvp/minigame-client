/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
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

const horizontalLine = css`
  display: block;
  height: 0;
  width: 100%;
  border: 1px solid #e6e6e6;
  margin: 14px 0 13px;
`;

interface IndividualLeaderboardProps {
  userData: any[];
}
const IndividualLeaderboard = ({ userData }: IndividualLeaderboardProps) => {
  return (
    <div css={divStyle}>
      <div css={leaderboardWrapperStyle}>
        {userData.slice(0, 10).map((user) => {
          return (
            <TopUserRow
              key={user.id}
              rank={user.rank}
              nickname={user.nickname}
              comment={user.comment}
              score={user.score}
            />
          );
        })}
        <hr css={horizontalLine} />
        {userData.slice(10).map((user) => {
          return (
            <DefaultUserRow
              key={user.id}
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
