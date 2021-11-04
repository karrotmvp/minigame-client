import styled from '@emotion/styled';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import { LeaderboardTabs } from 'Game2048/Leaderboard/LeaderboardTabs';
import { RefreshCountdown } from 'Game2048/Leaderboard/RefreshCountdown';
import { LastWeekTopDistrict, LastWeekTopTownie } from './LastWeekWinner';

const Page = styled.div`
  height: 100%;
  background-color: yellow;
`;

const LastWeekWinnerContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
`;

export const Home = () => {
  const { push } = useNavigator();

  const goToGamePage = () => {
    push(`/game-2048/game`);
  };
  return (
    <Page>
      <ScreenHelmet />
      <LastWeekWinnerContainer>
        <LastWeekTopDistrict />
        <LastWeekTopTownie />
      </LastWeekWinnerContainer>
      <RefreshCountdown />
      {/* <LeaderboardTabs /> */}

      <button onClick={goToGamePage}>to game</button>
    </Page>
  );
};
