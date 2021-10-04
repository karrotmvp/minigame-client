/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { UserRow } from './UserRow';

const divStyle = css`
  padding-top: 20px;
  max-height: inherit;
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
        {userData.map((user) => {
          return (
            <UserRow
              key={user.id}
              rank={user.rank}
              nickname={user.nickname}
              profileImage={user.profileImage}
              score={user.score}
            />
          );
        })}
      </div>
    </div>
  );
};

export default IndividualLeaderboard;
