import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';

const SpeechBalloon = styled.div`
  position: relative;
  background: #f39e6e;
  border-radius: 5px;
  font-weight: normal;
  font-size: 16px;
  line-height: 161.7%;
  /* or 16px */
  width: fit-content;
  padding: 4px 8px;
  color: #ffffff;

  &:after {
    z-index: 1000;
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 14px solid transparent;
    border-top-color: #f39e6e;
    border-bottom: 0;
    margin-left: -10px;
    margin-bottom: -8px;
  }

  span {
    font-weight: 700;
  }
`;

const DailyUserCount = () => {
  const [dailyUserCount, setDailyUserCount] = useState<number>(0);
  const karrotRaiseApi = useKarrotRaiseApi();
  const getDailyUserCount = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi) => {
      try {
        const response = await karrotRaiseApi.getDailyUserCount();
        if (response.isFetched === true && response.data) {
          const { data } = response.data;
          setDailyUserCount(data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  useEffect(() => {
    getDailyUserCount(karrotRaiseApi);
  }, [getDailyUserCount, karrotRaiseApi]);

  return (
    <SpeechBalloon>
      <span>{dailyUserCount}</span>명이 플레이 중!
    </SpeechBalloon>
  );
};

export default DailyUserCount;
