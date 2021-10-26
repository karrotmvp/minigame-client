/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import {
  emphasizedTextStyle,
  largeTextStyle,
  mediumTextStyle,
} from 'styles/textStyle';
import Button from 'components/buttons/Button';
import LeaderboardTabs from 'components/leaderboard/LeaderboardTabs';
import { useCallback, useEffect } from 'react';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { commafy } from 'functions/numberFunctions';
import { useAnalytics } from 'services/analytics';
import { useHistory } from 'react-router-dom';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { DefaultUserRow } from 'components/leaderboard/DefaultRow';
import { TopUserRow } from 'components/leaderboard/TopRow';
import useUserData from 'hooks/useUserData';
import DailyUserCount from 'components/DailyUserCount';
import TopImageUrl from 'assets/background.png';

// nav
const Nav = styled.div`
  background-image: url(${TopImageUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
  height: 220px;
  margin-bottom: -10px;
`;
const customNav = css`
  // position: fixed;
  left: 0;
  width: 100%;
  // top: 0;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 30px;
  background: transparent;
`;
const customNavIcon = css`
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
  height: 100%;
  // overflow: hidden;
  background: #faf5f4;
`;
const MyRow = styled.div`
  margin: 0 18px 12px;
`;
const ActionItem = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;

interface UserScoreNullProps {
  nickname: string;
}
const UserScoreNull: React.FC<UserScoreNullProps> = (props) => {
  return (
    <>
      <h1 css={largeTextStyle}>
        <span css={emphasizedTextStyle}>{props.nickname}</span>님, 아직 기록이
        없어요
      </h1>
      <h2 css={mediumTextStyle}>
        당근을 수확하고 이웃들에게 한 마디 남겨봐요!
      </h2>
    </>
  );
};
interface UserScoreExistsProps {
  nickname: string;
  rank: number;
  score: number;
  comment: string;
  districtName: string;
}
const UserScoreExists: React.FC<UserScoreExistsProps> = (props) => {
  return (
    <>
      {props.rank <= 10 ? (
        <TopUserRow
          me={true}
          rank={props.rank}
          nickname={props.nickname}
          score={props.score}
          comment={props.comment}
        />
      ) : (
        <DefaultUserRow
          me={true}
          rank={props.rank}
          nickname={props.nickname}
          score={props.score}
        />
      )}
    </>
  );
};

const ReturningUserHome = () => {
  const history = useHistory();
  const analytics = useAnalytics();
  const karrotRaiseApi = useKarrotRaiseApi();
  const {
    accessToken,
    userId,
    userDistrictName,
    userNickname,
    userScore,
    userRank,
    userComment,
    onUpdateUserData,
  } = useUserData();

  const handleGameStart = () => {
    analytics.logEvent('click_game_start_button');
    history.push('/game');
  };

  const getUserData = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi, accessToken: string) => {
      try {
        const response = await karrotRaiseApi.getUserInfo(accessToken);
        if (response.isFetched === true && response.data) {
          console.log('returningUserHome, getUserData', response.data);
          const { nickname, score, rank, comment } = response.data.data;
          onUpdateUserData(userId, nickname, score, rank, comment);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateUserData, userId]
  );

  useEffect(() => {
    getUserData(karrotRaiseApi, accessToken);
    analytics.logEvent('view_returning_user_home_page');
  }, [accessToken, analytics, getUserData, karrotRaiseApi]);

  return (
    <>
      <div css={divStyle}>
        <Nav>
          <div css={customNav}>
            <div css={customNavIcon}>
              <AppEjectionButton />
            </div>
          </div>
        </Nav>

        <MyRow>
          {userRank !== null ? (
            <UserScoreExists
              nickname={userNickname}
              rank={userRank}
              score={userScore}
              comment={userComment}
              districtName={userDistrictName}
            />
          ) : (
            <UserScoreNull nickname={userNickname} />
          )}
        </MyRow>
        <LeaderboardTabs />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '90px',
          right: '24px',
          zIndex: 101,
        }}
      >
        <DailyUserCount />
      </div>
      <ActionItem>
        <Button
          size={`large`}
          color={`primary`}
          text={`게임 시작`}
          onClick={handleGameStart}
        />
      </ActionItem>
    </>
  );
};

export default ReturningUserHome;
