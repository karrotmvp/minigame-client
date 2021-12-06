import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import styled from '@emotion/styled';
import React, { useState, useEffect, useCallback } from 'react';
import ReactModal from 'react-modal';
import { PostComment } from './PostComment';
import gameOverSvgUrl from 'assets/svg/game2048/gameover.svg';
import { Button } from 'components/Button';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { useMini, useUserData } from 'hooks';
import { rem } from 'polished';
import { useAnalytics } from 'services/analytics';
import { AnimatePresence, motion } from 'framer-motion';
import { commafy } from 'utils/number';
import {
  fireConfetti,
  fireRandomDirectionConfetti,
} from 'utils/functions/confetti';
import { useThrottledCallback } from 'use-debounce/lib';
type Props = {
  myPreviousRank: number;
  currentScore: number;
};
export const GameOver: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const { replace } = useNavigator();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { isInWebEnvironment, shareApp } = useMini();
  const { nickname } = useUserData();
  const { gameType } = useMyGame2048Data();
  const [shouldModalOpen, setShouldModalOpen] = useState<boolean>(false);
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

  const getSessionRank = useCallback(
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

  const getMyCurrentRank = useCallback(
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
        rankChange: data?.data?.rank! - previousRank,
      });
    },
    [minigameApi]
  );

  useEffect(() => {
    if (isTop) {
      getSessionRank({ gameType: gameType, score: props.currentScore });
      getMyCurrentRank({
        gameType: gameType,
        previousRank: props.myPreviousRank,
      });
    }
  }, [
    gameType,
    getMyCurrentRank,
    getSessionRank,
    isTop,
    props.currentScore,
    props.myPreviousRank,
  ]);

  const goToLeaderboardPage = () => {
    replace(`/game-2048/leaderboard`);
  };

  const handleShare = () => {
    analytics.logEvent('click_share_button', {
      game_type: '2048_puzzle',
      location: 'game_over_modal',
    });
    const url = 'https://daangn.onelink.me/HhUa/37719e67';
    const text = `${nickname}님은 2048 퍼즐에서 전국 ${myCurrentRank.rank}등!`;
    shareApp(url, text);
  };

  // button to view leaderbaord (open commment modal if condition is met)
  const handleViewLeaderboard = () => {
    if (isInWebEnvironment) {
      goToLeaderboardPage();
      return;
    }
    analytics.logEvent('click_view_leaderboard_button', {
      game_type: '2048_puzzle',
    });
    if (sessionRank.rank !== undefined) {
      sessionRank.rank > 0 && sessionRank.rank <= 10
        ? setShouldModalOpen(true)
        : goToLeaderboardPage();
    }
  };

  // animation handler
  const [showScore, setShowScore] = useState(false);
  const [showRank, setShowRank] = useState(false);
  useEffect(() => {
    if (isTop) {
      const timerId1 = setTimeout(() => {
        setShowScore(true);
      }, 500);
      const timerId2 = setTimeout(() => {
        setShowRank(true);
        if (sessionRank.rank) {
          return sessionRank.rank > 0 && sessionRank.rank <= 10
            ? fireConfetti({ colors: [`#0E74FF`, `#82B6FF`, `#E3EFFF`] })
            : null;
        }
      }, 1000);
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
          marginBottom: `20%`,
        }}
        onClick={fireThrottledRandomDirectionConfetti}
      >
        <img
          src={gameOverSvgUrl}
          alt="gameOverSvgUrl"
          style={{
            marginBottom: `50px`,
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
      {myCurrentRank.rank! !== 0 && myCurrentRank.rank! <= 10 && (
        <TopUserDirection>
          <p>Top10에게 혜택이 있어요!</p>
        </TopUserDirection>
      )}

      <ActionItems>
        <Button
          size={`large`}
          fontSize={rem(16)}
          color={`secondary1`}
          onClick={handleViewLeaderboard}
        >
          랭킹보기
        </Button>
        <Button
          size={`large`}
          fontSize={rem(16)}
          color={`primary`}
          onClick={handleShare}
        >
          자랑하기
        </Button>
      </ActionItems>
      <ReactModal
        // isOpen={shouldOpen.current}
        isOpen={shouldModalOpen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Post Comment"
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
        <PostComment setShouldModalOpen={setShouldModalOpen} />
      </ReactModal>
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

const TopUserDirection = styled.div`
  position: relative;
  margin-bottom: 14px;
  align-self: flex-start;
  background: #e3efff;
  border-radius: 5px;

  font-family: Cafe24SsurroundAir;
  font-style: normal;
  font-size: ${rem(10)};
  line-height: 161.7%;

  color: #ffffff;

  width: fit-content;
  padding: 5px 10px;

  &:after {
    z-index: 1000;
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    border-width: 14px 8px;
    border-radius: 10px;
    border-top-color: #e3efff;
    border-bottom: 0;

    margin-left: -15px;
    margin-bottom: -8px;
  }

  p {
    font-family: Cafe24SsurroundAir;
    font-style: normal;
    font-weight: normal;
    font-size: ${rem(10)};
    line-height: 161.7%;
    /* or 16px */

    color: #0e74ff;
  }
`;
