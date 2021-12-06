import styled from '@emotion/styled';
import { useCurrentScreen } from '@karrotframe/navigator';
import { Button } from 'components/Button';
import { rem } from 'polished';
import React, { useCallback, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from '../hooks';
import { Board } from './Game/Board';
import { useGame } from './hooks';
import { GameOver } from './Modal';
import {
  MemoizedCurrentScore as CurrentScore,
  MemoizedMyBestScore as MyBestScore,
  MemoizedTownieBestScore as TownieBestScore,
} from './Score';
import refreshGameUrl from 'assets/svg/game2048/refresh_game.svg';
import { useAnalytics } from 'services/analytics';
import { useMini, useUserData } from 'hooks';
import { useDebouncedCallback } from 'use-debounce';

export const Game: React.FC = () => {
  const analytics = useAnalytics();
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const { isInWebEnvironment } = useMini();
  const { userId, setUserInfo } = useUserData();
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
    moveRight,
    moveLeft,
    moveUp,
    moveDown,
    resetGame,
  } = useGame();
  const [isUserNew, setIsUserNew] = useState<boolean>(false);
  const [townieBestScore, setTownieBestScore] = useState<number>(0);
  const [myBestScoreDisplay, setMyBestScoreDisplay] =
    useState<number>(myBestScore);
  const [isGameOver, setIsGameOver] = useState(gameOverStatus);

  // update user-info
  const updateUserInfo = useCallback(async () => {
    if (userId) {
      return;
    } else {
      try {
        const {
          data: { data },
        } = await minigameApi.userApi.getUserInfoUsingGET();
        if (data) {
          setUserInfo(data.id, data.nickname);
          // FA: track user with set user id
          // analytics.setUserId(data.id);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [minigameApi.userApi, setUserInfo, userId]);

  useEffect(() => {
    if (userId === '') {
      updateUserInfo();
    }
  }, [updateUserInfo, userId]);

  // FA view_game_page
  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_game_page', {
        game_type: '2048_puzzle',
      });
    }
  }, [analytics, isTop]);

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
  useEffect(() => {
    if (isTop) {
      getMyCurrentRank({ gameType: gameType, type: 'CURRENT' });
    }
  }, [gameType, getMyCurrentRank, isTop]);
  // get rank 1's score
  const getFirstPlaceScore = useCallback(
    async ({ gameType }: { gameType: 'GAME_KARROT' | 'GAME_2048' }) => {
      try {
        const {
          data: { data },
        } = await minigameApi.gameUserApi.getLeaderBoardByUserUsingGET(
          gameType,
          undefined,
          1
        );
        if (data && data[0]) {
          setTownieBestScore(data[0].score);
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
    [minigameApi.gameUserApi]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      getFirstPlaceScore({ gameType: gameType });
    }, 10000);
    // getFirstPlaceScore({ gameType: gameType });
    if (isGameOver) clearInterval(intervalId);
    getFirstPlaceScore({ gameType: gameType });

    return () => clearInterval(intervalId);
  }, [gameType, getFirstPlaceScore, isGameOver]);

  // constantly patch score (score log)
  const debouncedLogScore = useDebouncedCallback(() => {
    logScore({ score: currentScore, gameType: gameType });
  }, 700);

  const logScore = useCallback(
    async ({
      score,
      gameType,
    }: {
      score: number;
      gameType: 'GAME_KARROT' | 'GAME_2048';
    }) => {
      try {
        const response = await minigameApi.scoreLogApi.logScoreUsingPOST(
          { score: score },
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

  useEffect(() => {
    debouncedLogScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScore]);

  // display current score as my best score if current score is greater than best score in db
  useEffect(() => {
    if (currentScore > myBestScore) {
      setMyBestScoreDisplay(currentScore);
    }
  }, [currentScore, myBestScore]);

  // handle game-over OR game-end
  const updateMyBestScore = async ({
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
  };
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
    if (isInWebEnvironment) {
      setIsGameOver(true);
      return;
    }
    analytics.logEvent('click_game_end_button', {
      game_type: '2048_puzzle',
      button_type: 'game_end',
    });
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
  };
  // game-over
  const handleGameOver = async ({
    currentScore,
    myBestScore,
    gameType,
  }: {
    currentScore: number;
    myBestScore: number;
    gameType: 'GAME_KARROT' | 'GAME_2048';
  }) => {
    // let timerId: NodeJS.Timeout;
    if (gameOverStatus) {
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
    }
  };
  useEffect(() => {
    handleGameOver({
      currentScore: currentScore,
      myBestScore: myBestScore,
      gameType: gameType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOverStatus]);

  // new user guide
  useEffect(() => {
    if (isTop) {
      if (highestScore === 0) {
        setIsUserNew(true);
      }
    }
  }, [highestScore, isTop]);

  // Action buttons
  const handlePlayAgain = () => {
    analytics.logEvent('click_game_play_again_button', {
      game_type: '2048_puzzle',
      button_type: 'refresh',
    });
    resetGame();
  };

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
            <TownieBestScore townieBestScore={townieBestScore} />
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

            <p>본 게임은 오픈소스(play2048.co)로 제작되었습니다</p>
          </BottomWrapper>
        </div>
      </Page>

      <ReactModal
        isOpen={isGameOver}
        shouldCloseOnOverlayClick={false}
        contentLabel="Game Over"
        style={{
          overlay: {
            background: 'rgba(90, 90, 90, 0.7)',
            backdropFilter: `blur(5px)`,
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
        <GameOver myPreviousRank={myCurrentRank} currentScore={currentScore} />
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
