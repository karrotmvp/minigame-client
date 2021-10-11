/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { commafy } from 'components/functions/commafy';

const row = css`
  display: flex;
  flex-flow: row;
  align-items: center;

  padding: 12px 14px;
  margin: 4px 0;
  width: 100%;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.15);
  border-radius: 5px;

  background: #ffffff;
`;

const rankStyle = css`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  color: #5b5b5b;
`;
const userInfo = css`
  display: flex;
  flex-flow: row;
  align-items: center;
  font-size: 16px;
  gap: 12px;

  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */

  color: #7c7c7c;
`;

const scoreStyle = css`
  display: flex;
  justify-content: flex-end;
  flex: 1;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  text-align: right;

  color: #7c7c7c;
`;
interface DefaultUserRowProps {
  rank: number;
  nickname: string;
  score: number;
}
const DefaultUserRow = ({ rank, nickname, score }: DefaultUserRowProps) => {
  return (
    <div css={row}>
      <div css={userInfo}>
        <div css={rankStyle}>{commafy(rank)}</div>
        <div>{nickname}</div>
      </div>
      <div css={scoreStyle}>{commafy(score)}</div>
    </div>
  );
};

export default DefaultUserRow;
