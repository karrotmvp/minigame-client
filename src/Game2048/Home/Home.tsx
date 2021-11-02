import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React from 'react';

export const Home = () => {
  const { push } = useNavigator();

  const goToGamePage = () => {
    push(`/game-2048/game`);
  };
  return (
    <div>
      <ScreenHelmet />
      <button onClick={goToGamePage}>to game</button>
    </div>
  );
};
