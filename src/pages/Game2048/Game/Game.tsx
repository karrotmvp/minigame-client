import styled from '@emotion/styled';
import { useCurrentScreen } from '@karrotframe/navigator';
import { Button } from 'components/Button';
import { useMini } from 'hooks';
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

export const Game: React.FC = () => {
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const { isInWebEnvironment } = useMini();
  const { score: myBestScore, highestScore, gameType } = useMyGame2048Data();
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
  // const [isUserInTopTen, setIsUserInTopTen] = useState<boolean>(false);
  const [townieBestScore, setTownieBestScore] = useState<number>(0);
  const [myBestScoreDisplay, setMyBestScoreDisplay] =
    useState<number>(myBestScore);
  const [isGameOver, setIsGameOver] = useState(gameOverStatus);

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

  const handlePlayAgain = () => {
    resetGame();

    console.log('handle play again!!!!!!!!!!');
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
  // const getMyData = async () => {
  //   const {
  //     data: { data },
  //   } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);

  //   if (data) {
  //     if (data.comment) {
  //       updateMyComment(data.comment);
  //     }
  //     if (data.score && data.rank) {
  //       updateMyScore(data.score, data.rank);

  //       return data.rank;
  //     }
  //   }
  // };

  const handleGameOver = async () => {
    // resetGame();
    if (isInWebEnvironment) {
      console.log(`bypass in web environment: open game over modal regardless`);
      setIsGameOver(true);
      // setIsUserInTopTen(true);
      return;
    }
    // getMyData();
    // only patch score to db if current score is higher than the best score
    console.log(myBestScore, currentScore);
    // if (currentScore > myBestScore) {
    //   await updateMyBestScore(currentScore);
    //   const newRank = await getMyData();
    //   console.log(newRank);

    //   if (newRank) {
    //     if (newRank > 0 && newRank <= 10) {
    //       setIsUserInTopTen(true);
    //     } else {
    //       setIsUserInTopTen(false);
    //     }
    //   }
    // } else {
    // const newRank = await getMyData();
    // console.log(newRank);
    // if (newRank) {
    //   if (newRank > 0 && newRank <= 10) {
    //     setIsUserInTopTen(true);
    //   } else {
    //     setIsUserInTopTen(false);
    //   }
    //   // }
    // }
    setIsGameOver(true);
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
              onClick={handleGameOver}
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
            background: 'rgba(40, 40, 40, 0.8)',
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
          setIsGameOver={setIsGameOver}
          currentScore={currentScore}
          myBestScore={myBestScore}
          // isUserInTopTen={isUserInTopTen}
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

// const HighScoreContainer = styled.div`
//   //   display: flex;
//   //   flex-flow: row;
//   //   justify-content: center;
//   //   gap: 0.625rem;

//   //   padding-top: 3.438rem;
//   //   margin: 0 20px;
//   //
// `

// const ActionItems = styled.div`
//   display: flex;
//   flex-flow: row;
//   justify-content: space-between;
//   margin: 0 ${rem(20)} ${rem(40)};
// `

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
