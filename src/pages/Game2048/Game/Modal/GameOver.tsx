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
import xUrl from 'assets/svg/x.svg';
import { useAnalytics } from 'services/analytics';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  currentScore: number;
  myBestScore: number;
};
export const GameOver: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const { replace } = useNavigator();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { isInWebEnvironment, shareApp } = useMini();
  const { nickname } = useUserData();
  const { rank, gameType, updateMyScore } = useMyGame2048Data();
  const [shouldModalOpen, setShouldModalOpen] = useState<boolean>(false);

  const goToLeaderboardPage = () => {
    replace(`/game-2048/leaderboard`);
  };

  const getMyData = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
      if (data) {
        if (data.score && data.rank) {
          updateMyScore(data.score, data.rank);
          return data.rank;
        }
      }
    } catch (error) {}
  }, [gameType, minigameApi.gameUserApi, updateMyScore]);

  const handleViewLeaderboard = async () => {
    if (isInWebEnvironment) {
      goToLeaderboardPage();
      // setShouldModalOpen(true);
      return;
    }

    analytics.logEvent('click_view_leaderboard_button', {
      game_type: '2048_puzzle',
    });

    const response = await getMyData();
    if (response) {
      if (response > 0 && response <= 10) {
        setShouldModalOpen(true);
      } else {
        goToLeaderboardPage();
      }
    }
  };

  const handleShare = () => {
    analytics.logEvent('click_share_button', {
      game_type: '2048_puzzle',
      location: 'game_over_modal',
    });
    const url = 'https://daangn.onelink.me/HhUa/54499335';
    const text = `${nickname}님은 2048 퍼즐에서 전국 ${rank}등!`;
    shareApp(url, text);
  };

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_game_over_modal', {
        game_type: '2048_puzzle',
      });
      getMyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, isTop]);

  // animation handler
  const [showScore, setShowScore] = useState(false);
  const [showRank, setShowRank] = useState(false);
  useEffect(() => {
    const timerId1 = setTimeout(() => {
      setShowScore(true);
    }, 300);
    const timerId2 = setTimeout(() => {
      setShowRank(true);
    }, 500);

    return () => {
      clearTimeout(timerId1);
      clearTimeout(timerId2);
    };
  });
  return (
    <>
      <img
        src={xUrl}
        alt="close"
        onClick={handleViewLeaderboard}
        style={{
          position: 'absolute',
          top: 39,
          right: 27,
        }}
      />
      <div
        style={{
          flex: 1,
          display: `flex`,
          flexFlow: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: `16px`,
          marginBottom: `20%`,
        }}
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
            <Final
              key="final-score"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="text">최종 스코어</p>
              <p className="number">{props.currentScore}</p>
            </Final>
          )}
          {showRank && (
            <Final
              key="final-rank"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="text">최종 랭킹</p>
              <p className="number">{rank}</p>
            </Final>
          )}
        </AnimatePresence>
      </div>
      <Button
        size={`large`}
        fontSize={rem(16)}
        color={`primary`}
        onClick={handleShare}
      >
        자랑하기
      </Button>

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

const Final = styled(motion.div)`
  width: 100%;
  padding: 10px 15px 15px;
  text-align: center;
  font-style: normal;
  background: #ffffff;
  border-radius: 21px;
  color: #0e74ff;

  p.text {
    font-weight: normal;
    font-size: 14px;
    line-height: 161.7%;
    margin-bottom: 7px;
  }

  p.number {
    font-weight: 700;
    font-family: 'Montserrat', sans-serif;
    font-size: ${rem(30)};
    line-height: 103.7%;
  }
`;
