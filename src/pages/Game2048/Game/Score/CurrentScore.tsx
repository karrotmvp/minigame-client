import styled from '@emotion/styled';

import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';

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

export const CurrentScore = () => {
  const { score } = useSelector((state: RootState) => ({
    score: state.game2048Reducer.score,
  }));
  return (
    <Container>
      <Text>Score</Text>
      <Score>{score}</Score>
    </Container>
  );
};
