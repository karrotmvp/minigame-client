/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import DefaultUserRow from 'components/leaderboard/DefaultUserRow';
import TopUserRow from 'components/leaderboard/TopUserRow';
import { sampleUserData } from 'sampleUserData';
import { largeTextStyle, mediumTextStyle } from 'styles/textStyle';
import Button from '../components/Button';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';

const divStyle = css`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const contentWrapperStyle = css`
  flex: 1;
  padding: 20px 26px 0px;
`;
const actionItemDivStyle = css`
  display: flex;
  justify-content: center;
  padding: 16px 24px 34px;
  // box-shadow: 0px -1px 6px 0px rgba(50, 50, 50, 0.3);
  border: 1px solid #ebebeb;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;

const Home = () => {
  const { push } = useNavigator();
  const handleGameStart = () => {
    push(`/game`);
  };
  return (
    <>
      <ScreenHelmet title="홈" />
      <div css={divStyle}>
        <div css={contentWrapperStyle}>
          <h1 css={largeTextStyle}>강남구 이웃님! 아직 기록이 없어요</h1>
          <h2 css={mediumTextStyle}>당근 키우기를 이웃들과 함께해요!</h2>
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
          <IndividualLeaderboard userData={sampleUserData} />
        </div>

        <div css={actionItemDivStyle}>
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
