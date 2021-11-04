import styled from '@emotion/styled';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { useThrottledCallback } from 'use-debounce/lib';
import { Board } from './Board';
import { useGame } from './hooks/useGame';
import { CurrentScore, MyHighScore, TownieHighScore } from './Score';
import { animationDuration } from './styles';

const Page = styled.div`
  height: 100%;
  background-color: #f3f8ff;
`;

const HighScoreContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  padding-top: 3.438rem;
`;

export const Game = () => {
  // const { score } = useSelector((state: RootState) => ({
  //   score: state.game2048Reducer.score,
  // }));
  const { push, pop } = useNavigator();

  const { tileList, moveRight, moveLeft, moveUp, moveDown } = useGame();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // disables page scrolling with keyboard arrows
      e.preventDefault();

      switch (e.code) {
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
      }
      console.log('GameSection', tileList);
    },
    [tileList, moveRight, moveLeft, moveUp, moveDown]
  );

  // protects the reducer from being flooded with events.
  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    window.addEventListener('keydown', throttledHandleKeyDown);

    return () => {
      window.removeEventListener('keydown', throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);

  const goToLeaderboardPage = () => {
    push(`/game-2048/leaderboard`);
  };

  const goBackToHomePage = () => {
    pop();
  };
  return (
    <Page>
      {/* <ScreenHelmet /> */}
      <HighScoreContainer>
        <MyHighScore />
        <TownieHighScore />
      </HighScoreContainer>
      <CurrentScore />
      <Board tiles={tileList} />
      <button onClick={goToLeaderboardPage}>to leaderboard</button>
      <button onClick={goBackToHomePage}>back to home</button>
    </Page>
  );
};
