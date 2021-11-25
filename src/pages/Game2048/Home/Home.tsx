import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
// import { LastWeekTopDistrict, LastWeekTopTownie } from './LastWeekWinner';
import {
  VeryFirstWeekDistrict,
  VeryFirstWeekTownie,
} from './LastWeekWinner/VeryFirstWeek';
import { rem } from 'polished';
import { Button } from 'components/Button';
import { useCallback, useEffect, useState } from 'react';
import { Nav } from 'components/Navigation/Nav';
import { BackIcon } from 'assets/Icon';
import { ReactComponent as BannerImage } from 'assets/svg/game2048/home_top_banner.svg';
import { Refresh } from '../Leaderboard/Refresh';
import { MyInfo } from '../Leaderboard/MyInfo';
import { useMinigameApi } from 'services/api/minigameApi';
import { ActiveUserCount } from 'components/ActiveUserCount';
import { useAccessToken } from 'hooks/useAccessToken';
import { useMyGame2048Data } from '../hooks';
import { useMini } from 'hooks';
import { useThrottledCallback } from 'use-debounce/lib';
import { useAnalytics } from 'services/analytics';
import { navHeight, PageContainer, pageHeight } from 'styles';
// import { lastWeek } from 'utils';

export const Home = () => {
  const { isTop } = useCurrentScreen();
  const { push, pop } = useNavigator();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { accessToken } = useAccessToken();
  // const { resetGame } = useGame();
  const { isInWebEnvironment, handleThirdPartyAgreement } = useMini();
  const {
    rank,
    gameType,
    updateMyScore,
    updateMyComment,
    updateMyHighestScore,
  } = useMyGame2048Data();
  const [isRanked, setIsRanked] = useState<boolean>(false);
  const [userLeaderboardData, setUserLeaderboardData] = useState<any[]>([]);
  const [districtLeaderboardData, setDistrictLeaderboardData] = useState<any[]>(
    []
  );

  // const [lastWeekTopDistrict, setLastWeekTopDistrict] = useState<{
  //   townName1: string;
  //   townName2: string;
  //   score: number;
  // }>({ townName1: '', townName2: '', score: 0 });
  // const [lastWeekTopTownie, setLastWeekTopTownie] = useState<{
  //   name: string;
  //   score: number;
  // }>({ name: '', score: 0 });
  const goToPlatformPage = () => {
    analytics.logEvent('click_leave_game_button', {
      game_type: '2048_puzzle',
      location: 'home_page',
    });
    pop();
  };
  const goToGamePage = () => {
    // resetGame();
    push(`/game-2048/game`);
  };

  // game start button handler
  // =================================================================
  const addPlayerCount = () => {
    minigameApi.gamePlayApi.playGameUsingPOST(gameType);
  };

  const handleReturningUser = () => {
    // if access token exists, user is not new
    analytics.logEvent('click_game_start_button', {
      game_type: '2048_puzzle',
      is_new_user: false,
    });
  };
  const onNewUserSuccessHandler = () => {
    analytics.logEvent('click_third_party_agreement_button', {
      game_type: '2048_puzzle',
      button_type: 'game_start_button',
    });
    addPlayerCount();
    goToGamePage();
  };
  const handleNewUser = () => {
    // if user is new, open third-party agreement preset
    analytics.logEvent('click_game_start_button', {
      game_type: '2048_puzzle',
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
    }
  };
  // =================================================================

  // last week winner handler
  // =================================================================
  // const getLastWeekTopTownie = async () => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
  //       gameType,
  //       lastWeek.month,
  //       1,
  //       lastWeek.week,
  //       lastWeek.year
  //     );
  //     if (data && data[0]) {
  //       setLastWeekTopTownie({ name: data[0].nickname, score: data[0].score });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const getLastWeekTopDistrict = async () => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(
  //       gameType,
  //       lastWeek.month,
  //       1,
  //       lastWeek.week,
  //       lastWeek.year
  //     );
  //     if (data && data[0]) {
  //       setLastWeekTopDistrict({
  //         townName1: data[0].name1,
  //         townName2: data[0].name2,
  //         score: data[0].score,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // refresh button handler
  // =================================================================
  const updateMyGameData = async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
    if (data) {
      if (data.score && data.rank) {
        updateMyScore(data.score, data.rank);
      }
      if (data.comment) {
        updateMyComment(data.comment);
      }
    }
  };
  const getMyBestScoreEver = async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType, 'BEST');
    if (data) {
      updateMyHighestScore(data.score, data.rank);
    }
  };

  const getUserLeaderboardData = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(gameType);
    if (data) {
      const indexedDistrictRankData = data.map((item: any, index: number) => ({
        rank: index + 1,
        ...item,
      }));
      setUserLeaderboardData(indexedDistrictRankData);
    }
  }, [gameType, minigameApi]);
  const getDistrictLeaderboardData = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(gameType);
    if (data) {
      const indexedDistrictRankData = data.map((item: any, index: number) => ({
        rank: index + 1,
        ...item,
      }));
      setDistrictLeaderboardData(indexedDistrictRankData);
    }
  }, [gameType, minigameApi]);
  // Throttle refresh for 5 seconds
  const handleRefresh = () => {
    updateMyGameData();
    getMyBestScoreEver();
    getUserLeaderboardData();
    getDistrictLeaderboardData();
  };
  const throttledRefresh = useThrottledCallback(handleRefresh, 3000);
  // =================================================================

  useEffect(() => {
    if (isTop) {
      handleRefresh();
      // getLastWeekTopTownie();
      // getLastWeekTopDistrict();
    }
    if (rank !== 0) {
      setIsRanked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTop]);

  const [shouldSticky, setShouldSticky] = useState(false);

  const onScroll = (e: any) => {
    const offsetY = e.target.scrollTop;
    const limit = 205;
    if (limit < offsetY) {
      setShouldSticky(true);
      // disable();
    } else {
      setShouldSticky(false);
      // enable();
    }
  };
  // background: `linear-gradient(180deg, #e3efff ${rem(180)}, #fff 0)`,

  return (
    <>
      <Nav
        appendLeft={<BackIcon />}
        onClickLeft={goToPlatformPage}
        style={{ backgroundColor: 'transparent' }}
      />

      <PageContainer id="home-page__2048-puzzle" onScroll={onScroll}>
        <Top className="top">
          <Banner className="banner">
            <BannerImage />
          </Banner>
          <Container className="last-week-winner">
            {/* <LastWeekTopDistrict
                  townName1={lastWeekTopDistrict.townName1}
                  townName2={lastWeekTopDistrict.townName2}
                  score={lastWeekTopDistrict.score}
                />
                <LastWeekTopTownie
                  name={lastWeekTopTownie.name}
                  score={lastWeekTopTownie.score}
                /> */}
            <VeryFirstWeekDistrict />
            <VeryFirstWeekTownie />
          </Container>
        </Top>
        <Bottom className="bottom">
          <WeeklyCountdown className="weekly-countdown-refresh">
            <Refresh handleRefresh={throttledRefresh} />
          </WeeklyCountdown>
          <Container>{isRanked ? <MyInfo /> : null}</Container>
          <LeaderboardTabs
            districtLeaderboardData={districtLeaderboardData}
            userLeaderboardData={userLeaderboardData}
            shouldSticky={shouldSticky}
          />
        </Bottom>
        <ActionItem>
          <div
            style={{
              position: 'absolute',
              bottom: '90px',
              right: '24px',
              zIndex: 101,
            }}
          >
            <ActiveUserCount gameType="GAME_2048" />
          </div>
          <Button
            size={`large`}
            fontSize={rem(20)}
            color={`primary`}
            onClick={handleGameStart}
          >
            게임 시작
          </Button>
        </ActionItem>
      </PageContainer>
    </>
  );
};

const Top = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #e3efff 180px, #fff 0);
  position: relative;
  top: -${navHeight};
  // margin-bottom: 25px;
  padding-top: ${navHeight};
`;

const Bottom = styled.div`
  flex: 1;
  background: #fff;
  position: sticky;
  top: ${navHeight};
  // left: 0;
  height: calc(${pageHeight} - 90px);
`;

const Banner = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-flow: row;
  gap: 12px;
  padding: 0 20px;
`;
const ActionItem = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  padding: 15px 18px 30px;

  display: flex;
  justify-content: center;

  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const WeeklyCountdown = styled.div`
  height: 35px;
  font-style: normal;
  font-weight: normal;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding: 0 20px 15px;
`;
