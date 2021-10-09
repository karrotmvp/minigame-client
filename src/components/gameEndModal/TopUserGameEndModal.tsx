/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import Button, { DisabledButton } from '../Button';
import { ReactComponent as Karrot } from 'assets/karrot.svg';
import { FC, useState } from 'react';
import { useHistory } from 'react-router';
const axios = require('axios').default;

// const modalStyle = css`
//   position: absolute;
//   left: 0;
//   right: 0;
//   margin-left: auto;
//   margin-right: auto;
//   top: 50%;
//   transform: translateY(-50%);
//   width: 80%;
//   max-width: 400px;
//   display: flex;
//   flex-flow: column;
//   align-items: center;
//   background: #fff;

//   padding: 45px 15px 20px;
//   border-radius: 21px;
// `;
const largeText = css`
  margin: 15px 0;
`;
const horizontalLine = css`
  display: block;
  height: 0;
  width: 100%;
  border: 0.1px solid #e7e7e7;
`;
const infoText = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #a9a9a9;
  text-align: center;
  margin: 15px 0 23px;
`;
const textInput = css`
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  height: 40px;
  padding: 10px;
`;
const bottomActionDiv = css`
  flex: 0 1 40px;
  display: flex;
  flex-flow: column;
  width: 100%;
  gap: 10px;
`;

interface TopUserGameEndModalProps {
  rank: number;
}
const TopUserGameEndModal: FC<TopUserGameEndModalProps> = (props) => {
  const [topUserComment, setTopUserComment] = useState<string>('');

  let history = useHistory();

  const handleTopUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopUserComment(e.target.value);
  };

  const handlePatchCommentAndViewLeaderboard = async () => {
    await axios.patch(
      `${process.env.REACT_APP_BASE_URL}/user-rank/comment`,
      {
        comment: topUserComment,
      },
      {
        headers: {
          Authorization: process.env.REACT_APP_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    history.push('/leaderboard');
  };

  return (
    <>
      <Karrot />
      <h1
        css={[largeTextStyle, largeText]}
        style={{ textAlign: 'center', flex: '0 1 auto' }}
      >
        <span css={emphasizedTextStyle}>축하해요!</span>
        <br />
        <span css={emphasizedTextStyle}>{props.rank}위</span>로 순위권에
        들었어요!
      </h1>
      <hr css={horizontalLine} />
      <p css={infoText}>
        서초구 이웃들에게
        <br />
        하고 싶은 말을 남겨보세요
      </p>
      <div css={bottomActionDiv}>
        <input
          css={textInput}
          type="text"
          onChange={handleTopUserInput}
          value={topUserComment}
          placeholder="예) 내가 서초짱!"
          maxLength={25}
        />
        {topUserComment ? (
          <Button
            size={`large`}
            color={`primary`}
            text={`등록하기`}
            onClick={handlePatchCommentAndViewLeaderboard}
          />
        ) : (
          <DisabledButton size={`large`} text={`등록하기`} />
        )}
      </div>
    </>
  );
};

export default TopUserGameEndModal;
