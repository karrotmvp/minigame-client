import styled from '@emotion/styled';
import { commafy } from 'functions/numberFunctions';
import React from 'react';

const Container = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;

  padding: 12px 14px;
  margin: 4px 0;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ececec;

  color: #5b5b5b;
`;
// DEFAULT USER ROW
const UserRank = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */
`;
const UserInfo = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  font-size: 16px;
  gap: 12px;

  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */
`;
const UserScore = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  text-align: right;
`;
interface DefaultUserRowProps {
  rank: number;
  nickname: string;
  score: number;
}
// DEFAULT DISTRICT ROW
const DistrictRank = styled.div`
  display: flex;
  align-self: flex-start;
  margin-right: 15px;
  margin-top: 5px;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */
`;
const ContentsWrapper = styled.div`
  flex: 1;
`;
const DistrictName = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */
`;
const Contents = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 12px;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  color: #7c7c7c;
`;
const DistrictScore = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

export const DefaultUserRow: React.FC<DefaultUserRowProps> = (props) => {
  return (
    <Container>
      <UserInfo>
        <UserRank>{commafy(props.rank)}</UserRank>
        <div>{props.nickname}</div>
      </UserInfo>
      <UserScore>{commafy(props.score)}</UserScore>
    </Container>
  );
};

interface DefaultDistrictRowProps {
  rank: number;
  cityName: string;
  districtName: string;
  score: number;
}
export const DefaultDistrictRow: React.FC<DefaultDistrictRowProps> = (
  props
) => {
  return (
    <Container>
      <DistrictRank>{commafy(props.rank)}</DistrictRank>
      <ContentsWrapper>
        <DistrictName>
          {props.cityName} {props.districtName}
        </DistrictName>
        <Contents>
          {/* <p>000명 참여</p> */}
          <DistrictScore>{commafy(props.score)}</DistrictScore>
        </Contents>
      </ContentsWrapper>
    </Container>
  );
};
