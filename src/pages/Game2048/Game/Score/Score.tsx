import styled from '@emotion/styled';
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 0.375rem 2.5rem;

  font-style: normal;

  background: #ffffff;
  border-radius: 10px;
`;
const Text = styled.h4`
  font-weight: 500;
  font-size: 0.75rem;
  color: #82b6ff;
`;

const Score = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: #4694ff;
`;
export const TownieHighScore = () => {
  // API GET TOWNIE HIGH SCORE
  return (
    <Container>
      <Text>주민 최고점수</Text>
      <Score></Score>
    </Container>
  );
};
export const MyHighScore = () => {
  const [totalScore, setTotalScore] = useState(0);

  // API GET MY HIGH SCORE

  return (
    <Container>
      <Text>내 최고점수</Text>
      <Score></Score>
    </Container>
  );
};
