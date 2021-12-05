import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { MemoizedLeaderboardTabs as LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
import {
  MemoizedLastWeekTopDistrict as LastWeekTopDistrict,
  MemoizedLastWeekTopTownie as LastWeekTopTownie,
} from './LastWeekWinner';
// import {
//   VeryFirstWeekDistrict,
//   VeryFirstWeekTownie,
// } from './LastWeekWinner/VeryFirstWeek';
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
import { lastWeek } from 'utils/date';

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
  const addPlayerCount = async () => {
    try {
      const data = await minigameApi.gamePlayApi.playGameUsingPOST(gameType);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleReturningUser = () => {
    // if access token exists, user is not new
    analytics.logEvent('click_game_start_button', {
      game_type: '2048_puzzle',
      is_new_user: false,
    });
  };
  const onNewUserSuccessHandler = () => {
    // console.log('5');
    analytics.logEvent('click_third_party_agreement_button', {
      game_type: '2048_puzzle',
      button_type: 'game_start_button',
    });
    // console.log('6');
    addPlayerCount();
    // console.log('7');
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
  const [lastWeekTopTownie, setLastWeekTopTownie] = useState<{
    name: string;
    score: number;
  }>({ name: '', score: 0 });

  const getLastWeekTopTownie = useCallback(
    async ({
      gameType,
      year,
      month,
      week,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      year: number;
      month: number;
      week: number;
    }) => {
      try {
        const {
          data: { data },
        } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
          gameType,
          month,
          1,
          week,
          year
        );
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    [minigameApi.gameUserApi]
  );
  const displayLastWeekTopTownie = useCallback(async () => {
    const response = await getLastWeekTopTownie({
      gameType: gameType,
      year: lastWeek.year,
      month: lastWeek.month,
      week: lastWeek.week,
    });
    if (response !== undefined) {
      setLastWeekTopTownie({
        name: response[0].nickname,
        score: response[0].score,
      });
    }
  }, [gameType, getLastWeekTopTownie]);

  const [lastWeekTopDistrict, setLastWeekTopDistrict] = useState<{
    townName1: string;
    townName2: string;
    score: number;
  }>({ townName1: '', townName2: '', score: 0 });
  const getLastWeekTopDistrict = useCallback(
    async ({
      gameType,
      year,
      month,
      week,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      year: number;
      month: number;
      week: number;
    }) => {
      try {
        const {
          data: { data },
        } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(
          gameType,
          month,
          1,
          week,
          year
        );
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    [minigameApi.gameTownApi]
  );
  const displayLastWeekTopDistrict = useCallback(async () => {
    const response = await getLastWeekTopDistrict({
      gameType: gameType,
      year: lastWeek.year,
      month: lastWeek.month,
      week: lastWeek.week,
    });
    if (response !== undefined) {
      setLastWeekTopDistrict({
        townName1: response[0].name1.replace(
          /(특별시|광역시|특별자치시|특별자치도)$/,
          ''
        ),
        townName2: response[0].name2,
        score: response[0].score,
      });
    }
  }, [gameType, getLastWeekTopDistrict]);

  useEffect(() => {
    displayLastWeekTopTownie();
    displayLastWeekTopDistrict();
  }, [displayLastWeekTopDistrict, displayLastWeekTopTownie]);

  // refresh button handler
  // =================================================================
  const updateMyGameData = async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
    if (data) {
      if (data.score && data.rank) {
        updateMyScore({
          score: data.score,
          rank: data.rank,
        });
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
    } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
      gameType,
      undefined,
      1000
    );
    if (data) {
      const indexedUserRankData = data.map((item: any, index: number) => ({
        ...item,
        rank: index + 1,
        town: {
          ...item.town,
          name1: item.town.name1.replace(
            /(특별시|광역시|특별자치시|특별자치도)$/,
            ''
          ),
        },
      }));
      setUserLeaderboardData(indexedUserRankData);
    }
  }, [gameType, minigameApi]);
  const getDistrictLeaderboardData = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(gameType);
    if (data) {
      const indexedDistrictRankData = data.map((item: any, index: number) => ({
        ...item,
        rank: index + 1,
        name1: item.name1.replace(/(특별시|광역시|특별자치시|특별자치도)$/, ''),
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
    }
    if (rank !== 0) {
      setIsRanked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTop]);

  // const [shouldSticky, setShouldSticky] = useState(false);

  const onScroll = (e: any) => {
    const offsetY = e.target.scrollTop;
    const limit = 205;
    if (limit < offsetY) {
      // setShouldSticky(true);
      // disable();
    } else {
      // setShouldSticky(false);
      // enable();
    }
  };

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_home_page', {
        game_type: '2048_puzzle',
      });
    }
  }, [analytics, isTop]);

  return (
    <div style={{ display: `flex`, flexFlow: `column` }}>
      <div
        style={{
          height: `calc(100vh - 90px)`,
          overflow: `hidden`,
          overscrollBehavior: `contain`,
        }}
      >
        <PageContainer
          id="home-page__2048-puzzle"
          onScroll={onScroll}
          style={{
            height: `100%`,
            overflow: `auto`,
          }}
        >
          <Nav
            appendLeft={<BackIcon />}
            onClickLeft={goToPlatformPage}
            style={{ backgroundColor: 'transparent' }}
          />
          <Top className="top">
            <Banner className="banner">
              <BannerImage />
            </Banner>
            <Container className="last-week-winner">
              <LastWeekTopDistrict
                townName1={lastWeekTopDistrict.townName1}
                townName2={lastWeekTopDistrict.townName2}
                score={lastWeekTopDistrict.score}
              />
              <LastWeekTopTownie
                name={lastWeekTopTownie.name}
                score={lastWeekTopTownie.score}
              />
              {/* <VeryFirstWeekDistrict /> */}
              {/* <VeryFirstWeekTownie /> */}
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
              isRanked={isRanked}
            />
          </Bottom>
        </PageContainer>
      </div>
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
    </div>
  );
};

const Top = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #e3efff 180px, #fff 0);
  position: relative;
  top: -${navHeight};
  padding-top: ${navHeight};
`;

const Bottom = styled.div`
  flex: 1;
  background: #fff;
  position: sticky;
  height: calc(${pageHeight} - 90px);
  top: ${navHeight};
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
