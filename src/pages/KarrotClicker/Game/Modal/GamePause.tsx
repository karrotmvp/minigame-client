/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
// import { ReactComponent as Karrot } from 'assets/svg/KarrotClicker/small_circle_karrot.svg';
import karrotImageUrl from 'assets/svg/KarrotClicker/small_circle_karrot.svg';

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { commafy } from 'utils/number';
import { useAnalytics } from 'services/analytics';
import { OldButton } from 'components/Button';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useMyKarrotClickerData } from 'pages/KarrotClicker/hooks';
import { useMini } from 'hooks';
import { useMinigameApi } from 'services/api/minigameApi';
import { CommentModal } from '.';

import { useGame } from '../hooks';
import { rem } from 'polished';

ReactModal.setAppElement(document.createElement('div'));

interface GamePauseProps {
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}
export const GamePause: React.FC<GamePauseProps> = (props) => {
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { replace } = useNavigator();
  const { isInWebEnvironment } = useMini();
  const { score, updateMyKarrotClickerData } = useMyKarrotClickerData();
  const [shouldModalOpen, setShouldModalOpen] = useState<boolean>(false);
  const {
    clickCount,
    pauseGame,
    resumeGame,
    shouldPause,
    updateAnimationPlayState,
  } = useGame();

  // Page navigation
  const goToLeaderboardPage = () => {
    replace(`/karrot-clicker/leaderboard`);
  };

  // Button handler
  const handleContinue = () => {
    analytics.logEvent('click_game_continue_button', {
      game_type: 'karrot_clicker',
    });
    props.setIsPaused(false);
    shouldPause(false);
    resumeGame();
  };

  const handleGameEnd = async () => {
    pauseGame();
    if (isInWebEnvironment) {
      goToLeaderboardPage();
      return;
    }
    try {
      await minigameApi.gamePlayApi.updateScoreUsingPATCH('GAME_KARROT', {
        score: clickCount,
      });
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET('GAME_KARROT');
      if (data && data.rank !== undefined && data.score !== undefined) {
        updateMyKarrotClickerData(data.score, data.rank);
        if (data.rank > 0 && data.rank <= 10) {
          analytics.logEvent('click_game_end_button', {
            game_type: 'karrot_clicker',
            button_type: 'game_end',
            is_top_user: true,
            score: clickCount,
            rank: data.rank,
          });
          // open comment-modal
          setShouldModalOpen(true);
        } else {
          analytics.logEvent('click_game_end_button', {
            game_type: 'karrot_clicker',
            button_type: 'game_end',
            is_top_user: false,
            score: clickCount,
            rank: data.rank,
          });
          goToLeaderboardPage();
        }
      } else {
        // handle what if response data from db deson't exist?
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isTop) {
      updateAnimationPlayState('paused');
      analytics.logEvent('view_game_pause_modal', {
        game_type: 'karrot_clicker',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, isTop]);
  return (
    <>
      {/* <Karrot /> */}
      <img src={karrotImageUrl} alt="" />
      <h1
        css={[largeTextStyle, largeText]}
        style={{ textAlign: 'center', flex: '0 1 auto' }}
      >
        <span css={[emphasizedTextStyle, largeText]}>
          {commafy(clickCount)}개
        </span>
        의 당근을
        <br />
        수확했어요!
      </h1>
      <hr css={horizontalLine} />
      <p css={totalKarrotText}>총 당근 {commafy(score + clickCount)}개</p>
      <div
        style={{
          width: `100%`,
          display: `flex`,

          flex: '0 1 40px',
          justifyContent: `space-evenly`,
          gap: '10px',
        }}
      >
        <OldButton
          size={`medium`}
          color={`secondary`}
          text={`계속하기`}
          onClick={handleContinue}
        />
        <OldButton
          size={`medium`}
          color={`primary`}
          text={`게임종료`}
          onClick={handleGameEnd}
        />
      </div>
      <ReactModal
        isOpen={shouldModalOpen}
        shouldCloseOnOverlayClick={false}
        contentLabel="Top-User Game End Modal"
        css={modalStyle}
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0)',
            zIndex: 100,
          },
        }}
      >
        <CommentModal
          // rank={rank}
          // comment={comment}
          setShouldModalOpen={setShouldModalOpen}
        />
      </ReactModal>
    </>
  );
};

const modalStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  transform: translateY(-50%);
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-flow: column;
  align-items: center;
  background: #fff;
  // top: 25px;
  // inset: 10% 8% 10%;
  padding: 45px 15px 20px;
  border-radius: 21px;
`;
const largeText = css`
  margin: 15px 0;
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(22)};
  line-height: 161.7%;
  /* or 36px */

  text-align: center;
  letter-spacing: -0.03em;
`;
const horizontalLine = css`
  display: block;
  height: 0;
  width: 100%;
  border: 0.1px solid #e7e7e7;
  // padding: 0;
`;
const totalKarrotText = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #a9a9a9;

  margin: 15px 0 23px;
`;
