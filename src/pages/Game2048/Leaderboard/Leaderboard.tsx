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
import { useMini } from 'hooks';
import { Refresh } from './Refresh';
import { useThrottledCallback } from 'use-debounce/lib';

export const Leaderboard = () => {
  const { isTop } = useCurrentScreen();
  const { pop } = useNavigator();
  const minigameApi = useMinigameApi();
  const { ejectApp, shareApp } = useMini();
  const { rank, gameType, updateMyGame2048Data } = useMyGame2048Data();
  const [isRanked, setIsRanked] = useState<boolean>(false);
  const [userLeaderboardData, setUserLeaderboardData] = useState<any[]>([]);
  const [districtLeaderboardData, setDistrictLeaderboardData] = useState<any[]>(
    []
  );

  const exitApp = () => {
    console.log('Ejected from the app. Now back to Karrot Market');
    ejectApp();
  };
  const goToGamePage = () => {
    // push(`/game-2048/game`);
    pop();
  };

  const handlePlayAgain = () => {
    goToGamePage();
  };
  const updateMyGameData = async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
    if (data && data.score && data.rank && data.comment) {
      updateMyGame2048Data(data.score, data.rank!, data.comment);
    }
  };

  const handleShare = () => {
    const url = 'https://daangn.onelink.me/HhUa/3a219555';
    const text = '2048 퍼즐을 플레이 하고 이웃들에게 한 마디를 남겨보세요!';
    shareApp(url, text);
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
  const handleRefresh = useThrottledCallback(() => {
    updateMyGameData();
    getUserLeaderboardData();
    getDistrictLeaderboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, 5000);

  useEffect(() => {
    if (isTop) {
      handleRefresh();
    }
    if (rank !== 0) {
      setIsRanked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTop]);
  return (
    <Page>
      <Nav appendLeft={<CloseIcon />} onClickLeft={exitApp} />

      <Refresh handleRefresh={handleRefresh} />
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
          onClick={handleShare}
        >
          자랑하기
        </Button>
        <Button
          size={`large`}
          fontSize={rem(20)}
          color={`primary`}
          onClick={handlePlayAgain}
        >
          다시하기
        </Button>
      </ActionItems>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background: linear-gradient(180deg, #e3efff ${rem(180)}, #fff 0); ;
`;

const Container = styled.div`
  display: flex;
  flex-flow: row;
  gap: ${rem(12)};
  padding: 0 ${rem(20)};
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
