import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { CloseIcon } from 'assets/Icon';
import { ActiveUserCount } from 'components/ActiveUserCount';
import { OldButton } from 'components/Button';
import { Nav } from 'components/Navigation/Nav';
import { useAccessToken, useMini, useUserData } from 'hooks';
import { rem } from 'polished';
import { useCallback, useEffect } from 'react';
import { useAnalytics } from 'services/analytics';
import { useMinigameApi } from 'services/api/minigameApi';
import { useGame } from '../Game/hooks';
import { useMyKarrotClickerData } from '../hooks';
import { LeaderboardTabs } from '../Leaderboard/LeaderboardTabs';
import { DefaultUserRow, TopUserRow } from '../Leaderboard/LeaderboardTabs/Row';
import { ReactComponent as BannerImage } from 'assets/svg/KarrotClicker/top.svg';

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
  const { push } = useNavigator();
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const analytics = useAnalytics();
  const { accessToken } = useAccessToken();
  const { ejectApp, isInWebEnvironment, handleThirdPartyAgreement } = useMini();
  const { nickname, districtName, setUserInfo } = useUserData();
  const {
    rank,
    score,
    comment,
    setGameTypeToKarrotClicker,
    updateMyKarrotClickerData,
    updateMyComment,
  } = useMyKarrotClickerData();
  const { resumeGame, onResetCount } = useGame();
  const goToGamePage = () => {
    push(`/karrot-clicker/game`);
  };
  // const updateUserInfo = async () => {
  //   const {
  //     data: { data },
  //   } = await minigameApi.userApi.getUserInfoUsingGET();
  //   if (data) {
  //     setUserInfo(data.id, data.nickname);
  //     // FA: track user with set user id
  //     analytics.setUserId(data.id);
  //     console.log('setuserinfo', data.id, data.nickname);
  //   }
  // };
  const handleReturningUser = () => {
    // if access token exists, user is not new
    analytics.logEvent('click_game_start_button', {
      game_type: 'karrot-clicker',
      is_new_user: false,
    });

    onResetCount();
    resumeGame();
  };

  const handleNewUser = () => {
    // if user is new, open third-party agreement preset
    analytics.logEvent('click_game_start_button', {
      game_type: 'karrot-clicker',
      is_new_user: true,
    });

    handleThirdPartyAgreement(goToGamePage);
    // await goToGamePage();

    // onResetCount();
    // resumeGame();
  };

  const handleGameStart = () => {
    // bypass in web environment
    if (isInWebEnvironment) {
      console.log('bypass in web environment: home-page to game-page');
      goToGamePage();
      return;
    }
    if (accessToken) {
      handleReturningUser();
      // updateUserInfo();
      goToGamePage();
    } else {
      handleNewUser();
      // updateUserInfo();
      // goToGamePage();
    }
  };
  // =================================================================================================
  const leaveMiniApp = () => {
    analytics.logEvent('click_leave_mini_app_button');
    ejectApp();
  };
  const goToKarrotClicker = useCallback(async () => {
    setGameTypeToKarrotClicker();
    try {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_KARROT');
      if (data) {
        if (data.score && data.rank) {
          updateMyKarrotClickerData(data.score, data.rank);
          console.log(score);
        }
        if (data.comment) {
          updateMyComment(data.comment);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    minigameApi.gameUserApi,
    score,
    setGameTypeToKarrotClicker,
    updateMyComment,
    updateMyKarrotClickerData,
  ]);

  useEffect(() => {
    if (isTop) {
      goToKarrotClicker();

      analytics.logEvent('view_home_page', {
        game_type: 'karrot-clicker',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTop, analytics]);
  // =================================================================================================
  return (
    <Page className="karrot-clicker-home-page">
      <Nav appendLeft={<CloseIcon />} onClickLeft={leaveMiniApp} />
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
