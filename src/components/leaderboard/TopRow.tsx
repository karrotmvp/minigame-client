import styled from '@emotion/styled';
import { commafy } from 'functions/numberFunctions';

const Container = styled.div<{ me?: boolean }>`
  display: flex;
  flex-flow: row;
  align-items: center;

  padding: 12px 14px;
  margin: 4px 0;
  width: 100%;
  border-radius: ${(props) => (props.me === true ? '10px' : '5px')};
  border: 1px solid ${(props) => (props.me === true ? '#EBE0DB' : '#ececec')};
  background-color: #fff;
`;

const ContentsWrapper = styled.div`
  flex: 1;
`;
const Info = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;
const Name = styled.div<{ rank: number }>`
  color: ${(props) =>
    props.rank === 1
      ? '#EB5D0E'
      : props.rank === 2
      ? '#ff8845'
      : props.rank === 3
      ? '#F39E6E'
      : '#5B5B5B'};

  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */
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
const Rank = styled.div`
  display: flex;
  align-self: flex-start;
  margin-right: 15px;
  margin-top: 5px;

  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  color: #5b5b5b;
`;
// TOP USER ROW
const SpeechBalloon = styled.div`
  position: relative;
  width: fit-content;
  padding: 2px 8px;
  background: #f5f5f5;

  border-radius: 5px;

  &:after {
    z-index: 1000;
    content: '';
    position: absolute;
    top: 4px;
    left: -10px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-right-color: #f5f5f5;
  }

  font-style: normal;
  font-weight: noraml;
  font-size: 10px;
  line-height: 161.7%;
  /* or 19px */

  color: #616161;
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
interface TopUserRowProps {
  me?: boolean;
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
    userComment = `${props.comment}`;
  }
  return (
    <Container me={props.me}>
      <Rank>{commafy(props.rank)}</Rank>
      <ContentsWrapper>
        <Info>
          <Name rank={props.rank}>{props.nickname}</Name>
          <Score>{commafy(props.score)}</Score>
        </Info>
        <SpeechBalloon>{userComment}</SpeechBalloon>
      </ContentsWrapper>
    </Container>
  );
};

interface TopDistrictTowProps {
  rank: number;
  cityName: string;
  districtName: string;
  playerCount: number;
  score: number;
  // comment: string;
}
export const TopDistrictRow: React.FC<TopDistrictTowProps> = (props) => {
  return (
    <Container>
      <Rank>{commafy(props.rank)}</Rank>
      <ContentsWrapper>
        <Info>
          <Name rank={props.rank}>
            {props.cityName} {props.districtName}
          </Name>
          <Score>{commafy(props.score)}</Score>
        </Info>
        <PlayerCount>{commafy(props.playerCount)}명 참여</PlayerCount>
      </ContentsWrapper>
    </Container>
  );
};
