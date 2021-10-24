import styled from '@emotion/styled';
import { commafy } from 'functions/numberFunctions';

const Container = styled.div<{ rank: number }>`
  display: flex;
  flex-flow: row;
  align-items: center;

  padding: 12px 14px;
  margin: 4px 0;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ececec;

  color: ${(props) =>
    props.rank === 1
      ? '#EB5D0E'
      : props.rank === 2
      ? '#FF8946'
      : props.rank === 3
      ? '#EB8E39'
      : '#5B5B5B'};
`;
// TOP USER ROW
const UserRank = styled.div`
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
const UserComment = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */
`;
const UserInfo = styled.div`
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
const UserScore = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;
// TOP DISTRICT ROW
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

interface TopUserRowProps {
  rank: number;
  nickname: string;
  score: number;
  comment: string;
}
export const TopUserRow: React.FC<TopUserRowProps> = (props) => {
  let userComment;
  if (props.comment.length <= 0) {
    userComment = `한마디 작성중...`;
  } else {
    userComment = `"${props.comment}"`;
  }
  return (
    <Container rank={props.rank}>
      <UserRank>{commafy(props.rank)}</UserRank>
      <ContentsWrapper>
        <UserComment>{userComment}</UserComment>
        <UserInfo>
          <div>{props.nickname}</div>
          <UserScore>{commafy(props.score)}</UserScore>
        </UserInfo>
      </ContentsWrapper>
    </Container>
  );
};

interface TopDistrictTowProps {
  rank: number;
  districtName: string;
  score: number;
  // comment: string;
}
export const TopDistrictRow: React.FC<TopDistrictTowProps> = (props) => {
  return (
    <Container rank={props.rank}>
      <DistrictRank>{commafy(props.rank)}</DistrictRank>
      <ContentsWrapper>
        <DistrictName>{props.districtName}</DistrictName>
        <Contents>
          {/* <p>000명 참여</p> */}
          <DistrictScore>{commafy(props.score)}</DistrictScore>
        </Contents>
      </ContentsWrapper>
    </Container>
  );
};
