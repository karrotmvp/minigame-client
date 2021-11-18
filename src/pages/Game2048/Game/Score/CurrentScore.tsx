import React from 'react';
import styled from '@emotion/styled';
import { rem } from 'polished';

type Props = {
  score: number;
};
const CurrentScore: React.FC<Props> = (props) => {
  return (
    <>
      <p className="text">Score</p>
      <p className="score">{props.score}</p>
    </>
  );
};

export const MemoizedCurrentScore = React.memo(CurrentScore);
