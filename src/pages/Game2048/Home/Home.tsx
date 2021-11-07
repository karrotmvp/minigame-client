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
import { Refresh } from './Refresh';
import { MyInfo } from './MyInfo';
import { useMinigameApi } from 'services/api/minigameApi';
import { ActiveUserCount } from 'components/ActiveUserCount';
import { TownRankResponseDto } from 'services/openapi_generator';
import { useAccessToken } from 'hooks/useAccessToken';
import { useGame2048Data } from '../hooks';
import { useKarrotMarketMini } from 'hooks';

export const Home = () => {
  const { isTop } = useCurrentScreen();
  const { push, pop } = useNavigator();
  const minigameApi = useMinigameApi();
  const { accessToken } = useAccessToken();
  const { isInWebEnvironment, handleThirdPartyAgreement } =
    useKarrotMarketMini();
  const { rank, gameType, updateGame2048Data } = useGame2048Data();
  const [isRanked, setIsRanked] = useState<boolean>(false);
  const [userLeaderboardData, setUserLeaderboardData] = useState<any[]>([]);
  const [districtLeaderboardData, setDistrictLeaderboardData] = useState<any[]>(
    []
  );

  const goToMainPage = () => {
    pop();
  };
  const goToGamePage = () => {
    push(`/game-2048/game`);
  };

  const handleGameStart = () => {
    // bypass in web environment
    if (isInWebEnvironment) {
      console.log('bypass in web environment: home-page to game-page');
      goToGamePage();
    } else {
      if (accessToken) {
        goToGamePage();
      } else {
        handleThirdPartyAgreement();
        goToGamePage();
      }
    }
  };
  const getLastWeekTopTownie = () => {};

  const getLastWeekTopDistrict = () => {};

  const updateMyGameData = async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi().getMyRankInfoUsingGET(gameType);
    if (data) {
      updateGame2048Data(data.score, data.rank!, data.comment);
    }
  };

  const getUserLeaderboardData = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi().getLeaderBoardByUserUsingGET(gameType);
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
    } = await minigameApi.gameTownApi().getLeaderBoardByTownUsingGET(gameType);
    if (data) {
      const indexedDistrictRankData = data.map(
        (item: TownRankResponseDto, index: number) => ({
          rank: index + 1,
          ...item,
        })
      );
      setDistrictLeaderboardData(indexedDistrictRankData);
    }
  }, [gameType, minigameApi]);

  const handleRefresh = () => {
    updateMyGameData();
    getUserLeaderboardData();
    getDistrictLeaderboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

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
      <Nav appendLeft={<BackIcon />} onClickLeft={goToMainPage} />
      <Banner className="banner">
        <BannerImage />
      </Banner>
      <Container className="last-week-winner">
        <LastWeekTopDistrict getLastWeekTopDistrict={getLastWeekTopDistrict} />
        <LastWeekTopTownie getLastWeekTopTownie={getLastWeekTopTownie} />
      </Container>
      <Refresh handleRefresh={handleRefresh} />
      <Container>{isRanked ? <MyInfo /> : null}</Container>
      <LeaderboardTabs
        districtLeaderboardData={districtLeaderboardData}
        userLeaderboardData={userLeaderboardData}
      />
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
      <ActionItems>
        <Button size={`large`} color={`primary`} onClick={handleGameStart}>
          게임 시작
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
  padding: ${rem(16)} ${rem(24)} ${rem(34)};
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;
