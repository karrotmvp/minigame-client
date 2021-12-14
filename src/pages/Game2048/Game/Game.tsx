import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { Button } from 'components/Button';
import { rem } from 'polished';
import React, { useCallback, useEffect, useState } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from '../hooks';
import { Board } from './Game/Board';
import { indexTocoordinate, useGame } from './hooks';
import { GameOver, HowToPlay } from './Modal';
import {
  MemoizedCurrentScore as CurrentScore,
  MemoizedMyBestScore as MyBestScore,
  // MemoizedUserInFront as UserInFront,
} from './Score';

import { useAnalytics } from 'services/analytics';
import { useMini, useUser, useRank, useMyGameData } from 'hooks';
import { useDebouncedCallback } from 'use-debounce';
import ReactModal from 'react-modal';
import { TileProps } from './Game/Tile';
import { Nav } from 'components/Navigation';
import { PageContainer } from 'styles';
import iconArrowBack from 'assets/icon/svg/icon_arrow_back.svg';
import { useHistory } from 'react-router';

const convertArrayToObject = (array: any[], key: any) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const Game: React.FC = () => {
  const analytics = useAnalytics();
  const { pop } = useNavigator();
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const { isInWebEnvironment } = useMini();
  const { user, setUser } = useUser();
  const {
    score: myBestScore,
    rank: myCurrentRank,
    highestScore,
    gameType,
    updateMyScore,
  } = useMyGame2048Data();
  const {
    score: currentScore,
    isGameOver: gameOverStatus,
    tileList,
    boardByValue,
    moveRight,
    moveLeft,
    moveUp,
    moveDown,
    resetGame,
    setGameData,
  } = useGame();
  const { getBoard, postBoard } = useMyGameData();
  const { getMyRank } = useRank();
  const [isUserNew, setIsUserNew] = useState<boolean>(false);
  // const [display, setDisplay] = useState<{
  //   nickname?: string;
  //   rank?: number;
  //   score: number;
  // }>({
  //   nickname: '',
  //   rank: 0,
  //   score: myBestScore,
  // });
  const [isGameOver, setIsGameOver] = useState(gameOverStatus);
  const [gameOverScore, setGameOverScore] = useState<number>(currentScore);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // get stashed board
  // get my rank & score
  const setMyGameData = useCallback(
    async ({ gameData }: { gameData: { board: number[]; score: number } }) => {
      console.log('set my game data', gameData.board, gameData.score);
      const tiles: {
        [id: number]: TileProps;
      } = convertArrayToObject(
        gameData.board
          .map((value, i) => {
            return {
              id: i + 1,
              coordinate: indexTocoordinate({
                index: i,
                tileCountPerRowOrColumn: 4,
              }),
              value: value,
            };
          })
          .filter((item) => item.value > 0),
        'id'
      );
      const byIds: number[] = Object.keys(tiles).map(Number);
      const startId: number = byIds.length > 0 ? Math.max(...byIds) : 1;
      console.log(tiles, byIds, startId, gameData.score);
      setGameData(tiles, byIds, gameData.score, startId);
    },
    [setGameData]
  );

  const setUp = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      try {
        const response = await Promise.all([
          getBoard({ gameType }),
          getMyRank({ gameType }),
        ]);
        console.log('setup', response);
        if (typeof response[0] === 'object') {
          setMyGameData({
            gameData: { board: response[0].board, score: response[0].score },
          });
        }
        if (typeof response[1] === 'object') {
          updateMyScore({
            rank: response[1].rank,
            score: response[1].score,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [getBoard, getMyRank, setMyGameData, updateMyScore]
  );

  // update user-info
  const updateUserInfo = useCallback(
    async ({ userId }: { userId: string }) => {
      if (userId) {
        return;
      } else {
        try {
          const {
            data: { data },
          } = await minigameApi.userApi.getUserInfoUsingGET();
          if (data) {
            setUser({ userId: data.id, nickname: data.nickname });
            return 'success';
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [minigameApi.userApi, setUser]
  );

  useEffect(() => {
    if (user.userId === '') {
      updateUserInfo({ userId: user.userId });
    }
  }, [updateUserInfo, user.userId]);

  const updateMyBestScore = useCallback(
    async ({
      score,
      gameType,
    }: {
      score: number;
      gameType: 'GAME_KARROT' | 'GAME_2048';
    }) => {
      try {
        const data = await minigameApi.gamePlayApi.updateScoreUsingPATCH(
          gameType,
          {
            score: score,
          }
        );
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    [minigameApi.gamePlayApi]
  );
  // game-end
  const handleGameEnd = useCallback(
    async ({
      currentScore,
      myBestScore,
      gameType,
    }: {
      currentScore: number;
      myBestScore: number;
      gameType: 'GAME_KARROT' | 'GAME_2048';
    }) => {
      if (isInWebEnvironment) {
        setGameOverScore(currentScore);
        resetGame();
        setIsGameOver(true);
        return;
      }
      analytics.logEvent('click_game_end_button', {
        game_type: '2048_puzzle',
        button_type: 'game_end',
      });
      setGameOverScore(currentScore);
      resetGame();
      if (currentScore > myBestScore) {
        const response = await updateMyBestScore({
          score: currentScore,
          gameType: gameType,
        });
        if (response?.status === 200) {
          setIsGameOver(true);
        }
      } else {
        setIsGameOver(true);
      }
    },
    [analytics, isInWebEnvironment, resetGame, updateMyBestScore]
  );

  // game-over
  const handleGameOver = useCallback(
    async ({
      currentScore,
      myBestScore,
      gameType,
    }: {
      currentScore: number;
      myBestScore: number;
      gameType: 'GAME_KARROT' | 'GAME_2048';
    }) => {
      analytics.logEvent('handle_game_over', {
        game_type: '2048_puzzle',
      });
      setGameOverScore(currentScore);
      resetGame();
      if (currentScore > myBestScore) {
        const response = await updateMyBestScore({
          score: currentScore,
          gameType: gameType,
        });
        if (response?.status === 200) {
          let timerId = setTimeout(() => {
            setIsGameOver(() => true);
            clearTimeout(timerId);
          }, 1500);
        }
      } else {
        let timerId = setTimeout(() => {
          setIsGameOver(() => true);
          clearTimeout(timerId);
        }, 1500);
      }
    },
    [analytics, resetGame, updateMyBestScore]
  );

  useEffect(() => {
    if (gameOverStatus) {
      handleGameOver({
        currentScore: currentScore,
        myBestScore: myBestScore,
        gameType: gameType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOverStatus]);

  // constantly post board & score (debounced 1sec)
  const debouncedPostMyGameData = useDebouncedCallback(() => {
    postBoard({ gameType: gameType, board: boardByValue, score: currentScore });
  }, 1000);

  useEffect(() => {
    debouncedPostMyGameData();
  }, [currentScore, debouncedPostMyGameData]);

  // Action buttons
  const handlePlayAgain = useCallback(async () => {
    analytics.logEvent('click_game_play_again_button', {
      game_type: '2048_puzzle',
      button_type: 'refresh',
    });
    resetGame();
  }, [analytics, resetGame]);

  // new user guide
  useEffect(() => {
    if (highestScore === 0) {
      setIsUserNew(true);
    }
  }, [highestScore]);

  // FA view_game_page
  useEffect(() => {
    console.log('isTop?', isTop);
    if (isTop) {
      analytics.logEvent('view_game_page', {
        game_type: '2048_puzzle',
      });
      setUp({ gameType: gameType });
    }
  }, [analytics, gameType, isTop, setUp]);

  const history = useHistory();
  useEffect(() => {
    return history.block((location, action) => {
      if (action === 'POP') {
        postBoard({
          gameType: gameType,
          board: boardByValue,
          score: currentScore,
        });
        if (currentScore > myBestScore) {
          updateMyBestScore({ score: currentScore, gameType: gameType });
        }
        return;
      }
      return undefined;
    });
  }, [
    boardByValue,
    currentScore,
    gameType,
    history,
    myBestScore,
    postBoard,
    updateMyBestScore,
  ]);

  // display current score as my best score if current score is greater than best score in db
  // const updateScoreDisplay = useCallback(
  //   async ({ currentScore }: { currentScore: number }) => {
  //     const response = await updateUserInFront({
  //       gameType: 'GAME_2048',
  //       score: currentScore,
  //     });
  //     if (typeof response === 'object') {
  //       setDisplay({
  //         nickname: response.nickname,
  //         rank: response.rank,
  //         score: response.score,
  //       });
  //     } else if (response === 'user is in the first place') {
  //       setDisplay({
  //         nickname: user.nickname,
  //         rank: 1,
  //         score: currentScore,
  //       });
  //     }
  //   },
  //   [updateUserInFront, user.nickname]
  // );

  // useEffect(() => {
  //   if (myBestScore > display.score) {
  //     updateScoreDisplay({ currentScore: myBestScore });
  //   }
  // }, [display.score, myBestScore, updateScoreDisplay]);

  return (
    <>
      <Page className="game-page">
        <Nav
          appendLeft={
            <img
              src={iconArrowBack}
              alt="go-back"
              style={{ background: '#82B6FF' }}
            />
          }
          onClickLeft={() => pop()}
          appendRight={
            <div
              style={{
                display: 'flex',
                flexFlow: 'row',
                gap: '16px',
              }}
            >
              <div onClick={() => setShowHowToPlay(true)}>게임방법</div>
              <div
                onClick={() =>
                  handleGameEnd({
                    currentScore: currentScore,
                    myBestScore: myBestScore,
                    gameType: gameType,
                  })
                }
              >
                처음부터
              </div>
            </div>
          }
        />
        <PageContainer>
          {/*           
          {currentScore >= myBestScore ? (
            <UserInFront
              nickname={display.nickname}
              rank={display.rank}
              score={display.score}
            />
          ) : (
            <MyBestScore score={myBestScore} />
          )} */}
          {currentScore > myBestScore ? (
            <MyBestScore score={currentScore} />
          ) : (
            <MyBestScore score={myBestScore} />
          )}

          <CurrentScore
            score={currentScore}
            handlePlayAgain={handlePlayAgain}
          />

          <Board
            isUserNew={isUserNew}
            setIsUserNew={setIsUserNew}
            tileList={tileList}
            moveRight={moveRight}
            moveLeft={moveLeft}
            moveUp={moveUp}
            moveDown={moveDown}
          />

          <BottomWrapper>
            <Button
              size={`tiny`}
              fontSize={rem(14)}
              color={`secondary2`}
              onClick={() =>
                handleGameEnd({
                  currentScore: currentScore,
                  myBestScore: myBestScore,
                  gameType: gameType,
                })
              }
              style={{
                border: `1px solid #C8D8EE`,
              }}
            >
              그만하기
            </Button>

            <p>본 게임은 오픈소스(play2048.co)로 제작되었습니다</p>
          </BottomWrapper>
        </PageContainer>
      </Page>

      <ReactModal
        isOpen={isGameOver}
        contentLabel="2048-puzzle-gameover-modal"
        style={{
          overlay: {
            background: 'rgba(90, 90, 90, 0.7)',
            backdropFilter: `blur(5px)`,
            WebkitBackdropFilter: `blur(5px)`,
            zIndex: 100,
          },
          content: {
            height: `100%`,
            width: `100%`,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',

            padding: `58px 34px`,
            display: `flex`,
            flexFlow: `column`,

            justifyContent: 'center',
            alignItems: 'center',
            background: 'transparent',
            border: `none`,
          },
        }}
      >
        <GameOver
          myPreviousRank={myCurrentRank}
          gameOverScore={gameOverScore}
          setIsGameOver={setIsGameOver}
        />
      </ReactModal>

      <ReactModal
        isOpen={showHowToPlay}
        contentLabel="2048-puzzle how to play"
        style={{
          overlay: {
            background: 'rgba(90, 90, 90, 0.7)',
            backdropFilter: `blur(5px)`,
            WebkitBackdropFilter: `blur(5px)`,
            zIndex: 100,
          },
          content: {
            width: `80%`,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0,
            display: `flex`,
            flexFlow: `column`,
            justifyContent: 'center',
            alignItems: 'center',
            border: `1px solid #0E74FF`,
            boxSizing: `border-box`,
            borderRadius: `10px`,
          },
        }}
      >
        <HowToPlay setShowHowToPlay={setShowHowToPlay} />
      </ReactModal>
    </>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: #f3f8ff;

  overflow: hidden;
`;

const BottomWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  // align-items: flex-end;
  margin: 0 20px;

  p {
    font-style: normal;
    font-weight: normal;
    font-size: 8px;
    line-height: 161.7%;
    margin-bottom: -6px;

    text-align: right;

    color: #c2dcff;
  }
`;
