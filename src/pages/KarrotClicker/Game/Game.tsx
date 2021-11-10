/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { commafy } from 'utils/functions/numberFunctions';
import { useAnalytics } from 'services/analytics';
import useClickCounter from 'pages/KarrotClicker/hooks/useClickCounter';
import gameBackgroundUrl from 'assets/images/KarrotClicker/game_background.png';
import { useIdleTimer } from 'react-idle-timer';
import { Guide } from './NewUser';
import { useClickAnimation } from './hooks/useClickAnimation';
import ClickAnimation from './Animation/ClickAnimation';
import { BigKarrot } from './Animation/BigKarrot';
import { PauseIcon } from 'assets/Icon';
import { useCurrentScreen } from '@karrotframe/navigator';
import { useMyKarrotClickerData } from '../hooks';
import { GameOver, GamePause } from './Modal';
import { useHistory } from 'react-router';

Modal.setAppElement(document.createElement('div'));

export const Game = () => {
  const history = useHistory();
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const { score } = useMyKarrotClickerData();
  const { clickCount, onIncrementClickCount, onResetCount } = useClickCounter();
  const { handleParticleSpawn, handleParticleDestroy, state } =
    useClickAnimation();
  const bigKarrotRef = useRef<HTMLImageElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isUserNew, setIsUserNew] = useState<boolean>(false);
  const [animationPlayState, setAnimationPlayState] =
    useState<string>('paused');

  const activateAnimation = (e: React.PointerEvent) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const posX = clientX - 25,
      posY = clientY - 50;
    handleParticleSpawn(posX, posY);
  };
  function handleKarrotTouch(e: React.PointerEvent) {
    e.stopPropagation();
    activateAnimation(e);
    onIncrementClickCount();
    // setAnimationPlayState('paused');
    // pause();
  }
  // User clicks pause button
  const handlePauseGame = () => {
    pause();
    setAnimationPlayState('paused');
    setIsPaused(true);
    analytics.logEvent('click_game_pause_button', {
      game_type: 'karrot-clicker',
    });
  };
  const handleGameOver = () => {
    // handlePauseGame();
    setIsGameOver(true);
  };
  const handleOnIdle = (event: any) => {
    console.log('user is idle', event);
    // console.log('last active', getLastActiveTime())
    setAnimationPlayState('running');
  };
  const handleOnAction = (event: any) => {
    console.log('user did something', event);
    setAnimationPlayState('paused');
  };
  const resetGame = () => {
    start();
  };
  const { start, resume, pause } = useIdleTimer({
    timeout: 2000,
    startManually: true,
    onIdle: handleOnIdle,
    // onActive: handleOnActive,
    onAction: handleOnAction,
  });

  // Popup modal if user is new
  useEffect(() => {
    analytics.logEvent('view_game_page');
    if (score === 0) {
      console.log('score zero');
      setIsUserNew(true);
    }
  }, [analytics, score]);

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_game_page', { game_type: 'karrot-clicker' });
    }
  }, [analytics, isTop]);

  // const unblock = history.block((location, action) => {
  //   if (action === 'POP') {
  //     setIsPaused(true);
  //     return false;
  //   }
  //   return undefined;
  // });
  // useEffect(() => {
  //   console.log('aaaaasasfasfas');
  //   if (isTop) {
  //     unblock();
  //   }

  //   return () => unblock();
  // }, [isTop, unblock]);

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
              {commafy(score! + clickCount)}
            </p>
          </TotalKarrotCount>
          <button onClick={handlePauseGame}>
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
          <BigKarrot
            handleKarrotTouch={handleKarrotTouch}
            handleGameOver={handleGameOver}
            animationPlayState={animationPlayState}
          />
        </BigKarrotContainer>

        {state.particles.map((item) => (
          <ClickAnimation
            key={item.id}
            {...item}
            onDestroy={handleParticleDestroy}
          />
        ))}
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
