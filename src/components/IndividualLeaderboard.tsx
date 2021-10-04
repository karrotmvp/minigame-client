/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { UserRow } from './UserRow';

const divStyle = css`
  padding-top: 20px;
`;
const leaderboardWrapperStyle = css`
  display: flex;
  flex-flow: column;
  align-items: center;
  margin-top: 10px;
`;
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
        <UserRow topRanking={`firstPlace`} />
        <UserRow topRanking={`secondPlace`} />
        <UserRow topRanking={`thirdPlace`} />
        <UserRow topRanking={topRanking} />
        <UserRow topRanking={topRanking} />
      </div>
    </div>
  );
};

export default IndividualLeaderboard;
