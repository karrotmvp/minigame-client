import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
import { rem } from 'polished';
import { Button } from 'components/Button';
import { useCallback, useEffect, useState } from 'react';
import { Nav, navHeight } from 'components/Navigation/Nav';
import { CloseIcon } from 'assets/Icon';
import { MyInfo } from './MyInfo';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from '../hooks';
import { useMini, useUserData } from 'hooks';
import { Refresh } from './Refresh';
import { useThrottledCallback } from 'use-debounce/lib';
import { useAnalytics } from 'services/analytics';
import { NotificationRequestDtoTypeEnum } from 'services/openapi_generator';
import {
  SubscribeToastContainer,
  subscribeToastEmitter,
} from 'components/Toast';

export const Leaderboard = () => {
  const { isTop } = useCurrentScreen();
  const { replace, push } = useNavigator();
  const minigameApi = useMinigameApi();
  const analytics = useAnalytics();
  const { shareApp, handleInstallation } = useMini();
  const { nickname, isInstalled, setIsInstalled } = useUserData();

  const {
    rank,
    gameType,
    updateMyScore,
    updateMyComment,
    updateMyHighestScore,
  } = useMyGame2048Data();
  const [isRanked, setIsRanked] = useState<boolean>(true);
  const [userLeaderboardData, setUserLeaderboardData] = useState<any[]>([]);
  const [districtLeaderboardData, setDistrictLeaderboardData] = useState<any[]>(
    []
  );

  // page navigation
  const goBackToPlatform = () => {
    analytics.logEvent('click_leave_game_button', {
      game_type: '2048_puzzle',
      location: 'leaderboard_page',
    });
    push(`/`);
  };
  const goToGamePage = () => {
    replace(`/game-2048/game`);
  };

  const handlePlayAgain = () => {
    analytics.logEvent('click_game_play_again_button', {
      game_type: '2048_puzzle',
    });
    // resetGame();

    goToGamePage();
  };
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

  const getUserLeaderboardData = async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(gameType);
    if (data) {
      const indexedUserRankData = data.map((item: any, index: number) => ({
        rank: index + 1,
        ...item,
      }));
      setUserLeaderboardData(() => indexedUserRankData);
    }
  };

  const getDistrictLeaderboardData = async () => {
    const {
      data: { data },
    } = await minigameApi.gameTownApi.getLeaderBoardByTownUsingGET(gameType);
    if (data) {
      const indexedDistrictRankData = data.map((item: any, index: number) => ({
        rank: index + 1,
        ...item,
      }));

      setDistrictLeaderboardData(() => indexedDistrictRankData);
    }
  };

  // Throttle refresh for 5 seconds
  const handleRefresh = () => {
    updateMyGameData();
    getMyBestScoreEver();
    getUserLeaderboardData();
    getDistrictLeaderboardData();
  };
  const throttledRefresh = useThrottledCallback(handleRefresh, 3000);

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_leaderboard_page', {
        game_type: '2048_puzzle',
      });
      handleRefresh();
    }
    if (rank !== 0) {
      setIsRanked(() => true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, isTop, rank]);

  const handleShare = () => {
    analytics.logEvent('click_share_button', {
      game_type: '2048_puzzle',
      location: 'leaderboard_page',
    });
    const url = 'https://daangn.onelink.me/HhUa/54499335';
    const text = `${nickname}님은 2048 퍼즐에서 전국 ${rank}등!`;
    shareApp(url, text);
  };

  // show subscribe preset non-subscribed user with notificaiton not turned off
  const isSubscribeNotificationOff = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.notificationApi.checkNotificationUsingGET(
      'SUBSCRIBE_OFF'
    );
    if (data) {
      return data.check;
    }
  }, [minigameApi.notificationApi]);
  const onSubscribeSuccess = useCallback(() => {
    analytics.logEvent('click_subscribe_button', {
      game_type: '2048_puzzle',
      location: 'leaderboard_page',
      is_voluntary: false,
    });
    setIsInstalled(true);
    subscribeToastEmitter();
  }, [analytics, setIsInstalled]);

  const turnOffSubscribeNotification = useCallback(async () => {
    await minigameApi.notificationApi.saveNotificationUsingPOST({
      type: 'SUBSCRIBE_OFF' as NotificationRequestDtoTypeEnum,
    });
  }, [minigameApi.notificationApi]);
  useEffect(() => {
    const showSubscribe = async () => {
      if (isInstalled === false) {
        const response = await isSubscribeNotificationOff();
        if (response !== undefined && response === false) {
          analytics.logEvent('show_subscribe_button', {
            game_type: '2048_puzzle',
            location: 'leaderboard_page',
            is_voluntary: false,
          });
          handleInstallation(onSubscribeSuccess, turnOffSubscribeNotification);
        }
      }
    };
    showSubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="game-2048-leaderboard-page"
      style={{ display: `flex`, flexDirection: 'column' }}
    >
      <Nav appendLeft={<CloseIcon />} onClickLeft={goBackToPlatform} />
      <Main>
        <WeeklyCountdown className="weekly-countdown-refresh">
          <Refresh handleRefresh={throttledRefresh} />
        </WeeklyCountdown>

        <Container>{isRanked ? <MyInfo /> : null}</Container>
        <LeaderboardTabs
          districtLeaderboardData={districtLeaderboardData}
          userLeaderboardData={userLeaderboardData}
        />
      </Main>
      <ActionItems>
        <Button
          size={`large`}
          fontSize={rem(18)}
          color={`secondary1`}
          onClick={handlePlayAgain}
        >
          다시하기
        </Button>
        <Button
          size={`large`}
          fontSize={rem(18)}
          color={`primary`}
          onClick={handleShare}
        >
          자랑하기
        </Button>
      </ActionItems>
      <SubscribeToastContainer />
    </div>
  );
};

const Main = styled.div`
  display: flex;
  flex-flow: column;
  height: calc(100vh - ${navHeight}px - 90px);
`;

const WeeklyCountdown = styled.div`
  font-style: normal;
  font-weight: normal;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding: 0 ${rem(20)} ${rem(15)};
`;
const Container = styled.div`
  display: flex;
  flex-flow: row;
  gap: ${rem(12)};
  padding: 0 ${rem(18)};
`;
const ActionItems = styled.div`
  display: flex;
  flex-flow: row;
  gap: 12px;
  justify-content: center;

  width: 100%;
  height: 90px;
  padding: 15px 18px 30px;

  border-top: 1px solid #ebebeb;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  box-sizing: border-box;

  z-index: 100;
`;
