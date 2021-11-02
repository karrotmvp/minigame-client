import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React from 'react';
import { Board } from './Board/Board';

export const Game = () => {
  const { push, pop } = useNavigator();

  const goToLeaderboardPage = () => {
    push(`/game-2048/leaderboard`);
  };

  const goBackToHomePage = () => {
    pop();
  };
  return (
    <div>
      <ScreenHelmet />
      <Board />
      <button onClick={goToLeaderboardPage}>to leaderboard</button>
      <button onClick={goBackToHomePage}>back to home</button>
    </div>
  );
};
