import styled from '@emotion/styled';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import { Button, OldButton } from 'components/Button';
import React, { useCallback, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
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

const ActionItems = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin: 0 1.25rem;
`;

export const Game = () => {
  // const { score } = useSelector((state: RootState) => ({
  //   score: state.game2048Reducer.score,
  // }));
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const { push, pop } = useNavigator();
  const goToLeaderboardPage = () => {
    push(`/game-2048/leaderboard`);
  };
  const goBackToHomePage = () => {
    pop();
  };

  const handlePlayAgain = () => {
    // reset the game
  };
  const handleEndGame = () => {
    // open game-end modalStyle
  };
  return (
    <Page className="game-page">
      {/* <ScreenHelmet /> */}
      <HighScoreContainer>
        <MyHighScore />
        <TownieHighScore />
      </HighScoreContainer>
      <CurrentScore />
      <Board />
      <ActionItems>
        <Button size={`tiny`} color={`secondary`} onClick={handleEndGame}>
          그만하기
        </Button>
        <Button size={`tiny`} color={`secondary`} onClick={handlePlayAgain}>
          다시하기
        </Button>
      </ActionItems>

      <ReactModal
        isOpen={isGameOver}
        // onRequestClose={() => setIsGameOver(false)}
        shouldCloseOnOverlayClick={false}
        contentLabel="Game Over"
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
            zIndex: 100,
          },
        }}
      ></ReactModal>
    </Page>
  );
};
