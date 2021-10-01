/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { UserRow } from './UserRow';

const divStyle = css`
  padding: 20px 26px 0px;
`;
const leaderboardWrapperStyle = css`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const underlinedText = css`
  margin: 0;
  text-decoration: none; 
  position: relative; 
  &:after {
    position: absolute;
    content: '';
    height: 2px;
    bottom: -4px; 


    margin: 0 auto;
    left: 0;
    right: 0;
    width: 50%;
    background: green;

`;

const secondPlace = css``;

const thrirdPlace = css``;

const IndividualLeaderboard = () => {
  const topRanking = '';
  return (
    <div css={divStyle}>
      <p css={underlinedText}>주민 랭킹</p>

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
