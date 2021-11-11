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
  const { nickname, districtName } = useUserData();
  const {
    rank,
    score,
    comment,
    setGameTypeToKarrotClicker,
    updateMyKarrotClickerData,
    updateMyComment,
  } = useMyKarrotClickerData();
  const { onResetCount, resumeGame } = useGame();
  const goToGamePage = () => {
    push(`/karrot-clicker/game`);
  };

  const handleGameStart = () => {
    // bypass in web environment
    if (isInWebEnvironment) {
      console.log('bypass in web environment: home-page to game-page');
      goToGamePage();
    } else {
      if (accessToken) {
        // if access token exists, user is not new
        analytics.logEvent('click_game_start_button', {
          game_type: 'karrot-clicker',
          is_new_user: false,
        });
        goToGamePage();
        onResetCount();
        resumeGame();
      } else {
        // if user is new, open third-party agreement preset
        analytics.logEvent('click_game_start_button', {
          game_type: 'karrot-clicker',
          is_new_user: true,
        });

        handleThirdPartyAgreement();
        // executes if user agrees third-party agreement
        analytics.logEvent('click_karrot_mini_preset_agree_button', {
          game_type: 'karrot-clicker',
        });

        goToGamePage();
        onResetCount();
        resumeGame();
      }
    }
  };

  // =================================================================================================
  const leaveMiniApp = () => {
    ejectApp();
    analytics.logEvent('click_leave_mini_app_button');
  };
  const goToKarrotClicker = useCallback(async () => {
    setGameTypeToKarrotClicker();
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
        {/* <BannerImage /> */}
        {/* <img src={BannerImage} /> */}
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
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
  // width: 100px;
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
