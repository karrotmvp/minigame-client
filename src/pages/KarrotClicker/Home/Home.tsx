import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { BackIcon } from 'assets/Icon';
import { ActiveUserCount } from 'components/ActiveUserCount';
import { OldButton } from 'components/Button';
import { Nav } from 'components/Navigation/Nav';
import { useAccessToken, useMini, useUserData } from 'hooks';
import { rem } from 'polished';
import { useAnalytics } from 'services/analytics';
// import { useMinigameApi } from 'services/api/minigameApi';
import { useGame } from '../Game/hooks';
import { useMyKarrotClickerData } from '../hooks';
import { LeaderboardTabs } from '../Leaderboard/LeaderboardTabs';
import { DefaultUserRow, TopUserRow } from '../Leaderboard/LeaderboardTabs/Row';
import { ReactComponent as BannerImage } from 'assets/svg/KarrotClicker/top.svg';
import { useMinigameApi } from 'services/api/minigameApi';
import { useEffect } from 'react';

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
      {props.rank === 0 ? null : props.rank <= 10 ? (
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
  const { isTop } = useCurrentScreen();
  const { push, pop } = useNavigator();
  const analytics = useAnalytics();
  const { accessToken } = useAccessToken();
  const minigameApi = useMinigameApi();
  const { isInWebEnvironment, handleThirdPartyAgreement } = useMini();
  const { nickname, townName2: districtName } = useUserData();
  const { gameType, rank, score, comment } = useMyKarrotClickerData();
  const { resumeGame, onResetCount } = useGame();
  const goToGamePage = () => {
    push(`/karrot-clicker/game`);
  };

  const goToPlatformPage = () => {
    analytics.logEvent('click_leave_game_button', {
      game_type: 'karrot_clicker',
      location: 'home_page',
    });
    pop();
  };

  // Game start button handler
  const addPlayerCount = () => {
    minigameApi.gamePlayApi.playGameUsingPOST(gameType);
  };
  const handleReturningUser = () => {
    // if access token exists, user is not new
    analytics.logEvent('click_game_start_button', {
      game_type: 'karrot_clicker',
      is_new_user: false,
    });
    onResetCount();
    resumeGame();
  };
  const onNewUserSuccessHandler = () => {
    analytics.logEvent('click_third_party_agreement_button', {
      game_type: 'karrot_clicker',
      origin: 'game_start_button',
    });
    goToGamePage();
  };
  const handleNewUser = () => {
    // if user is new, open third-party agreement preset
    analytics.logEvent('click_game_start_button', {
      game_type: 'karrot_clicker',
      is_new_user: true,
    });
    handleThirdPartyAgreement(onNewUserSuccessHandler);
  };
  const handleGameStart = () => {
    // bypass in web environment
    if (isInWebEnvironment) {
      goToGamePage();
      return;
    }
    if (accessToken) {
      handleReturningUser();
      goToGamePage();
      addPlayerCount();
    } else {
      handleNewUser();
      addPlayerCount();
    }
  };

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_home_page', {
        game_type: 'karrot_clicker',
      });
    }
  }, [analytics, isTop]);
  return (
    <Page className="karrot-clicker-home-page">
      <Nav appendLeft={<BackIcon />} onClickLeft={goToPlatformPage} />
      <Banner className="banner">
        <BannerImage
          style={{
            backgroundSize: `100% 100%`,
          }}
        />
      </Banner>
      <MyRow>
        {score === 0 ? null : (
          <UserScoreExists
            nickname={nickname}
            rank={rank}
            score={score}
            comment={comment}
            districtName={districtName}
          />
        )}
      </MyRow>

      <LeaderboardTabs />

      <div
        style={{
          position: 'absolute',
          bottom: '90px',
          right: '24px',
          zIndex: 10100,
        }}
      >
        <ActiveUserCount gameType="GAME_KARROT" />
      </div>
      <ActionItems>
        <OldButton
          size={`large`}
          color={`primary`}
          text={`게임 시작`}
          onClick={handleGameStart}
        />
      </ActionItems>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background: #faf5f4;
`;
const Banner = styled.div`
  margin-top: -5rem;
  margin-bottom: -1rem;
`;

const MyRow = styled.div`
  margin: 0 18px 12px;
`;
const ActionItems = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${rem(15)} ${rem(18)} ${rem(30)};
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;
