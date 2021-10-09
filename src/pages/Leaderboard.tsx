/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigator } from '@karrotframe/navigator';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';
import { AppEjectionButton } from 'components/AppEjectionButton';
import { largeTextStyle, emphasizedTextStyle } from 'styles/textStyle';
import Button from 'components/Button';
// import { sampleUserData } from 'sampleUserData';
import DefaultUserRow from 'components/leaderboard/DefaultUserRow';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { reset } from 'reducers/counterReducer';
import TopUserRow from 'components/leaderboard/TopUserRow';
import BackendService from 'services/backendService';
import { useEffect, useState } from 'react';
import { addData } from 'reducers/userDataReducer';
import { sampleUserData } from 'sampleUserData';

const customNav = css`
  left: 0;
  width: 100%;
  // height: 100%;
  top: 0;
  display: flex;
  width: 100%;
  height: 44px;
  padding: 0 0.5rem;
`;

const custonNavIcon = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: opacity 300ms;
  width: 2.25rem;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;

const divStyle = css`
  display: flex;
  flex-flow: column;
  height: calc(100% - 44px);
`;

const headingWrapper = css`
  flex: 1;
  padding: 20px 26px 20px;
`;
const leaderboardWrapper = css`
  overflow: auto;
  padding: 0 26px;
`;
const actionItemWrapper = css`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;

const currentUserInfoRow = css`
  margin: 20px 0 10px;
`;

const Leaderboard = () => {
  const { push } = useNavigator();
  const dispatch = useDispatch();

  const onReset = () => dispatch(reset());

  const handlePlayAgain = async () => {
    onReset();
    await push('/game');
  };
  // Data from backend (GET)

  const { nickname, score, rank, comment } = useSelector(
    (state: RootState) => ({
      nickname: state.userDataReducer.nickname,
      score: state.userDataReducer.score,
      rank: state.userDataReducer.rank,
      comment: state.userDataReducer.comment,
    })
  );

  return (
    <>
      <div css={customNav}>
        <div css={custonNavIcon}>
          <AppEjectionButton />
        </div>
      </div>

      <div css={divStyle}>
        <div css={headingWrapper}>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>{nickname}</span>님은 <br />
            서초구에서 <span css={emphasizedTextStyle}>{rank}위</span>에요!
          </h1>
          <div css={currentUserInfoRow}>
            {rank <= 10 ? (
              <TopUserRow
                rank={rank}
                nickname={nickname}
                score={score}
                comment={comment}
              />
            ) : (
              <DefaultUserRow rank={rank} nickname={nickname} score={score} />
            )}
          </div>
        </div>
        <div css={leaderboardWrapper}>
          <IndividualLeaderboard townRankData={sampleUserData} />
        </div>
        <div css={actionItemWrapper}>
          <Button
            size={`medium`}
            color={`secondary`}
            text={`다시하기`}
            onClick={handlePlayAgain}
          />
          <Button
            size={`medium`}
            color={`primary`}
            text={`자랑하기`}
            onClick={handlePlayAgain}
          />
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
