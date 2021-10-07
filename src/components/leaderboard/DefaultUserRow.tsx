/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const row = ({ rank, currentUser }: any) => css`
  display: flex;
  flex-flow: row;

  padding: 12px 14px;
  margin: 4px;
  width: 100%;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px
  line-height: 161.7%;
  align-items: center;
  ${
    currentUser
      ? `border: 2px solid #EB5D0E;
      margin: 4px 0;
  `
      : null
  }
  ${
    rank === 1
      ? `
        color: #EB5D0E
      `
      : rank === 2
      ? `
        color: #FF8946
      `
      : rank === 3
      ? `
        color: #EB8E39
      `
      : null
  }

`;

const rankStyle = css`
  margin-right: 2px;
`;
const userInfo = css`
  display: flex;
  flex-flow: row;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  gap: 12px;
`;

const scoreStyle = css`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;
interface DefaultUserRowProps {
  rank: number | string;
  nickname: string;
  score: number;
  currentUser: boolean;
}
const DefaultUserRow = ({
  rank,
  nickname,
  score,
  currentUser = false,
}: DefaultUserRowProps) => {
  return (
    <div css={row({ rank, currentUser })}>
      <div css={userInfo}>
        <div css={rankStyle}>{rank}</div>
        <div>{nickname}</div>
      </div>
      <div css={scoreStyle}>{score}</div>
    </div>
  );
};

export default DefaultUserRow;
