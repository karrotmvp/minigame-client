import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
import { LastWeekTopDistrict, LastWeekTopTownie } from './LastWeekWinner';
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
import { lastWeek } from 'utils';

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

  const [lastWeekTopDistrict, setLastWeekTopDistrict] = useState<{
    name: string;
    score: number;
  }>({ name: '', score: 0 });
  const [lastWeekTopTownie, setLastWeekTopTownie] = useState<{
    name: string;
    score: number;
  }>({ name: '', score: 0 });
  const goToPlatformPage = () => {
    pop();
  };
  const goToGamePage = () => {
    // resetGame();
    push(`/game-2048/game`);
  };

  // game start button handler
  // =================================================================
  const handleReturningUser = () => {
    // if access token exists, user is not new
    analytics.logEvent('click_game_start_button', {
      game_type: 'game-2048',
      is_new_user: false,
    });
  };
  const handleNewUser = () => {
    // if user is new, open third-party agreement preset
    analytics.logEvent('click_game_start_button', {
      game_type: 'game-2048',
      is_new_user: true,
    });
    handleThirdPartyAgreement(goToGamePage);
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
      goToGamePage();
    } else {
      handleNewUser();
    }
  };
  // =================================================================

  // last week winner handler
  // =================================================================
  const getLastWeekTopTownie = async () => {
    try {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
        gameType,
        lastWeek.month,
        1,
        lastWeek.week,
        lastWeek.year
      );
      if (data) {
        console.log(data);
        setLastWeekTopTownie({ name: data[0].nickname, score: data[0].score });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getLastWeekTopDistrict = async () => {
    try {
      const {
        data: { data },
      } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(
        gameType,
        lastWeek.month,
        1,
        lastWeek.week,
        lastWeek.year
      );
      if (data) {
        console.log(data);

        setLastWeekTopDistrict({ name: data[0].name2, score: data[0].score });
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      getLastWeekTopTownie();
      getLastWeekTopDistrict();
    }
    if (rank !== 0) {
      setIsRanked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTop]);

  const [
    isScrollValueMoreThanHeaderHeight,
    setIsScrollValueMoreThanHeaderHeight,
  ] = useState(false);

  //here 96(px) - height of current header

  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
      setIsScrollValueMoreThanHeaderHeight(window.scrollY > 90);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Nav
        appendLeft={<BackIcon />}
        onClickLeft={goToPlatformPage}
        backgroundColor={`#e3efff`}
      />
      <Page>
        <TopHalf>
          <Banner className="banner">
            <BannerImage />
          </Banner>
          <Container className="last-week-winner">
            <LastWeekTopDistrict
              name={lastWeekTopDistrict.name}
              score={lastWeekTopDistrict.score}
            />
            <LastWeekTopTownie
              name={lastWeekTopTownie.name}
              score={lastWeekTopTownie.score}
            />
          </Container>
        </TopHalf>
        <BottomHalf
          className={isScrollValueMoreThanHeaderHeight ? 'class1' : 'class2'}
        >
          <WeeklyCountdown className="weekly-countdown-refresh">
            <Refresh handleRefresh={throttledRefresh} />
          </WeeklyCountdown>

          <Container>{isRanked ? <MyInfo /> : null}</Container>
          <LeaderboardTabs
            districtLeaderboardData={districtLeaderboardData}
            userLeaderboardData={userLeaderboardData}
          />
        </BottomHalf>
      </Page>

      <ActionItems>
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
      </ActionItems>
    </>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: calc(100% - ${rem(90)});
  overflow: auto;
`;
const TopHalf = styled.div`
  background: linear-gradient(180deg, #e3efff ${rem(180)}, #fff 0);
  margin-bottom: 25px;
`;

const BottomHalf = styled.div`
  &.class1 {
    position: fixed;
    top: ${rem(90)};
    width: 100%;
    overflow: hidden;
  }
  &.class2 {
  }
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
  gap: ${rem(12)};
  padding: 0 ${rem(20)};
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
  z-index: 100;

  position: fixed;
  bottom: 0;
  left: 0;
`;

const WeeklyCountdown = styled.div`
  font-style: normal;
  font-weight: normal;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding: 0 ${rem(20)} ${rem(15)};
`;
