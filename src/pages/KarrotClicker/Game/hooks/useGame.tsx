import { useCallback, useEffect, useState } from 'react';
// import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { incrementClickCount, reset } from 'reducers/counterReducer';
import { RootState } from 'reducers/rootReducer';
import { useClickAnimation } from '../hooks/useClickAnimation';

export const useGame = () => {
  // const { handleParticleSpawn } = useClickAnimation();
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [animationPlayState, setAnimationPlayState] = useState<string>('');

  const { clickCount } = useSelector((state: RootState) => ({
    clickCount: state.counterReducer.clickCount,
  }));
  const dispatch = useDispatch();
  const onResetCount = useCallback(() => dispatch(reset()), [dispatch]);
  const onIncrementClickCount = useCallback(
    () => dispatch(incrementClickCount()),
    [dispatch]
  );

  let timerId: any;
  const startGame = () => {
    onResetCount();
    // timerId = setInterval(() => {
    //   setAnimationPlayState('running');
    //   // console.log('tick, start');
    // }, 1000);
    // clearInterval(timerId);

    // console.log(animationPlayState);
  };
  const pauseGame = useCallback(() => {
    // clearInterval(timerId);
    // setAnimationPlayState('paused');
  }, [timerId]);
  const resumeGame = () => {
    // timerId = setInterval(() => {
    //   setAnimationPlayState('running');
    //   // console.log('tick, resume');
    // }, 1000);
    // clearInterval(timerId);
  };
  const handleKarrotTouch = useCallback(() => {
    // e.stopPropagation();
    // activateAnimation(e);
    onIncrementClickCount();
    pauseGame();
  }, [onIncrementClickCount, pauseGame]);

  // const handleOnAnimationEnd = () => {
  //   props.handleGameOver();
  //   pause();
  // };

  // const handleOnIdle = (event: any) => {
  //   console.log('user is idle', event);
  //   // console.log(props.isPaused);
  //   if (isPaused) {
  //     pause();
  //     setAnimationPlayState('paused');
  //   } else {
  //     resume();
  //     setAnimationPlayState('running');
  //   }
  // };
  // const handleOnAction = (event: any) => {
  //   console.log('user did something', event);
  //   setAnimationPlayState('paused');
  // };

  // const startGame = () => {
  //   onResetCount();
  //   // setKarrotSize(1);
  //   start();
  //   console.log('started');
  // setAnimationPlayState('running');
  // };

  // const pauseGame = () => {
  //   setAnimationPlayState('paused');
  //   pause();
  // };

  // const resumeGame = () => {
  // resume();
  // setAnimationPlayState('running');
  // };

  // const { start, resume, pause } = useIdleTimer({
  //   timeout: 500,
  //   // startManually: true,
  //   // stopOnIdle: true,
  //   // startOnMount: false,
  //   onIdle: handleOnIdle,
  //   // onActive: handleOnActive,
  //   onAction: handleOnAction,
  // });

  return {
    clickCount,
    animationPlayState,
    isPaused,
    setIsPaused,
    handleKarrotTouch,
    startGame,
    pauseGame,
    resumeGame,
  };
};
