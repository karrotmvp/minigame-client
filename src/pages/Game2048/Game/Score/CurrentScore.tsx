import React from 'react';
import styled from '@emotion/styled';
import { commafy } from 'utils/number';
import { rem } from 'polished';
import refreshGameUrl from 'assets/svg/game2048/refresh_game.svg';

type Props = {
  score: number;
  handlePlayAgain: () => void;
};
const CurrentScore: React.FC<Props> = (props) => {
  const resetGame = () => {
    props.handlePlayAgain();
  };
  return (
    <CurrentScoreWrapper>
      <img
        src={refreshGameUrl}
        alt="refresh-game"
        onClick={resetGame}
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
        }}
      />
      <p className="text">Score</p>
      <p className="score">{commafy(props.score)}</p>
    </CurrentScoreWrapper>
  );
};

const CurrentScoreWrapper = styled.div`
  position: relative;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e3efff;
  box-sizing: border-box;
  border-radius: 10px;
  margin: 12px 20px 0;

  padding: ${rem(7)};
  font-style: normal;
  font-weight: bold;

  p.text {
    font-size: ${rem(18)};
    color: #c8d8ee;
  }
  p.score {
    font-size: ${rem(50)};
    color: #0e74ff;
    font-family: 'Montserrat', sans-serif;
  }
`;

export const MemoizedCurrentScore = React.memo(CurrentScore);
