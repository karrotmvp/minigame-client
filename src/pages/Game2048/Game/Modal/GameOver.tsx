import styled from '@emotion/styled';
import React, { useState, useEffect, useCallback } from 'react';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import gameOverSvgUrl from 'assets/svg/game2048/gameover.svg';
import { Button } from 'components/Button';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { rem } from 'polished';
import { useAnalytics } from 'services/analytics';
import { AnimatePresence, motion } from 'framer-motion';
import { commafy } from 'utils/number';
import {
  fireConfetti,
  fireRandomDirectionConfetti,
} from 'utils/functions/confetti';
import { useThrottledCallback } from 'use-debounce/lib';
import iconLeave from 'assets/icon/svg/icon_leave.svg';
import iconReplay from 'assets/icon/svg/icon_replay.svg';
import { useGame } from '../hooks';
import { useMini, useMyGameData, useUser } from 'hooks';
import { NotificationRequestDtoTypeEnum } from 'services/openapi_generator';
import { subscribeToastEmitter } from 'components/Toast';

type Props = {
  myPreviousRank: number;
  gameOverScore: number;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setUp: any;
};

export const GameOver: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const { pop } = useNavigator();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { gameType } = useMyGame2048Data();
  const { postBoard } = useMyGameData();
  const { handleSubscribe } = useMini();

  const { subscription, setSubscription } = useUser();
  const { resetGame } = useGame();
  const [sessionRank, setSessionRank] = useState<{
    rank: number | undefined;
    score: number | undefined;
  }>({ rank: undefined, score: 0 });
  const [myCurrentRank, setMyCurrentRank] = useState<{
    rank: number | undefined;
    rankChange: number;
  }>({
    rank: undefined,
    rankChange: 0,
  });

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_game_over_modal', {
        game_type: '2048_puzzle',
      });
    }
  }, [analytics, isTop]);

  const updateSessionRank = useCallback(
    async ({
      gameType,
      score,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      score: number;
    }) => {
      const { data } = await minigameApi.gamePlayApi.getRankByScoreUsingGET(
        gameType,
        score
      );
      setSessionRank({
        rank: data.data?.rank,
        score,
      });
    },
    [minigameApi.gamePlayApi]
  );

  const updateMyCurrentRank = useCallback(
    async ({
      gameType,
      previousRank,
    }: {
      gameType: 'GAME_KARROT' | 'GAME_2048';
      previousRank: number;
    }) => {
      const { data } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(
        gameType
      );
      setMyCurrentRank({
        rank: data.data?.rank,
        rankChange:
          previousRank === 0
            ? 0 - data?.data?.rank!
            : data?.data?.rank! - previousRank,
      });
    },
    [minigameApi]
  );

  useEffect(() => {
    updateSessionRank({ gameType: gameType, score: props.gameOverScore });
    updateMyCurrentRank({
      gameType: gameType,
      previousRank: props.myPreviousRank,
    });
  }, [
    gameType,
    updateMyCurrentRank,
    updateSessionRank,
    props.gameOverScore,
    props.myPreviousRank,
  ]);

  const playAgain = async () => {
    analytics.logEvent('click_game_play_again_button', {
      game_type: '2048_puzzle',
      button_type: 'refresh',
    });

    await resetGame();
    const response = await postBoard({
      gameType: gameType,
      board: [0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
      score: 0,
    });
    if (response === 'success') {
      props.setUp({ gameType: gameType });
      props.setIsGameOver(false);
    }
  };

  const leaveGame = async () => {
    analytics.logEvent('click_leave_game_button', {
      game_type: '2048_puzzle',
      location: 'game_over_modal',
    });

    await resetGame();
    const response = await postBoard({
      gameType: gameType,
      board: [0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
      score: 0,
    });

    if (response === 'success') {
      props.setUp({ gameType: gameType });
      props.setIsGameOver(false);
      pop();
    }
  };

  // animation handler
  const [showScore, setShowScore] = useState(false);
  const [showRank, setShowRank] = useState(false);
  useEffect(() => {
    if (isTop) {
      const timerId1 = setTimeout(() => {
        setShowScore(true);
      }, 300);
      const timerId2 = setTimeout(() => {
        setShowRank(true);
        if (sessionRank.rank) {
          return sessionRank.rank > 0 && sessionRank.rank <= 10
            ? fireConfetti({ colors: [`#0E74FF`, `#82B6FF`, `#E3EFFF`] })
            : null;
        }
      }, 600);

      return () => {
        clearTimeout(timerId1);
        clearTimeout(timerId2);
      };
    }
  }, [isTop, myCurrentRank.rank, sessionRank.rank]);
  // confetti
  const fireThrottledRandomDirectionConfetti = useThrottledCallback(() => {
    fireRandomDirectionConfetti({
      colors: [`#0E74FF`, `#82B6FF`, `#E3EFFF`],
    });
  }, 3000);

  // show subscribe preset non-subscribed user with notificaiton not turned off
  const isSubscribeNotificationOff = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.notificationApi.checkNotificationUsingGET(
      'SUBSCRIBE_OFF'
    );
    if (data) {
      return data.check;
    }
  }, [minigameApi.notificationApi]);
  const onSubscribeSuccess = useCallback(() => {
    analytics.logEvent('click_subscribe_button', {
      game_type: '2048_puzzle',
      location: 'game_over_modal',
      is_voluntary: false,
    });
    setSubscription({ isSubscribed: true });
    subscribeToastEmitter();
  }, [analytics, setSubscription]);
  const turnOffSubscribeNotification = useCallback(async () => {
    await minigameApi.notificationApi.saveNotificationUsingPOST({
      type: 'SUBSCRIBE_OFF' as NotificationRequestDtoTypeEnum,
    });
  }, [minigameApi.notificationApi]);
  useEffect(() => {
    const showSubscribe = async () => {
      if (subscription.isSubscribed === false) {
        const response = await isSubscribeNotificationOff();
        if (response !== undefined && response === false) {
          analytics.logEvent('show_subscribe_button', {
            game_type: '2048_puzzle',
            location: 'game_over_modal',
            is_voluntary: false,
          });
          handleSubscribe(onSubscribeSuccess, turnOffSubscribeNotification);
        }
      }
    };
    showSubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div
        style={{
          flex: 1,
          display: `flex`,
          flexFlow: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: `8px`,
        }}
        onClick={fireThrottledRandomDirectionConfetti}
      >
        <img
          src={gameOverSvgUrl}
          alt="gameOverSvgUrl"
          style={{
            position: 'absolute',
            top: '114px',
          }}
        />
        <AnimatePresence>
          {showScore && (
            <SessionRank
              key="session-score-rank"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="row">
                <p className="text">스코어</p>
                <p className="number">
                  {sessionRank.score === undefined
                    ? ''
                    : commafy(sessionRank.score)}
                </p>
              </div>
              <div className="row">
                <p className="text">랭킹</p>
                <p className="number">
                  {sessionRank.rank === undefined ? '' : sessionRank.rank}
                </p>
              </div>
            </SessionRank>
          )}
          {showRank && (
            <FinalRank
              className="final-rank"
              key="final-rank"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="row">
                <p className="text">
                  최종 랭킹
                  <span
                    className={
                      myCurrentRank.rankChange > 0
                        ? 'down'
                        : myCurrentRank.rankChange < 0
                        ? 'up'
                        : 'no-change'
                    }
                  />
                  <span className="rank-changed">
                    {isNaN(Math.abs(myCurrentRank.rankChange))
                      ? ''
                      : Math.abs(myCurrentRank.rankChange)}
                  </span>
                </p>
                <p className="number">
                  {myCurrentRank.rank === undefined ? '' : myCurrentRank.rank}
                </p>
              </div>
            </FinalRank>
          )}
        </AnimatePresence>
      </div>
      <ActionItems>
        <Button
          size={`large`}
          fontSize={rem(16)}
          color={`secondary1`}
          onClick={playAgain}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <img src={iconReplay} alt="replay-icon" />
            <p
              style={{
                fontWeight: 'bold',
                fontSize: `${rem(18)}`,
              }}
            >
              다시하기
            </p>
          </div>
        </Button>
        <Button
          size={`large`}
          fontSize={rem(16)}
          color={`primary`}
          onClick={leaveGame}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <img src={iconLeave} alt="leave-icon" />
            <p
              style={{
                fontWeight: 'bold',
                fontSize: `${rem(18)}`,
              }}
            >
              게임종료
            </p>
          </div>
        </Button>
      </ActionItems>
    </>
  );
};

const SessionRank = styled(motion.div)`
  display: flex;
  flex-flow: column;
  gap: 8px;

  width: 100%;
  padding: 12px 18px 12px 26px;
  text-align: center;
  font-style: normal;
  background: #ffffff;
  border-radius: 10px;
  color: #0e74ff;

  div.row {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
  }
  p.text {
    font-family: Pretendard;
    font-style: normal;
    font-weight: normal;
    font-size: ${rem(16)};
  }

  p.number {
    font-style: normal;
    font-weight: bold;
    font-family: 'Montserrat', sans-serif;
    font-size: ${rem(28)};
  }
`;

const FinalRank = styled(motion.div)`
  width: 100%;
  padding: 8px 18px 8px 26px;
  text-align: center;
  font-style: normal;
  background: #e3efff;
  border-radius: 10px;
  color: #0e74ff;

  div.row {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
  }
  p.text {
    font-family: Pretendard;
    font-style: normal;
    font-weight: normal;
    font-size: ${rem(16)};
    display: inline-flex;

    span {
      margin-left: 4px;
      align-self: center;
      &.up {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 4px 6.9px 4px;
        border-color: transparent transparent #eb5b0e transparent;
      }

      &.down {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6.9px 4px 0 4px;
        border-color: #0e72ff transparent transparent transparent;
      }

      &.no-change {
        height: 2px;
        width: 8px;
        min-height: 2px;
        min-width: 8px;
        background-color: #7c7c7c;
        display: inline-block;
      }

      &.rank-changed {
        font-family: Montserrat;
        font-style: normal;
        font-weight: bold;
        font-size: 10px;

        color: #5b5b5b;
      }
    }
  }

  p.number {
    font-style: normal;
    font-weight: bold;
    font-family: 'Montserrat', sans-serif;
    font-size: ${rem(28)};
  }
`;

const ActionItems = styled.div`
  display: flex;
  flex-flow: row;
  gap: 12px;
  justify-content: center;

  width: 100%;
`;
