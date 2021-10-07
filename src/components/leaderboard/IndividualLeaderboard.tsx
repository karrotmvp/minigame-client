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
      </div>
    </div>
  );
};

export default IndividualLeaderboard;
