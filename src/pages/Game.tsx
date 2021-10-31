/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import GamePause from 'components/game/GamePause';
import React, { useEffect, useState } from 'react';
import gameBackgroundUrl from 'assets/images/game_background.png';
import Modal from 'react-modal';
import GameDirectionPopupModal from 'components/game/GameDirectionPopupModal';
import { commafy } from 'functions/numberFunctions';
import ClickAnimation from 'components/game/ClickAnimation';
import { useHistory } from 'react-router';
import { useAnalytics } from 'services/analytics';
import useClickCounter from 'hooks/useClickCounter';
import useUserData from 'hooks/useUserData';
import BigKarrot from 'components/game/BigKarrot';
import { ReactComponent as PauseButton } from 'assets/svg/Pause.svg';
import { useIdleTimer } from 'react-idle-timer';
import GameOver from 'components/game/GameOver';

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

Modal.setAppElement(document.createElement('div'));

type Particle = {
  id: string;
  posX: number;
  posY: number;
};

type GameState = {
  particles: Particle[];
};

type GameAction =
  | { type: 'spawn'; posX: number; posY: number }
  | { type: 'remove'; id: string };

const reducer: React.Reducer<GameState, GameAction> = (state, action) => {
  switch (action.type) {
    case 'spawn':
      return {
        ...state,
        particles: state.particles.concat({
          id: Math.random().toString(),
          posX: action.posX,
          posY: action.posY,
        }),
      };
    case 'remove':
      return {
        ...state,
        particles: state.particles.filter(
          (particle) => particle.id !== action.id
        ),
      };
    default:
      return state;
  }
};

const Game = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isUserNew, setIsUserNew] = useState<boolean>(false);
  const [state, gameDispatch] = React.useReducer(reducer, { particles: [] });
  const [animationPlayState, setAnimationPlayState] =
    useState<string>('paused');
  const history = useHistory();
  const analytics = useAnalytics();
  const { userScore } = useUserData();
  const { clickCount, onIncrementClickCount, onResetCount } = useClickCounter();
  const { reset, resume, pause } = useIdleTimer({
    timeout: 100,
    onIdle: handleOnIdle,
    startManually: true,
    startOnMount: false,
    // debounce: 500,
    // element: BigKarrotRef.current,
  });
  type ParticleDestroyHandler = React.ComponentProps<
    typeof ClickAnimation
  >['onDestroy'];
  const handleParticleDestroy = React.useCallback<ParticleDestroyHandler>(
    (id) => {
      gameDispatch({ type: 'remove', id });
    },
    []
  );

  const activateAnimation = (e: React.PointerEvent) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const posX = clientX - 25,
      posY = clientY - 50;
    gameDispatch({ type: 'spawn', posX, posY });
  };
  function handleKarrotTouch(e: React.PointerEvent) {
    e.stopPropagation();
    activateAnimation(e);
    onIncrementClickCount();
    setAnimationPlayState('paused');
    pause();
  }
  function handlePause() {
    pause();
    setAnimationPlayState('paused');
    setIsPaused(true);
    analytics.logEvent('click_game_pause_button');
  }
  function handleGameOver() {
    handlePause();
    setIsGameOver(true);
  }

  function handleOnIdle() {
    resume();
    setAnimationPlayState('running');
  }

  // Popup modal if user is new
  useEffect(() => {
    analytics.logEvent('view_game_page');
    if (userScore === 0) {
      console.log('userscore zero');
      setIsUserNew(true);
    } else {
      setIsUserNew(false);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(isPaused);
      if (isPaused) {
        pause();
      } else {
        resume();
      }
    }, 500);
    return () => clearInterval(intervalId);
  });

  // useEffect(() => {
  //   // history.block((location, action) => {
  //   //   console.log('#### history block', isBlock, action);
  //   //   if (isBlock && action === 'POP') {
  //   //     console.log('#### blocked ####');
  //   //     return false;
  //   //   }
  //   // });

  //   // const unblock = history.block('정말 떠나실건가요?');
  //   // return () => {
  //   //   unblock();
  //   // };

  const [locationKeys, setLocationKeys] = useState<any[]>([]);

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.key]);
      }

      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);

          // Handle forward event
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);

          // Handle back event
          console.log('back button pressed');
          onResetCount();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationKeys]);

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
              {commafy(userScore + clickCount)}
            </p>
          </TotalKarrotCount>
          <PauseButton onClick={handlePause} />
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
            Scorei
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
      {/* GAME PAUSE */}
      <Modal
        isOpen={isPaused}
        // onRequestClose={() => setIsPaused(false)}
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
      {/* GAME OVER */}
      <Modal
        isOpen={isGameOver}
        // onRequestClose={() => setIsGameOver(false)}
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
        <GameOver />
      </Modal>
      {/* GAME DIRECTION */}
      <Modal
        isOpen={isUserNew}
        // onRequestClose={start()}
        shouldCloseOnOverlayClick={true}
        contentLabel="Game Direction Popup Modal"
        css={popupModalStyle}
        style={{
          overlay: {
            background: `none`,
          },
        }}
      >
        <GameDirectionPopupModal setIsUserNew={setIsUserNew} />
      </Modal>
    </>
  );
};

export default Game;
