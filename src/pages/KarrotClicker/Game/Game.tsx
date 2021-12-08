/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { commafy } from 'utils/number';
import { useAnalytics } from 'services/analytics';
import gameBackgroundUrl from 'assets/images/KarrotClicker/game_background.png';
import { Guide } from './NewUser';
import BigKarrot from './Animation/BigKarrot';
import { PauseIcon } from 'assets/Icon';
import { useCurrentScreen } from '@karrotframe/navigator';
import { useMyKarrotClickerData } from '../hooks';
import { GameOver, GamePause } from './Modal';
import { useGame } from './hooks';
import { useUserData } from 'hooks';
import { useMinigameApi } from 'services/api/minigameApi';

Modal.setAppElement(document.createElement('div'));

export const Game: React.FC = () => {
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const { userId, setUserInfo } = useUserData();
  const minigameApi = useMinigameApi();
  const { score } = useMyKarrotClickerData();
  const { clickCount, updateAnimationPlayState, shouldPause } = useGame();

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isUserNew, setIsUserNew] = useState<boolean>(false);

  // User clicks pause button
  const handlePause = () => {
    analytics.logEvent('click_game_pause_button', {
      game_type: 'karrot_clicker',
    });
    shouldPause(true);
    setIsPaused(true);
  };

  // Popup modal if user is new
  useEffect(() => {
    if (score === 0) {
      updateAnimationPlayState('paused');
      shouldPause(true);
      setIsUserNew(true);
    } else {
      shouldPause(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

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

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_game_page', {
        game_type: 'karrot_clicker',
      });
    }
  }, [analytics, isTop]);

  return (
    <>
      <PageContainer>
        <div css={customNav}>
          <TotalKarrotCount>
            <p
              style={{
                color: '#F39E6E',
              }}
            >
              총 당근
            </p>
            <p
              style={{
                color: '#EB5D0E',
              }}
            >
              {commafy(score + clickCount)}
            </p>
          </TotalKarrotCount>
          <button onClick={handlePause}>
            <PauseIcon />
          </button>
        </div>
        <ScoreWrapper>
          <h2
            style={{
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: '18px',
              color: 'rgba(235, 93, 14, 0.3)',
            }}
          >
            Score
          </h2>
          <ClickCount>{commafy(clickCount)}</ClickCount>
        </ScoreWrapper>
        <BigKarrotContainer>
          <BigKarrot setIsGameOver={setIsGameOver} />
        </BigKarrotContainer>
      </PageContainer>
      {/* pause */}
      <Modal
        isOpen={isPaused}
        shouldCloseOnOverlayClick={false}
        contentLabel="Game Pause"
        css={modalStyle}
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
            zIndex: 100,
          },
        }}
      >
        <GamePause setIsPaused={setIsPaused} />
      </Modal>
      {/* game over */}
      <Modal
        isOpen={isGameOver}
        shouldCloseOnOverlayClick={false}
        contentLabel="Game Over"
        css={modalStyle}
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
            zIndex: 100,
          },
        }}
      >
        <GameOver setIsGameOver={setIsGameOver} />
      </Modal>
      {/* new user guide */}
      <Modal
        isOpen={isUserNew}
        shouldCloseOnOverlayClick={true}
        contentLabel="Game Guide"
        css={popupModalStyle}
        style={{
          overlay: {
            background: `none`,
          },
        }}
      >
        <Guide setIsUserNew={setIsUserNew} />
      </Modal>
    </>
  );
};
const PageContainer = styled.div`
  background-image: url(${gameBackgroundUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  height: 100%;
  display: flex;
  flex-flow: column;
`;
const customNav = css`
  left: 0;
  width: 100%;
  top: 0;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 30px;
  background: transparent;
`;
const TotalKarrotCount = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: center;
  min-width: 150px;
  width: auto;
  height: 2.75rem;
  padding: 6px 12px;
  text-decoration: none;

  background: #ffffff;
  // border: 1px solid #f39es6e;
  box-sizing: border-box;
  border-radius: 10px;

  font-weight: bold;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */
`;
const ScoreWrapper = styled.div`
  // margin-top: 30px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;
const ClickCount = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 50px;
  // line-height: 161.7%;
  /* identical to box height, or 81px */
  color: #eb5d0e;
`;
const BigKarrotContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// game end modal
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

  padding: 45px 15px 20px;
  border-radius: 21px;
`;
// pop-up modal
const popupModalStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  transform: translateY(-50%);
  width: fit-content;
  max-width: 400px;
  display: flex;
  flex-flow: column;
  gap: 26px;
  align-items: center;
  background: rgba(80, 80, 80, 0.5);

  padding: 55px 20px 25px;
  border-radius: 21px;
`;
