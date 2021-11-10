/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import BigKarrotImageUrl from 'assets/images/KarrotClicker/big_karrot.png';
// import { useIdleTimer } from 'react-idle-timer';
import React, { useCallback, useEffect, useState } from 'react';
import { GameState, useClickAnimation, useGame } from '../hooks';

import ClickAnimation from './ClickAnimation';

interface BigKarrotProps {
  // handleKarrotTouch: React.PointerEventHandler;
  // handleGameOver: () => void;
  // handlePause: () => void;
  // animationPlayState: string;
  isPaused: boolean;
  isNewGame: boolean;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  // state: GameState;
  // handleParticleDestroy: any;
}
const BigKarrot: React.FC<BigKarrotProps> = (props) => {
  const { handleKarrotTouch, animationPlayState, pauseGame } = useGame();
  const { state, handleParticleSpawn, handleParticleDestroy } =
    useClickAnimation();
  console.log(animationPlayState);

  const activateAnimation = useCallback(
    (e: React.PointerEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const posX = clientX - 25,
        posY = clientY - 50;
      handleParticleSpawn(posX, posY);
    },
    [handleParticleSpawn]
  );

  const handleOnPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    handleKarrotTouch();
    activateAnimation(e);
  };
  const handleGameOver = () => {
    pauseGame();
    props.setIsGameOver(true);
  };
  // useEffect(() => {
  //   // if (props.isNewGame) {
  //   //   onResetCount();
  //   //   setAnimationPlayState('paused');
  //   // }
  //   if (props.isPaused) {
  //     pause();
  //     setAnimationPlayState('paused');
  //   }
  //   start();
  // }, [pause, props.isPaused, start]);

  // useEffect(() => {
  //   console.log(animationPlayState, isIdle);
  // }, [animationPlayState, isIdle]);
  // console.log(state);
  // console.log(handleParticleDestroy);

  return (
    <>
      <img
        src={BigKarrotImageUrl}
        alt=""
        // ref={BigKarrotRef as any}
        onPointerDown={handleOnPointerDown}
        onAnimationEnd={handleGameOver}
        css={animation(animationPlayState)}
        style={{
          height: '20rem',
          width: 'auto',
          transform: `rotate(45deg)`,
        }}
      />
      {state.particles.map((item) => (
        <ClickAnimation
          key={item.id}
          {...item}
          onDestroy={handleParticleDestroy}
        />
      ))}
    </>
  );
};

export default React.memo(BigKarrot);
const animationKeyframes = keyframes`
  100% {
    transform: scale(0.05);
    // transform: rotate(45deg);
  }
}
`;

const animation = (animationPlayState: string) => css`
  animation-duration: 5s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-name: ${animationKeyframes};
  animation-fill-mode: forwards;
  animation-play-state: ${animationPlayState};
  // pointer-events: none;
`;
