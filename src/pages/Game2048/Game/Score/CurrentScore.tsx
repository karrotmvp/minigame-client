import React from 'react';
import styled from '@emotion/styled';

type Props = {
  score: number;
};
const CurrentScore: React.FC<Props> = (props) => {
  return (
    <Container>
      <Text>Score</Text>
      <Score>{props.score}</Score>
    </Container>
  );
};

export const MemoizedCurrentScore = React.memo(CurrentScore);

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;

  font-style: normal;
`;

const Text = styled.div`
  font-weight: bold;
  font-size: 1.125rem;
  color: #c8d8ee;
`;

const Score = styled.div`
  font-weight: bold;
  font-size: 3.125rem;
  color: #0e74ff;
`;
