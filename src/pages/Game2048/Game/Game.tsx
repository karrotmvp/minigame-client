import styled from '@emotion/styled';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { Button } from 'components/Button';
import { rem } from 'polished';
import React, { useCallback, useEffect, useState } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from '../hooks';
import { Board } from './Game/Board';
import { indexTocoordinate, useGame } from './hooks';
import { GameOverModal } from './Modal';
import {
  MemoizedCurrentScore as CurrentScore,
  MemoizedMyBestScore as MyBestScore,
  // MemoizedTownieBestScore as TownieBestScore,
} from './Score';
import refreshGameUrl from 'assets/svg/game2048/refresh_game.svg';
import { useAnalytics } from 'services/analytics';
import { useMini, useUser } from 'hooks';
import { useDebouncedCallback } from 'use-debounce';
import ReactModal from 'react-modal';
import { TileProps } from './Game/Tile';

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
  const [isUserNew, setIsUserNew] = useState<boolean>(false);
  // const [townieBestScore, setTownieBestScore] = useState<number>(0);
  const [myBestScoreDisplay, setMyBestScoreDisplay] =
    useState<number>(myBestScore);
  const [isGameOver, setIsGameOver] = useState(gameOverStatus);

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

  // get my current rank
  const getMyCurrentRank = useCallback(
    async ({
      gameType,
      type,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      type: 'BEST' | 'CURRENT';
    }) => {
      const { data } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(
        gameType,
        'CURRENT'
      );
      updateMyScore({
        score: data.data?.score as number,
        rank: data.data?.rank as number,
      });
    },
    [minigameApi, updateMyScore]
  );

  // get rank 1's score
  // const getFirstPlaceScore = useCallback(
  //   async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
  //     try {
  //       const {
  //         data: { data },
  //       } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
  //         gameType,
  //         undefined,
  //         1
  //       );
  //       if (data && data[0]) {
  //         setTownieBestScore(data[0].score);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       return;
  //     }
  //   },
  //   [minigameApi.gameUserApi]
  // );

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     getFirstPlaceScore({ gameType: gameType });
  //   }, 10000);
  //   // getFirstPlaceScore({ gameType: gameType });
  //   if (isGameOver) clearInterval(intervalId);
  //   getFirstPlaceScore({ gameType: gameType });

  //   return () => clearInterval(intervalId);
  // }, [gameType, getFirstPlaceScore, isGameOver]);

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
  const handleGameEnd = async ({
    currentScore,
    myBestScore,
    gameType,
  }: {
    currentScore: number;
    myBestScore: number;
    gameType: 'GAME_KARROT' | 'GAME_2048';
  }) => {
    console.log('a');
    if (isInWebEnvironment) {
      setIsGameOver(true);
      return;
    }
    analytics.logEvent('click_game_end_button', {
      game_type: '2048_puzzle',
      button_type: 'game_end',
    });
    if (currentScore > myBestScore) {
      console.log('b');
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
  };

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
    [analytics, updateMyBestScore]
  );

  // const indexTocoordinate = (index: number) => {
  //   const x = index % 4;
  //   const y = Math.floor(index / 4);
  //   return [x, y] as [number, number];
  // };

  const convertArrayToObject = (array: any[], key: any) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  // Retrieve and set my saved game data from database
  const getMyGameData = async ({
    gameType,
  }: {
    gameType: 'GAME_KARROT' | 'GAME_2048';
  }) => {
    const {
      data: { data },
    } = await minigameApi.scoreLogApi.getCurrentLogScoreUsingGET(gameType);
    if (data?.board && data.score) {
      const savedGameData = {
        board: data.board,
        score: data.score,
      };
      return savedGameData;
    } else {
      return null;
    }
  };

  const setMyGameData = async ({
    gameData,
  }: {
    gameData: { board: number[]; score: number };
  }) => {
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
    console.log(tiles, byIds, gameData.score);
    setGameData(tiles, byIds, gameData.score);
  };

  const retrieveMyGameData = async () => {
    const response = await getMyGameData({ gameType: gameType });
    console.log('my previous unfinished game data', response);
    if (response) {
      setMyGameData({ gameData: response });
      return;
    } else {
      resetGame();
    }
  };

  // constantly post board & score (debounced 1sec)
  const debouncedGetMyGameData = useDebouncedCallback(() => {
    console.log(boardByValue, currentScore);
    postMyGameData({
      board: boardByValue,
      score: currentScore,
      gameType: gameType,
    });
  }, 1000);

  const postMyGameData = useCallback(
    async ({
      board,
      score,
      gameType,
    }: {
      board: number[];
      score: number;
      gameType: 'GAME_KARROT' | 'GAME_2048';
    }) => {
      try {
        const response = await minigameApi.scoreLogApi.logScoreUsingPOST(
          { board, score },
          gameType
        );
        console.log(response);
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    [minigameApi.scoreLogApi]
  );

  // Action buttons
  const handlePlayAgain = () => {
    analytics.logEvent('click_game_play_again_button', {
      game_type: '2048_puzzle',
      button_type: 'refresh',
    });
    resetGame();
  };

  // // Get unfinished game data
  // useEffect(() => {
  //   getMyGameData({ gameType: gameType });
  // }, [gameType, getMyGameData]);

  // useEffect(() => {
  //   getMyCurrentRank({ gameType: gameType, type: 'CURRENT' });
  // }, [gameType, getMyCurrentRank]);

  // Set up board & score
  useEffect(() => {
    if (isTop) {
      retrieveMyGameData();
    }
  }, [isTop]);

  // new user guide
  useEffect(() => {
    if (highestScore === 0) {
      setIsUserNew(true);
    }
  }, [highestScore]);

  // display current score as my best score if current score is greater than best score in db
  useEffect(() => {
    console.log('1');
    debouncedGetMyGameData();
    if (currentScore > myBestScore) {
      console.log('2');
      setMyBestScoreDisplay(currentScore);
    }
  }, [currentScore, debouncedGetMyGameData, myBestScore]);

  useEffect(() => {
    console.log('3');
    if (gameOverStatus) {
      handleGameOver({
        currentScore: currentScore,
        myBestScore: myBestScore,
        gameType: gameType,
      });
    }
  }, [gameOverStatus]);

  useEffect(() => {
    console.log(gameOverStatus);
  }, [gameOverStatus]);
  // FA view_game_page
  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_game_page', {
        game_type: '2048_puzzle',
      });
    }
  }, [analytics, isTop]);

  return (
    <>
      <Page className="game-page">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: `flex`,
              flexFlow: `row`,
              justifyContent: `center`,
              gap: `0.625rem`,

              margin: `30px 20px 0`,
            }}
          >
            <MyBestScore myBestScore={myBestScoreDisplay} />
            {/* <TownieBestScore townieBestScore={townieBestScore} /> */}
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: `center`,
            }}
          >
            <CurrentScoreWrapper>
              <img
                src={refreshGameUrl}
                alt="refresh-game"
                onClick={handlePlayAgain}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                }}
              />
              <CurrentScore score={currentScore} />
            </CurrentScoreWrapper>
            <Board
              isUserNew={isUserNew}
              setIsUserNew={setIsUserNew}
              tileList={tileList}
              moveRight={moveRight}
              moveLeft={moveLeft}
              moveUp={moveUp}
              moveDown={moveDown}
            />
          </div>
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

            <button onClick={() => pop()}>뒤로가기</button>
            <p>본 게임은 오픈소스(play2048.co)로 제작되었습니다</p>
          </BottomWrapper>
        </div>
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
        <GameOverModal
          myPreviousRank={myCurrentRank}
          currentScore={currentScore}
          setIsGameOver={setIsGameOver}
          retrieveMyGameData={retrieveMyGameData}
        />
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

const CurrentScoreWrapper = styled.div`
  // display: flex;
  // flex-flow: column;
  // justify-content: center;
  // align-items: center;
  position: relative;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e3efff;
  box-sizing: border-box;
  border-radius: 10px;

  margin: 22px 20px 0;
  padding: ${rem(7)};
  font-style: normal;
  font-weight: bold;

  p.text {
    font-size: ${rem(18)};
    color: #c8d8ee;
  }
  p.score {
    font-size: ${rem(50)};
    color: #0e74ff;
    font-family: 'Montserrat', sans-serif;
  }
`;

const BottomWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 ${rem(20)} ${rem(40)};

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
