/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import DefaultUserRow from 'components/leaderboard/DefaultUserRow';
import TopUserRow from 'components/leaderboard/TopUserRow';
import { sampleUserData } from 'sampleUserData';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import Button from '../components/Button';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';

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

const currentUserInfoRow = css`
  margin: 20px 0 10px;
`;

const Home = () => {
  const { push } = useNavigator();
  const handleGameStart = () => {
    push(`/game`);
  };

  // DATA FROM API (GET)
  const currentUserData = {
    rank: 123,
    nickname: 'Jason',
    profileImage: null,
    totalScore: 323,
    comment: '송파대표당근농부',
  };
  return (
    <>
      <ScreenHelmet title="홈" />
      <div css={divStyle}>
        <div css={headingWrapper}>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>Jason</span>님은
            <br />
            우리동네에서 <span css={emphasizedTextStyle}>23423위</span>에요!
          </h1>
          <div css={currentUserInfoRow}>
            {currentUserData.rank <= 10 ? (
              <TopUserRow
                rank={currentUserData.rank}
                nickname={currentUserData.nickname}
                score={currentUserData.totalScore}
                comment={currentUserData.comment}
              />
            ) : (
              <DefaultUserRow
                rank={currentUserData.rank}
                nickname={currentUserData.nickname}
                score={currentUserData.totalScore}
              />
            )}
          </div>
        </div>
        <div css={leaderboardWrapper}>
          <IndividualLeaderboard userData={sampleUserData} />
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

export default Home;
