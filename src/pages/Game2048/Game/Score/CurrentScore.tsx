import React from 'react';
import { commafy } from 'utils';

type Props = {
  score: number;
};
const CurrentScore: React.FC<Props> = (props) => {
  return (
    <>
      <p className="text">Score</p>
      <p className="score">{commafy(props.score)}</p>
    </>
  );
};

export const MemoizedCurrentScore = React.memo(CurrentScore);
