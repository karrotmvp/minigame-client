import styled from '@emotion/styled';
import { commafy } from 'utils/functions/numberFunctions';
import React from 'react';

const Container = styled.div<{ me?: boolean }>`
  display: flex;
  flex-flow: row;
  align-items: center;

  padding: 12px 14px;
  margin: 4px 0;
  width: 100%;
  border-radius: ${(props) => (props.me === true ? '10px' : '5px')};
  border: 1px solid #ececec;
  background-color: #fff;
`;

const ContentsWrapper = styled.div`
  flex: 1;
`;
const Rank = styled.div`
  width: 30px;

  display: flex;
  align-self: flex-start;

  margin-top: 2px;
  margin-left: 5px;

  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  color: #5b5b5b;
`;
const Info = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;
const Name = styled.div`
  display: flex;
  flex-flow: row;
  gap: 4px;
  align-items: center;

  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */

  color: #5b5b5b;
`;
const Score = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */
  color: #5b5b5b;
`;

const DistrictName = styled.div<{ districtName: string }>`
  border: 0.5px solid;
  box-sizing: border-box;
  border-radius: 7px;
  height: fit-content;
  width: fit-content;
  padding: 1px 5px;

  font-style: normal;
  font-weight: 600;
  font-size: 8px;
  line-height: 161.7%;

  color: ${(props) =>
    props.districtName === `서초구`
      ? '#6BA577'
      : props.districtName === `송파구`
      ? '#E17373'
      : props.districtName === `강동구`
      ? '#AE93C3'
      : props.districtName === `강남구`
      ? `#9398C3`
      : props.districtName === `광진구`
      ? `#DD8758`
      : '#5B5B5B'};

  border-color: ${(props) =>
    props.districtName === `서초구`
      ? '#6BA577'
      : props.districtName === `송파구`
      ? '#E17373'
      : props.districtName === `강동구`
      ? '#AE93C3'
      : props.districtName === `강남구`
      ? `#9398C3`
      : props.districtName === `광진구`
      ? `#DD8758`
      : '#5B5B5B'};
`;

const PlayerCount = styled.div`
  width: fit-content;

  font-style: normal;
  font-weight: noraml;
  font-size: 10px;
  line-height: 161.7%;
  /* or 19px */

  color: #7c7c7c;
`;

interface DefaultUserRowProps {
  me?: boolean;
  rank: number;
  nickname: string;
  score: number;
  districtName: string;
}

export const DefaultUserRow: React.FC<DefaultUserRowProps> = (props) => {
  return (
    <Container me={props.me}>
      <Rank>{commafy(props.rank)}</Rank>
      <ContentsWrapper>
        <Info>
          <Name>
            <DistrictName districtName={props.districtName}>
              {props.districtName.slice(0, -1)}
            </DistrictName>
            {props.nickname}
          </Name>
          <Score>{commafy(props.score)}</Score>
        </Info>
      </ContentsWrapper>
    </Container>
  );
};

interface DefaultDistrictRowProps {
  rank: number;
  cityName: string;
  districtName: string;
  playerCount: number;
  score: number;
}
export const DefaultDistrictRow: React.FC<DefaultDistrictRowProps> = (
  props
) => {
  return (
    <Container>
      <Rank>{commafy(props.rank)}</Rank>
      <ContentsWrapper>
        <Info>
          <Name>
            {props.cityName.slice(0, -3)} {props.districtName}
          </Name>
          <Score>{commafy(props.score)}</Score>
        </Info>
        <PlayerCount>{commafy(props.playerCount)}명 참여</PlayerCount>
      </ContentsWrapper>
    </Container>
  );
};
