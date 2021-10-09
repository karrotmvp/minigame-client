/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import IconClose from 'assets/IconClose';
import DefaultUserRow from 'components/leaderboard/DefaultUserRow';
import TopUserRow from 'components/leaderboard/TopUserRow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { addData } from 'reducers/userDataReducer';
import { sampleUserData } from 'sampleUserData';
import BackendService from 'services/backendService';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import Button from 'components/Button';
import IndividualLeaderboard from 'components/leaderboard/IndividualLeaderboard';

const divStyle = css`
  display: flex;
  flex-flow: column;
  height: 100%;
`;
const headingWrapper = css`
  flex: 1;
  padding: 20px 26px 20px; ;
`;
const leaderboardWrapper = css`
  overflow: auto;
  padding: 0 26px;
`;
const actionItemWrapper = css`
  display: flex;
  justify-content: center;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;
const currentuserDataInfoRow = css`
  margin: 20px 0 10px;
`;

const ReturningUserHome = ({ townRankData }: any) => {
  console.log(townRankData);
  const { push } = useNavigator();

  const handleGameStart = () => {
    push(`/game`);
  };

  const { nickname, score, rank, comment } = useSelector(
    (state: RootState) => ({
      nickname: state.userDataReducer.nickname,
      score: state.userDataReducer.score,
      rank: state.userDataReducer.rank,
      comment: state.userDataReducer.comment,
    })
  );
  const dispatch = useDispatch();

  // let townId = `9bdfe83b68f3`;

  // useEffect(() => {
  //   Promise.all([
  //     BackendService.getCurrentUserInfo(),
  //     BackendService.getTownRank(townId),
  //   ]).then(function (results) {
  //     let userData = results[0].data[`data`];
  //     let townRankData = results[1].data[`data`];
  //     let { nickname, score, rank, comment } = userData;
  //     dispatch(addData(nickname, score, rank, comment));
  //     // return { userData, townRankData };
  //   });
  // }, []);

  return (
    <>
      <ScreenHelmet title="홈" customCloseButton={<IconClose />} />
      <div css={divStyle}>
        <div css={headingWrapper}>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>{nickname}</span>님은
            <br />
            우리동네에서
            <span css={emphasizedTextStyle}> {rank}위</span>에요!
          </h1>
          <div css={currentuserDataInfoRow}>
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
            size={`large`}
            color={`primary`}
            text={`시작하기`}
            onClick={handleGameStart}
          />
        </div>
      </div>
    </>
  );
};

export default ReturningUserHome;
