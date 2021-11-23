import { useCallback } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import {
  incrementClickCountAction,
  updateAnimationPlayStateAction,
  reset,
  updatePauseStateAction,
} from 'pages/KarrotClicker/Game/reducers/gameKarrotClickerReducer';
import { RootState } from 'reducers/rootReducer';

export const useGame = () => {
  const {
    clickCount,
    animationPlayState,
    pauseState: isPaused,
  } = useSelector((state: RootState) => ({
    clickCount: state.gameKarrotClickerReducer.clickCount,
    animationPlayState: state.gameKarrotClickerReducer.animationPlayState,
    pauseState: state.gameKarrotClickerReducer.pauseState,
  }));
  const dispatch = useDispatch();
  const onResetCount = useCallback(() => dispatch(reset()), [dispatch]);
  const onIncrementClickCount = useCallback(
    () => dispatch(incrementClickCountAction()),
    [dispatch]
  );
  const updateAnimationPlayState = useCallback(
    (animationState: string) =>
      dispatch(updateAnimationPlayStateAction(animationState)),
    [dispatch]
  );
  const shouldPause = useCallback(
    (x) => dispatch(updatePauseStateAction(x)),
    [dispatch]
  );

  const handleOnIdle = (event: any) => {
    if (isPaused === false) {
      updateAnimationPlayState('running');
      start();
      return;
    }
    if (isPaused === true) {
      updateAnimationPlayState('paused');
      pause();
    }
  };
  const { start, pause } = useIdleTimer({
    timeout: 500,
    onIdle: handleOnIdle,
    startManually: true,
  });

  const resumeGame = () => {
    updateAnimationPlayState('running');
    start();
  };

  const pauseGame = useCallback(() => {
    updateAnimationPlayState('paused');
    pause();
  }, [pause, updateAnimationPlayState]);

  const handleKarrotTouch = useCallback(() => {
    onIncrementClickCount();
    updateAnimationPlayState('paused');
    start();
  }, [onIncrementClickCount, start, updateAnimationPlayState]);

  return {
    clickCount,
    animationPlayState,
    shouldPause,
    updateAnimationPlayState,
    isPaused,
    handleKarrotTouch,
    onResetCount,
    pauseGame,
    resumeGame,
  };
};
