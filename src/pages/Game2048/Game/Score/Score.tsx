import React from 'react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import { commafy } from 'utils/number';

type Props = {
  nickname?: string;
  rank?: number;
  score?: number;
};

const UserInFront: React.FC<Props> = (props) => {
  // API GET TOWNIE HIGH SCORE
  return (
    <Container content="역전해봐요">
      <div className="info">
        <p className="info__rank">{props.rank}</p>
        <p className="info__text">{props.nickname}</p>
      </div>
      <p className="score">{commafy(props.score)}</p>
    </Container>
  );
};
const MyBestScore: React.FC<Props> = (props) => {
  // API GET MY HIGH SCORE
  return (
    <Container content="최고기록을 세워봐요">
      <div className="info">
        <p className="info__text">내 현재 점수</p>
      </div>
      <p className="score">{commafy(props.score)}</p>
    </Container>
  );
};

export const MemoizedUserInFront = React.memo(UserInFront);
export const MemoizedMyBestScore = React.memo(MyBestScore);

const Container = styled.div<{ content: string }>`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  padding: 26px 20px 10px;
  background: #ffffff;
  border-radius: 10px;
  color: #82b6ff;
  line-height: 161.7%;
  position: relative;
  margin: 18px 20px 0;

  div.info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    p.info__text {
      font-weight: 600;
      font-size: ${rem(16)};
      color: #82b6ff;
    }
  }

  p.score {
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: ${rem(18)};
    color: #0e74ff;
  }

  &::before {
    content: '${(props) => `${props.content}`}';
    width: fit-content;
    height: fit-content;
    position: absolute;
    inset: -18px 0 auto;

    margin: 0 auto;

    background: #82b6ff;
    border-radius: 10px;
    padding: 4px 20px;

    font-weight: 600;
    font-size: ${rem(16)};
    line-height: 161.7%;
    color: #ffffff;
  }
`;
