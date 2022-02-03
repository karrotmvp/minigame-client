/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import BigKarrotImageUrl from "assets/images/KarrotClicker/big_karrot.png";
import { useThrottledCallback } from 'use-debounce';
import React, { useCallback } from "react";
import { useAnalytics } from "services/analytics";
import { useClickAnimation, useGame } from "../hooks";


import ClickAnimation from "./ClickAnimation";

interface BigKarrotProps {
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}
const BigKarrot: React.FC<BigKarrotProps> = (props) => {
  const analytics = useAnalytics();
  const { handleKarrotTouch, animationPlayState, pauseGame } = useGame();
  const { state, handleParticleSpawn, handleParticleDestroy } =
    useClickAnimation();
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
  const throttledHandleOnPointerDown = useThrottledCallback(handleOnPointerDown, 100);

  const handleGameOver = () => {
    analytics.logEvent("handle_game_over", {
      game_type: "karrot_clicker",
    });
    pauseGame();
    props.setIsGameOver(true);
  };
  
  return (
    <>
      <img
        src={BigKarrotImageUrl}
        alt=""
        onPointerDown={throttledHandleOnPointerDown}
        onAnimationEnd={handleGameOver}
        css={animation(animationPlayState)}
        style={{
          height: "20rem",
          width: "auto",
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

export default BigKarrot;

const animationKeyframes = keyframes`
  100% {
    transform: scale(0.05);
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
