import styled from '@emotion/styled';
import {
  ScreenHelmet,
  useCurrentScreen,
  useNavigator,
} from '@karrotframe/navigator';
import { LeaderboardTabs } from 'pages/Game2048/Leaderboard/LeaderboardTabs';
import { WeeklyCountdown } from 'components/Timer';
import { LastWeekTopDistrict, LastWeekTopTownie } from './LastWeekWinner';
import { rem } from 'polished';
import { Button } from 'components/Button';
import { useEffect, useState } from 'react';
import topBanner from 'assets/svg/game2048/home_top_banner.svg';
import { Nav } from 'components/Navigation/Nav';
import { BackIcon } from 'assets/Icon';
import { ReactComponent as BannerImage } from 'assets/svg/game2048/home_top_banner.svg';
import { Refresh } from './Refresh';
import { MyInfo } from './MyInfo';
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

export const Home = () => {
  const { push, pop } = useNavigator();
  const [isRanked, setIsRanked] = useState<boolean>(false);

  // const { isTop } = useCurrentScreen();
  const goToMainPage = () => {
    pop();
  };
  const goToGamePage = () => {
    push(`/game-2048/game`);
  };

  const handleGameStart = () => {
    goToGamePage();
  };
  const getLastWeekTopTownie = () => {};

  const getLastWeekTopDistrict = () => {};

  const handleRefresh = () => {};

  const getMyInfo = () => {};

  // useEffect(() => {
  //   if (isTop) {
  //     console.log('isTop');
  //   }
  // });
  useEffect(() => {
    setIsRanked(true);
  }, []);
  return (
    <Page>
      {/* <ScreenHelmet /> */}
      <Nav appendLeft={<BackIcon />} onClickLeft={goToMainPage} />
      <Banner className="banner">
        <BannerImage />
      </Banner>
      <Container className="last-week-winner">
        <LastWeekTopDistrict getLastWeekTopDistrict={getLastWeekTopDistrict} />
        <LastWeekTopTownie getLastWeekTopTownie={getLastWeekTopTownie} />
      </Container>

      <Refresh handleRefresh={handleRefresh} />
      <Container>
        {isRanked ? (
          <MyInfo
            rank={234}
            name={`username`}
            district={`district name`}
            score={12123}
            highestRank={1}
            highestScore={12323894}
          />
        ) : null}
      </Container>
      <LeaderboardTabs />

      <ActionItems>
        <Button size={`large`} color={`primary`} onClick={handleGameStart}>
          게임 시작
        </Button>
      </ActionItems>
    </Page>
  );
};
