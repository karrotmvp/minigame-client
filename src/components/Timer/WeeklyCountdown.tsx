import { useCurrentScreen } from '@karrotframe/navigator';
import { useState, useEffect, useCallback } from 'react';

function _getNextMonday() {
  let date = new Date('November 3, 2021');
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7) + 1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
function _getCurrentTime() {
  let date = new Date();
  return date.getTime();
}
function _getTimeLeft() {
  return _getNextMonday() - _getCurrentTime();
}

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}
export const WeeklyCountdown = () => {
  const { isTop } = useCurrentScreen();
  const [time, setTime] = useState<Time>({
    hours: Math.floor(_getTimeLeft() / (1000 * 60 * 60)),
    minutes: Math.floor((_getTimeLeft() % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor(
      ((_getTimeLeft() % (1000 * 60 * 60)) % (1000 * 60)) / 1000
    ),
  });

  const reset = () => {
    setTime({
      hours: Math.floor(_getTimeLeft() / (1000 * 60 * 60)),
      minutes: Math.floor((_getTimeLeft() % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor(
        ((_getTimeLeft() % (1000 * 60 * 60)) % (1000 * 60)) / 1000
      ),
    });
  };

  const tick = useCallback(() => {
    let hours: number = Math.floor(_getTimeLeft() / 1000 / (60 * 60));
    let minutes: number = Math.floor(
      (_getTimeLeft() % (1000 * 60 * 60)) / (1000 * 60)
    );
    let seconds: number = Math.floor(
      ((_getTimeLeft() % (1000 * 60 * 60)) % (1000 * 60)) / 1000
    );
    setTime({ hours, minutes, seconds });
    if (_getTimeLeft() <= 0) {
      reset();
    }
  }, []);

  useEffect(() => {
    if (isTop) {
      const timerID = setInterval(() => tick(), 1000);
      return () => clearInterval(timerID);
    }
  }, [isTop, tick]);

  return (
    <>
      {` ${time?.hours.toString().padStart(2, '0')}:${time?.minutes
        .toString()
        .padStart(2, '0')}:${time?.seconds.toString().padStart(2, '0')}`}
    </>
  );
};