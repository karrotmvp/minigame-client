import React from 'react';
import styled from '@emotion/styled';
import { commafy } from 'utils/number';
import { rem } from 'polished';

type Props = {
  score: number;
};
const CurrentScore: React.FC<Props> = (props) => {
  return (
    <CurrentScoreWrapper>
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
