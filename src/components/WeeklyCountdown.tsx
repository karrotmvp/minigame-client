import styled from '@emotion/styled';
import { useState, useEffect, useCallback } from 'react';

const Countdown = styled.span`
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 161.7%;
  /* or 19px */

  color: #5b5b5b;

  span {
    color: #eb5d0e;
  }
`;

function setDay(date: Date, dayOfWeek: number) {
  date = new Date(date.getTime());
  date.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7));
  date.setHours(0, 0, 0, 0);

  return date.getTime();
}

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}
const WeeklyCountdown = () => {
  const [nextMonday, setNextMonday] = useState<number>(setDay(new Date(), 1));
  const [time, setTime] = useState<Time>({
    hours: Math.floor(
      (setDay(new Date(), 1) - new Date().getTime()) / (1000 * 60 * 60)
    ),
    minutes: Math.floor(
      ((setDay(new Date(), 1) - new Date().getTime()) % (1000 * 60 * 60)) /
        (1000 * 60)
    ),
    seconds: Math.floor(
      (((setDay(new Date(), 1) - new Date().getTime()) % (1000 * 60 * 60)) %
        (1000 * 60)) /
        1000
    ),
  });
  // console.log(time.hours, time.minutes, time.seconds);
  const tick = useCallback(() => {
    const currentTime = new Date().getTime();
    const distanceToDate = nextMonday - currentTime;
    // console.log(distanceToDate);
    let hours: number = Math.floor(distanceToDate / 1000 / (60 * 60));
    let minutes: number = Math.floor(
      (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
    );
    let seconds: number = Math.floor(
      ((distanceToDate % (1000 * 60 * 60)) % (1000 * 60)) / 1000
    );
    setTime({ hours, minutes, seconds });
    if (distanceToDate <= 0) {
      reset();
    }
  }, [nextMonday]);

  const reset = () => {
    // console.log('reset');
    const newDate = setDay(new Date(), 1);
    setNextMonday(newDate);

    setTime({
      hours: Math.floor(
        (setDay(new Date(), 1) - new Date().getTime()) / (1000 * 60 * 60)
      ),
      minutes: Math.floor(
        ((setDay(new Date(), 1) - new Date().getTime()) % (1000 * 60 * 60)) /
          (1000 * 60)
      ),
      seconds: Math.floor(
        (((setDay(new Date(), 1) - new Date().getTime()) % (1000 * 60 * 60)) %
          (1000 * 60)) /
          1000
      ),
    });
  };

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, [tick]);

  return (
    <Countdown>
      (초기화까지
      <span>
        {` ${time?.hours.toString().padStart(2, '0')}:${time?.minutes
          .toString()
          .padStart(2, '0')}:${time?.seconds.toString().padStart(2, '0')}`}
      </span>
      )
    </Countdown>
  );
};

export default WeeklyCountdown;
