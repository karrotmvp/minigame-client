import React from 'react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import { commafy } from 'utils';

type BestScore = {
  myBestScore?: number;
  townieBestScore?: number;
};
const TownieBestScore: React.FC<BestScore> = (props) => {
  // API GET TOWNIE HIGH SCORE
  return (
    <Container>
      <p className="text">전국 1등 점수</p>
      <p className="score">{commafy(props.townieBestScore)}</p>
    </Container>
  );
};
const MyBestScore: React.FC<BestScore> = (props) => {
  // API GET MY HIGH SCORE

  return (
    <Container>
      <p className="text">내 점수</p>
      <p className="score">{commafy(props.myBestScore)}</p>
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
  padding: ${rem(7)};

  font-style: normal;

  background: #ffffff;
  border-radius: 10px;
  color: #82b6ff;

  p.text {
    font-size: ${rem(12)};
    font-weight: 500;
  }

  p.score {
    font-size: ${rem(14)};
    font-weight: bold;
    line-height: 161.7%;
  }
`;
