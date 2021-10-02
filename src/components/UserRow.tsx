/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const row = ({ topRanking }: any) => css`
  display: flex;
  flex-flow: row;
  padding: 12px 14px;
  margin: 4px;
  width: 100%;
  border-radius: 10px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px
  line-height: 161.7%;
  align-items: center;
  
  ${
    topRanking === `firstPlace`
      ? `background-color: #EB5D0E`
      : topRanking === `secondPlace`
      ? `background-color: #FFB78F`
      : topRanking === `thrirdPlace`
      ? `background-color: #FFE2D1`
      : `background-color: #f9f9f9`
  }

`;

const ranking = css`
  margin-right: 19px;
`;
const userInfo = css`
  display: flex;
  flex-flow: row;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  gap: 12px;
  flex: 1;
`;
const circleProfile = css`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #eb5d0e;
  flex-shrink: 0;
`;

const score = css`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const UserRow = ({ topRanking }: any) => {
  return (
    <div css={row({ topRanking })}>
      <div css={ranking}>1</div>
      <div css={userInfo}>
        <div css={circleProfile}></div>
        <div>매우매우긴닉네임</div>
      </div>
      <div css={score}>1230429342034909</div>
    </div>
  );
};

export { UserRow };
