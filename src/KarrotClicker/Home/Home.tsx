/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useAnalytics } from 'services/analytics';
import { useNavigator } from '@karrotframe/navigator';
import useUserData from 'hooks/useUserData';
import TopImageUrl from 'assets/images/KarrotClicker/home_top_banner.png';
import { Button } from 'components/Button';
import { BackButton } from 'components/Button/NavigationButton';
import { ActiveUserCount } from '../../components/ActiveUserCount';
import { LeaderboardTabs } from 'KarrotClicker/Leaderboard/LeaderboardTabs';
import {
  DefaultUserRow,
  TopUserRow,
} from 'KarrotClicker/Leaderboard/LeaderboardTabs/Row';

const PageContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background: #faf5f4;
`;
const Nav = styled.div`
  background-image: url(${TopImageUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center -10px;
  width: 100%;
  height: 220px;
  margin-bottom: -20px;
`;
const customNav = css`
  left: 0;
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 15px;
  background: transparent;
`;
const customNavIcon = css`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 300ms;
  width: 2.25rem;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;

const MyRow = styled.div`
  margin: 0 18px 12px;
`;
const ActionItem = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;

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
          districtName={props.districtName}
        />
      ) : (
        <DefaultUserRow
          me={true}
          rank={props.rank}
          nickname={props.nickname}
          score={props.score}
          districtName={props.districtName}
        />
      )}
    </>
  );
};

export const Home = () => {
  const { push } = useNavigator();
  const analytics = useAnalytics();
  // const karrotRaiseApi = useKarrotRaiseApi();
  const {
    accessToken,
    // userId,
    userDistrictName,
    userNickname,
    userScore,
    userRank,
    userComment,
    // onUpdateUserData,
  } = useUserData();

  const goToGamePage = () => {
    push(`/karrot-clicker/game`);
  };
  const handleGameStart = () => {
    analytics.logEvent('click_game_start_button', {
      user_type: 'returning_user',
    });
    goToGamePage();
  };

  useEffect(() => {
    // getUserData(karrotRaiseApi, accessToken);
    analytics.logEvent('view_returning_user_home_page');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <PageContainer>
      <Nav>
        <div css={customNav}>
          <div css={customNavIcon}>
            <BackButton />
          </div>
        </div>
      </Nav>
      {/* <ScreenHelmet /> */}

      <MyRow>
        {
          userRank !== null ? (
            <UserScoreExists
              nickname={userNickname}
              rank={userRank}
              score={userScore}
              comment={userComment}
              districtName={userDistrictName}
            />
          ) : null
          // <UserScoreNull nickname={userNickname} />
        }
      </MyRow>
      <LeaderboardTabs />
      <div
        style={{
          position: 'absolute',
          bottom: '90px',
          right: '24px',
          zIndex: 101,
        }}
      >
        <ActiveUserCount />
      </div>
      <ActionItem>
        <Button
          size={`large`}
          color={`primary`}
          text={`게임 시작`}
          onClick={handleGameStart}
        />
      </ActionItem>
    </PageContainer>
  );
};
