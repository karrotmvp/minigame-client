import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { MemoizedLeaderboardTabs as LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
import { rem } from 'polished';
import { Button } from 'components/Button';
import { useCallback, useEffect, useState } from 'react';
import { Nav } from 'components/Navigation/Nav';
// import { BackIcon } from 'assets/icon';
import { ReactComponent as IconArrowBack } from 'assets/icon/svg/icon_arrow_back.svg';
import { MemoizedRefresh as Refresh } from '../Leaderboard/Refresh';
import { MemoizedMyInfo as MyInfo, NotLoggedIn } from '../Leaderboard/MyInfo';
import { useMinigameApi } from 'services/api/minigameApi';
import { ActiveUserCount } from 'components/ActiveUserCount';
import { useAccessToken } from 'hooks/useAccessToken';
import { useMyGame2048Data } from '../hooks';
import { useLeaderboard, useMini, useMyGameData } from 'hooks';
import { useThrottledCallback } from 'use-debounce/lib';
import { useAnalytics } from 'services/analytics';
import { navHeight, PageContainer, pageHeight } from 'styles';

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
  const { townLeaderboard, userLeaderboard, updateLeaderboard } =
    useLeaderboard();
  const { updateMyGameData } = useMyGameData();
  const [isRanked, setIsRanked] = useState<boolean>(false);
  const [myTownRank, setMyTownRank] = useState<number | undefined>(undefined);

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

  // refresh button handler
  // const updateMyGameData = useCallback(async () => {
  //   const {
  //     data: { data },
  //   } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
  //   if (data) {
  //     if (data.score && data.rank) {
  //       updateMyScore({
  //         score: data.score,
  //         rank: data.rank,
  //       });
  //       if (data.comment) {
  //         updateMyComment(data.comment);
  //       }
  //       return 'success';
  //     }
  //   }
  //   return 'fail';
  // },[]);
  // const getMyBestScoreEver = async () => {
  //   const {
  //     data: { data },
  //   } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType, 'BEST');
  //   if (data) {
  //     updateMyHighestScore(data.score, data.rank);
  //   }
  // };

  const handleRefresh = useCallback(async () => {
    const response = await updateMyGameData({ gameType: gameType });
    if (response === 'success') {
      updateLeaderboard({ gameType: 'GAME_2048', size: 1000 });
    }
  }, [gameType, updateLeaderboard, updateMyGameData]);

  useEffect(() => {}, []);
  // Throttle refresh for 5 seconds
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
            appendLeft={<IconArrowBack />}
            onClickLeft={goToPlatformPage}
            appendCenter={
              <>
                <p
                  style={{
                    fontWeight: `bold`,
                    fontSize: `${rem(16)}`,
                    color: '#FFFFFF',
                    marginBottom: `4px`,
                  }}
                >
                  이번주 랭킹
                </p>
                <Refresh handleRefresh={throttledRefresh} />
              </>
            }
            appendRight={<button>초대하기</button>}
            style={{ backgroundColor: 'transparent' }}
          />
          <Top className="top">
            <div className="top__my-info">
              {isRanked ? (
                <MyInfo myTownRank={myTownRank as number} />
              ) : (
                <NotLoggedIn myTownRank={myTownRank as number} />
              )}
            </div>
          </Top>
          <Bottom className="bottom">
            <LeaderboardTabs
              districtLeaderboardData={townLeaderboard}
              userLeaderboardData={userLeaderboard}
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
  background: linear-gradient(180deg, #82b6ff 180px, #fff 0);
  position: relative;
  top: -${navHeight};
  padding-top: ${navHeight};

  div.top__my-info {
    padding: 20px 20px 0;
  }
`;

const Bottom = styled.div`
  flex: 1;
  background: #fff;
  position: sticky;
  height: calc(${pageHeight} - 90px);
  top: ${navHeight};
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
