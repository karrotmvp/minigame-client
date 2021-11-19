import styled from '@emotion/styled';
import { commafy } from 'utils/numberFunctions';
import React from 'react';
import { rem } from 'polished';

interface DefaultUserRowProps {
  me?: boolean;
  rank: number;
  nickname: string;
  score: number;
  cityName: string;
  districtName: string;
}

export const DefaultUserRow: React.FC<DefaultUserRowProps> = (props) => {
  return (
    <Container me={props.me}>
      <Rank>{commafy(props.rank)}</Rank>
      <ContentsWrapper>
        <Info>
          <Name>
            {props.nickname}
            <DistrictName districtName={props.districtName}>
              {props.cityName.slice(0, 2)} {props.districtName}
            </DistrictName>
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
const Container = styled.div<{ me?: boolean }>`
  display: flex;
  flex-flow: row;
  align-items: center;

  padding: 12px 20px 14px 26px;
  margin: 4px 0;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #ececec;
  background-color: #fff;
`;

const ContentsWrapper = styled.div`
  flex: 1;
`;
const Rank = styled.div`
  width: 25px;
  display: flex;
  align-self: flex-start;

  margin-top: 3px;
  // margin-left: 5px;

  font-weight: bold;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  color: #7c7c7c;
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
  font-size: ${rem(16)};
  line-height: 161.7%;
  /* identical to box height, or 26px */

  color: #0e74ff;
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
  height: fit-content;
  width: fit-content;
  padding: 0 5px;

  color: #7c7c7c;
  font-style: normal;
  font-weight: normal;
  font-size: ${rem(8)};
  line-height: 161.7%;

  border: 0.5px solid #7c7c7c;
  box-sizing: border-box;
  border-radius: 7px;
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
