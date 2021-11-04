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
export const RefreshCountdown = () => {
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
