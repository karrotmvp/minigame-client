import styled from '@emotion/styled';
import { rem } from 'polished';
import BadgeUrl from 'assets/svg/game2048/top_badge.svg';
import { commafy } from 'utils';
import React from 'react';

type DistrictProps = {
  townName1: string;
  townName2: string;
  score: number;
};
const LastWeekTopDistrict: React.FC<DistrictProps> = (props) => {
  return (
    <Container>
      <Title>
        지난 주 <span>1등 동네</span>
      </Title>
      <Name>
        {props.townName1} {props.townName2}
      </Name>
      <Score>{commafy(props.score)}점</Score>
    </Container>
  );
};
export const MemoizedLastWeekTopDistrict = React.memo(LastWeekTopDistrict);

type TownieProps = {
  name: string;
  score: number;
};
const LastWeekTopTownie: React.FC<TownieProps> = (props) => {
  return (
    <Container>
      <Title>
        지난 주 <span>전국 1등</span>
      </Title>
      <Name>{props.name}</Name>
      <Score>{commafy(props.score)}점</Score>
    </Container>
  );
};
export const MemoizedLastWeekTopTownie = React.memo(LastWeekTopTownie);

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: ${rem(25)} 0 ${rem(15)};
  font-style: normal;
  font-weight: normal;
  line-height: 161.7%;
  box-sizing: border-box;
  background: #f3f8ff;
  border: 1px solid #5ba1ff;
  border-radius: 10px;

  position: relative;

  &::before {
    content: '';
    background-image: url(${BadgeUrl});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 23px;
    height: 31px;
    position: absolute;
    top: -11px;
    left: 17px;
  }
`;
const Title = styled.p`
  color: #0e74ff;
  font-size: ${rem(10)};
  text-align: center;

  span {
    color: #ec9c00;
    font-size: ${rem(12)};
    font-weight: bold;
  }
`;
const Name = styled.h3`
  color: #0e74ff;
  font-size: ${rem(18)};
  font-weight: bold;
  padding-top: ${rem(8)};
`;
const Score = styled.div`
  color: #0e74ff;
  font-size: ${rem(10)};
`;
