/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const row = ({ rank, currentUser }: any) => css`
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
    currentUser
      ? `border: 2px solid #EB5D0E;
      margin: 4px 0;
  `
      : null
  }
  ${
    rank === 1
      ? `background-color: #DCDCDC`
      : rank === 2
      ? `background-color: #EDEDED`
      : rank === 3
      ? `background-color: #F5F5F5`
      : rank === `me`
      ? `border: 2px solid #EB5D0E`
      : `background-color: #f9f9f9`
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
const circleProfile = css`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #eb5d0e;
  flex-shrink: 0;
`;
const scoreStyle = css`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;
interface UserRowProps {
  rank: number | string;
  nickname: string;
  profileImage: any;
  score: number;
  currentUser: boolean;
}
const UserRow = ({
  rank,
  nickname,
  profileImage,
  score,
  currentUser = false,
}: UserRowProps) => {
  return (
    <div css={row({ rank, currentUser })}>
      <div css={userInfo}>
        <div css={rankStyle}>{rank}</div>
        <div css={circleProfile}>{profileImage}</div>
        <div>{nickname}</div>
      </div>
      <div css={scoreStyle}>{score}</div>
    </div>
  );
};

export { UserRow };
