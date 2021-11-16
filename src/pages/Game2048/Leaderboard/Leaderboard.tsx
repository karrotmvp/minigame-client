import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
import { rem } from 'polished';
import { Button } from 'components/Button';
import { useCallback, useEffect, useState } from 'react';
import { Nav } from 'components/Navigation/Nav';
import { CloseIcon } from 'assets/Icon';
import { MyInfo } from './MyInfo';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from '../hooks';
import { useMini, useUserData } from 'hooks';
import { Refresh } from './Refresh';
import { useThrottledCallback } from 'use-debounce/lib';
import { useAnalytics } from 'services/analytics';
import { useGame } from '../Game/Game/hooks';

export const Leaderboard = () => {
  const { isTop } = useCurrentScreen();
  const { replace, push } = useNavigator();
  const minigameApi = useMinigameApi();
  const analytics = useAnalytics();
  const { shareApp, handleInstallation } = useMini();
  const { isInstalled } = useUserData();
  const { resetGame } = useGame();
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
      game_type: 'game-2048',
      from: 'leaderboard_page',
    });
    push(`/`);
  };
  const goToGamePage = () => {
    replace(`/game-2048/game`);
  };

  const handlePlayAgain = () => {
    analytics.logEvent('click_game_play_again_button', {
      game_type: 'game-2048',
    });
    resetGame();

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
    console.log(isTop, 'isTop');
    if (isTop) {
      handleRefresh();
    }
    if (rank !== 0) {
      setIsRanked(() => true);
    }
  }, [isTop, rank]);

  const handleShare = () => {
    const url = 'https://daangn.onelink.me/HhUa/3a219555';
    const text = `2048 퍼즐을 플레이 하고 이웃들에게 한 마디를 남겨보세요!`;
    shareApp(url, text);
    analytics.logEvent('click_share_button', {
      game_type: 'game-2048',
    });
  };

  useEffect(() => {
    if (isInstalled === false) {
      handleInstallation();
    }
  }, []);
  return (
    <Page>
      <Nav appendLeft={<CloseIcon />} onClickLeft={goBackToPlatform} />
      <WeeklyCountdown className="weekly-countdown-refresh">
        <Refresh handleRefresh={throttledRefresh} />
      </WeeklyCountdown>

      <Container>{isRanked ? <MyInfo /> : null}</Container>
      <LeaderboardTabs
        districtLeaderboardData={districtLeaderboardData}
        userLeaderboardData={userLeaderboardData}
      />

      <ActionItems>
        <Button
          size={`large`}
          fontSize={rem(20)}
          color={`secondary1`}
          onClick={handlePlayAgain}
        >
          다시하기
        </Button>
        <Button
          size={`large`}
          fontSize={rem(20)}
          color={`primary`}
          onClick={handleShare}
        >
          초대하기
        </Button>
      </ActionItems>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
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
  padding: ${rem(15)} ${rem(18)} ${rem(30)};
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;
