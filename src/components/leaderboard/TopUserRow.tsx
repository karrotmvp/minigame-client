/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const row = ({ rank }: any) => css`
  display: flex;
  flex-flow: row;
  align-items: center;

  padding: 12px 14px;
  margin: 4px 0;
  width: 100%;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.15);
  border-radius: 5px;

  ${rank === 1
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
    : null}
`;

const contentWrapper = css`
  flex: 1;
`;

const rankStyle = css`
  display: flex;
  align-self: flex-start;
  margin-right: 15px;
  margin-top: 5px;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */
`;
const userInfo = css`
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 12px;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  color: #7c7c7c;
`;

const scoreStyle = css`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const commentStyle = css`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */
`;
const horizontalLine = css`
  display: block;
  height: 0;
  width: 100%;
  border: 1px solid #e6e6e6;
  margin: 4px 0 3px;
`;

interface TopUserRowProps {
  rank: number | string;
  nickname: string;
  score: number;
  comment: string;
}

const TopUserRow = ({ rank, nickname, score, comment }: TopUserRowProps) => {
  return (
    <div css={row({ rank })}>
      <div css={rankStyle}>{rank}</div>
      <div css={contentWrapper}>
        <div css={commentStyle}>"{comment}"</div>
        <hr css={horizontalLine} />
        <div css={userInfo}>
          <div>ID {nickname}</div>
          <div css={scoreStyle}>{score}</div>
        </div>
      </div>
    </div>
  );
};

export default TopUserRow;
