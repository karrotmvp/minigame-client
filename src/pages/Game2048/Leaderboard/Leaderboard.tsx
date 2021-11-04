import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React from 'react';
import { LeaderboardTabs } from './LeaderboardTabs';
import { RefreshCountdown } from '../../../components/RefreshCountdown';

export const Leaderboard = () => {
  const { pop } = useNavigator();

  const goBackToGamePage = () => {
    pop();
  };
  return (
    <div>
      <ScreenHelmet />
      <RefreshCountdown />
      {/* <LeaderboardTabs /> */}
      <button onClick={goBackToGamePage}>back to game page</button>
    </div>
  );
};
