import styled from '@emotion/styled';
import { useNavigator } from '@karrotframe/navigator';
import { Button } from 'components/Button';
import { useState } from 'react';
import ReactModal from 'react-modal';
import { Board } from './Game/Board';
import { useGame } from './Game/hooks';
import { PostComment } from './Modal';
import { CurrentScore, MyHighScore, TownieHighScore } from './Score';

export const Game = () => {
  const { push, pop } = useNavigator();
  const { resetGame } = useGame();
  const [isUserTopTen, setIsUserTopTen] = useState<boolean>(false);

  const goToLeaderboardPage = () => {
    push(`/game-2048/leaderboard`);
  };
  const goToHomePage = () => {
    pop();
  };

  const handlePlayAgain = () => {
    // reset the game
    resetGame();
  };
  const handleEndGame = () => {
    // open game-end modalStyle
    // if () {
    //   setIsUserTopTen(true)
    // }
    // goToLeaderboardPage()
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
        isOpen={isUserTopTen}
        // onRequestClose={() => setIsGameOver(false)}
        shouldCloseOnOverlayClick={false}
        contentLabel="Game Over"
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
            zIndex: 100,
          },
        }}
      >
        <PostComment />
      </ReactModal>
    </Page>
  );
};

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
