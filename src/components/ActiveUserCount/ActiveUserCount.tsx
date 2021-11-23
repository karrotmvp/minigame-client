import styled from '@emotion/styled';
import { useCurrentScreen } from '@karrotframe/navigator';
import { rem } from 'polished';
import { useCallback, useEffect, useState } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';

type Props = {
  gameType: 'GAME_KARROT' | 'GAME_2048';
};
export const ActiveUserCount: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const [dailyUserCount, setDailyUserCount] = useState<number>(0);

  const getDailyUserCount = useCallback(async () => {
    const { data } = await minigameApi.gamePlayApi.getUserCountByDailyUsingGET(
      props.gameType
    );
    if (data.data) {
      setDailyUserCount(data.data);
    }
  }, [minigameApi, props.gameType]);

  useEffect(() => {
    if (isTop) {
      getDailyUserCount();
    }
  }, [getDailyUserCount, isTop, props.gameType]);
  return (
    <SpeechBalloon gameType={props.gameType}>
      <span>{dailyUserCount}명</span>이 플레이 중!
    </SpeechBalloon>
  );
};
const SpeechBalloon = styled.div<{ gameType: 'GAME_KARROT' | 'GAME_2048' }>`
  position: relative;

  background: ${(props) =>
    props.gameType === `GAME_2048`
      ? `#82B6FF`
      : props.gameType === `GAME_KARROT`
      ? `#F39E6E`
      : `#F39E6E`};
  border-radius: 5px;

  font-family: Cafe24SsurroundAir;
  font-style: normal;
  font-size: ${rem(10)};
  line-height: 161.7%;

  color: #ffffff;

  width: fit-content;
  padding: 4px 8px;

  &:after {
    z-index: 1000;
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 14px solid transparent;
    border-top-color: ${(props) =>
      props.gameType === `GAME_2048`
        ? `#82B6FF`
        : props.gameType === `GAME_KARROT`
        ? `#F39E6E`
        : `#F39E6E`};
    border-bottom: 0;

    margin-left: -10px;
    margin-bottom: -8px;
  }

  span {
    font-family: Cafe24Ssurround;
    font-weight: bold;
    font-size: ${rem(10)};
    line-height: 161.7%;
  }
`;
