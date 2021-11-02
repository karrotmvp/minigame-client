import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React from 'react';

export const Leaderboard = () => {
  const { pop } = useNavigator();

  const goBackToGamePage = () => {
    pop();
  };
  return (
    <div>
      <ScreenHelmet />
      <button onClick={goBackToGamePage}>back to game page</button>
    </div>
  );
};
