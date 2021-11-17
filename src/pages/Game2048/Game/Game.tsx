import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { Button } from 'components/Button';
import { useMini } from 'hooks';
import { rem } from 'polished';
import { useCallback, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useSwipeable } from 'react-swipeable';
import { useMinigameApi } from 'services/api/minigameApi';
import { useThrottledCallback } from 'use-debounce/lib';
import { useMyGame2048Data } from '../hooks';
import { Board } from './Game/Board';
import { useGame } from './Game/hooks';
import { animationDuration } from './Game/styles';
import { PostComment } from './Modal';
import { CurrentScore, MyBestScore, TownieBestScore } from './Score';

export const Game: React.FC = () => {
  const { isTop } = useCurrentScreen();
  const { replace } = useNavigator();
  const minigameApi = useMinigameApi();
  const { isInWebEnvironment } = useMini();
  const {
    score: myBestScore,
    highestScore,
    gameType,
    updateMyScore,
    updateMyComment,
  } = useMyGame2048Data();
  const {
    score: currentScore,
    tileList,
    moveRight,
    moveLeft,
    moveUp,
    moveDown,
    resetGame,
    isGameOver,
  } = useGame();
  const [isUserNew, setIsUserNew] = useState<boolean>(false);
  const [isUserInTopTen, setIsUserInTopTen] = useState<boolean>(false);
  const [townieBestScore, setTownieBestScore] = useState<number>(0);
  const [myBestScoreDisplay, setMyBestScoreDisplay] =
    useState<number>(myBestScore);

  useEffect(() => {
    if (isGameOver) {
      console.log('GAME OVE');
    }
  });
  // game controller
  // =================================================================
  // mobile(touch) friendly
  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log('User Swiped!', eventData),
    onSwipedLeft: useThrottledCallback(moveLeft, animationDuration),
    onSwipedRight: useThrottledCallback(moveRight, animationDuration),
    onSwipedUp: useThrottledCallback(moveUp, animationDuration),
    onSwipedDown: useThrottledCallback(moveDown, animationDuration, {
      // leading: true,
      // trailing: false,
    }),
    preventDefaultTouchmoveEvent: true,
  });
  // desktop(keyboard) friendly
  const handleKeyDown = useThrottledCallback(
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
    },
    animationDuration,
    { leading: true, trailing: false }
  );
  // =================================================================
  useEffect(() => {
    console.log(highestScore);
    if (isTop) {
      // resetGame();
      if (highestScore === 0) {
        setIsUserNew(true);
        console.log('guide is on for new user');
      }
    }
  }, [highestScore, isTop]);

  // page navigation
  // =================================================================
  const goToLeaderboardPage = () => {
    replace(`/game-2048/leaderboard`);
  };
  const handlePlayAgain = () => {
    resetGame();

    console.log('handle play again');
  };

  const getTownieBestScoreEver = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
      gameType,
      undefined,
      1
    );
    if (data) {
      setTownieBestScore(data[0].score);
    }
  }, [gameType, minigameApi.gameUserApi]);

  //
  const updateMyBestScore = async (score: number) => {
    await minigameApi.gamePlayApi.updateScoreUsingPATCH(gameType, {
      score: score,
    });
  };
  const getMyData = async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);

    if (data) {
      if (data.comment) {
        updateMyComment(data.comment);
      }
      if (data.score && data.rank) {
        updateMyScore(data.score, data.rank);

        return data.rank;
      }
    }
  };

  // const [ isGameOver, setIsGameOver] = useState(KK)
  const handleGameOver = async () => {
    // resetGame();
    if (isInWebEnvironment) {
      console.log(`bypass in web environment: go from game to leaderboard`);
      goToLeaderboardPage();
      return;
    }
    // only patch score to db if current score is higher than the best score
    console.log(myBestScore, currentScore);
    if (currentScore > myBestScore) {
      await updateMyBestScore(currentScore);
      const newRank = await getMyData();
      console.log(newRank);
      if (newRank) {
        if (newRank > 0 && newRank <= 10) {
          setIsUserInTopTen(true);
        } else {
          goToLeaderboardPage();
        }
      }
    } else {
      const newRank = await getMyData();
      console.log(newRank);
      if (newRank) {
        if (newRank > 0 && newRank <= 10) {
          setIsUserInTopTen(true);
        } else {
          goToLeaderboardPage();
        }
      }
    }
  };
  useEffect(() => {
    if (currentScore > myBestScore) {
      updateMyBestScore(currentScore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScore]);

  // display current score as my best score if current score is greater than best score in db
  useEffect(() => {
    if (currentScore > myBestScore) {
      setMyBestScoreDisplay(currentScore);
    }
  }, [currentScore, myBestScore]);

  useEffect(() => {
    if (isTop) {
      getTownieBestScoreEver();
    }
  }, [getTownieBestScoreEver, isTop]);
  return (
    <>
      <Page className="game-page">
        <div style={{ flex: 1 }}>
          <HighScoreContainer>
            <MyBestScore myBestScore={myBestScoreDisplay} />
            <TownieBestScore townieBestScore={townieBestScore} />
          </HighScoreContainer>
          <CurrentScore score={currentScore} />
          <Board
            tileList={tileList}
            handlers={handlers}
            handleKeyDown={handleKeyDown}
            isUserNew={isUserNew}
            setIsUserNew={setIsUserNew}
          />
        </div>
        <ActionItems>
          <Button
            size={`tiny`}
            fontSize={rem(14)}
            color={`secondary2`}
            onClick={handleGameOver}
          >
            그만하기
          </Button>
          <Button
            size={`tiny`}
            fontSize={rem(14)}
            color={`secondary2`}
            onClick={handlePlayAgain}
          >
            다시하기
          </Button>
        </ActionItems>
      </Page>
      {/* <ReactModa isOpen={isGameOver}l>Game Over</ReactModal> */}
      <ReactModal
        isOpen={isUserInTopTen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Game Over"
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
            zIndex: 100,
          },
          content: {
            height: `fit-content`,
            width: `80%`,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: `21px`,
            padding: `24px 18px`,
            display: `flex`,
            flexFlow: `column`,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <PostComment setIsUserInTopTen={setIsUserInTopTen} />
      </ReactModal>
    </>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: #f3f8ff;
`;

const HighScoreContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  gap: 0.625rem;

  padding-top: 3.438rem;
  margin: 0 20px;
`;

const ActionItems = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin: 0 ${rem(20)} ${rem(40)};
`;
