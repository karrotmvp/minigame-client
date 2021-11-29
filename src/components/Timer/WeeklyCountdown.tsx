import { useCurrentScreen } from '@karrotframe/navigator';
import { useState, useEffect, useCallback } from 'react';
import { nextMonday, formatDistanceToNowStrict } from 'date-fns';

function _getNextMonday() {
  let date = new Date();
  let next = nextMonday(date);
  next.setHours(0, 0, 0, 0);
  return next.getTime();
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
      {time.hours <= 24
        ? ` ${time?.hours.toString().padStart(2, '0')}:${time?.minutes
            .toString()
            .padStart(2, '0')}:${time?.seconds.toString().padStart(2, '0')}`
        : `${formatDistanceToNowStrict(nextMonday(new Date())).slice(0, 1)}일`}
    </>
  );
};
