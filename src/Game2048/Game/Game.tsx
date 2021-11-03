import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React, { useCallback, useEffect } from 'react';
import { Board } from './Board';
import { useGame } from './hooks/useGame';

export const Game = () => {
  const { push, pop } = useNavigator();

  const { tileArray, moveRight } = useGame();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // disables page scrolling with keyboard arrows
      e.preventDefault();

      switch (e.code) {
        case 'ArrowRight':
          moveRight();
          break;
        // case 'ArrowLeft':
        //   moveLeft();
        //   break;

        // case 'ArrowUp':
        //   moveUp();
        //   break;
        // case 'ArrowDown':
        //   moveDown();
        //   break;
      }
      console.log(tileArray);
    },
    [tileArray, moveRight]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const goToLeaderboardPage = () => {
    push(`/game-2048/leaderboard`);
  };

  const goBackToHomePage = () => {
    pop();
  };
  return (
    <div>
      <ScreenHelmet />
      <Board tiles={tileArray} />
      <button onClick={goToLeaderboardPage}>to leaderboard</button>
      <button onClick={goBackToHomePage}>back to home</button>
    </div>
  );
};
