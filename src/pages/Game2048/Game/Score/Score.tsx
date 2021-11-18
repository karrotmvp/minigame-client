import React from 'react';
import styled from '@emotion/styled';
import { rem } from 'polished';

type BestScore = {
  myBestScore?: number;
  townieBestScore?: number;
};
const TownieBestScore: React.FC<BestScore> = (props) => {
  // API GET TOWNIE HIGH SCORE
  return (
    <Container>
      <Text>주민 최고점수</Text>
      <Score>{props.townieBestScore}</Score>
    </Container>
  );
};
const MyBestScore: React.FC<BestScore> = (props) => {
  // API GET MY HIGH SCORE

  return (
    <Container>
      <Text>내 최고점수</Text>
      <Score>{props.myBestScore}</Score>
    </Container>
  );
};

export const MemoizedTownieBestScore = React.memo(TownieBestScore);
export const MemoizedMyBestScore = React.memo(MyBestScore);

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: ${rem(6)} 0;

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
