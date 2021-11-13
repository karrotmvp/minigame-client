import styled from '@emotion/styled';
import { rem } from 'polished';
import { useEffect } from 'react';
import BadgeUrl from 'assets/svg/game2048/top_badge.svg';

type TownieProps = {
  getLastWeekTopTownie: () => void;
};
export const LastWeekTopTownie: React.FC<TownieProps> = (props) => {
  useEffect(() => {
    props.getLastWeekTopTownie();
  }, [props]);
  return (
    <Container>
      <Title>
        지난 주 <Highlight>1등 동네</Highlight>
      </Title>
      <Name>district_name</Name>
      <Score>9999</Score>
    </Container>
  );
};

type DistrictProps = {
  getLastWeekTopDistrict: () => void;
};
export const LastWeekTopDistrict: React.FC<DistrictProps> = (props) => {
  useEffect(() => {
    props.getLastWeekTopDistrict();
  }, [props]);
  return (
    <Container>
      <Title>
        지난 주 <Highlight>1등 주민</Highlight>
      </Title>
      <Name>townie_name</Name>
      <Score>99999</Score>
    </Container>
  );
};

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
    width: 25px;
    height: 35px;
    position: absolute;
    top: -11px;
    left: 17px;
  }
`;
const Title = styled.p`
  color: #0e74ff;
  font-size: ${rem(10)};
  text-align: center;
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

const Highlight = styled.span`
  color: #ec9c00;
  font-size: ${rem(12)};
  font-weight: bold;
`;
