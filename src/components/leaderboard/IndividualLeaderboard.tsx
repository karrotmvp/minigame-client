/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DefaultUserRow from './DefaultUserRow';

const divStyle = css`
  padding-top: 20px;
  max-height: inherit;
  height: inherit'
  box-sizing: border-box;
`;
const leaderboardWrapperStyle = css`
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-top: 10px;
`;
interface IndividualLeaderboardProps {
  userData: any[];
}
const IndividualLeaderboard = ({ userData }: IndividualLeaderboardProps) => {
  return (
    <div css={divStyle}>
      <u
        css={{
          textUnderlineOffset: '5px',
        }}
      >
        주민 랭킹
      </u>

      <div css={leaderboardWrapperStyle}>
        {userData.slice(0, 5).map((user) => {
          return (
            <DefaultUserRow
              currentUser={false}
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
