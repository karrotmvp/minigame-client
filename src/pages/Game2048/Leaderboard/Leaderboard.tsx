import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React from 'react';
import { LeaderboardTabs } from './LeaderboardTabs';
import { WeeklyCountdown } from '../../../components/Timer';

export const Leaderboard = () => {
  const { pop } = useNavigator();

  const goToGamePage = () => {
    pop();
  };
  return (
    <div>
      <ScreenHelmet />
      <WeeklyCountdown />
      {/* <LeaderboardTabs /> */}
      <button onClick={goToGamePage}>back to game page</button>
    </div>
  );
};
