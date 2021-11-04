import styled from '@emotion/styled';
import { commafy } from 'utils/functions/numberFunctions';
import Medal1Url from '../../../assets/images/medal1.png';
import Medal2Url from '../../../assets/images/medal2.png';
import Medal3Url from '../../../assets/images/medal2.png';

const Container = styled.div<{ me?: boolean; rank?: number }>`
  display: flex;
  flex-flow: row;
  align-items: center;

  padding: 12px 14px;
  margin: 4px 0;
  width: 100%;
  border-radius: ${(props) => (props.me === true ? '10px' : '5px')};
  border: 1px solid ${(props) => (props.me === true ? '#EBE0DB' : '#ececec')};
  background-color: #fff;

  position: relative;

  &::before {
    content: '';
    background-image: ${(props) =>
      props.rank === 1
        ? `url(${Medal1Url})`
        : props.rank === 2
        ? `url(${Medal2Url})`
        : props.rank === 3
        ? `url(${Medal3Url})`
        : `transparent`};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 25px;
    height: 32px;
    position: absolute;
    top: 0px;
    left: 10px;
  }
`;

const Rank = styled.div`
  width: 30px;
  display: flex;
  align-self: flex-start;

  margin-top: 5px;
  margin-left: 5px;

  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  color: #5b5b5b;
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
  display: flex;
  flex-flow: row;
  gap: 4px;
  align-items: center;

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
interface TopUserRowProps {
  me?: boolean;
  rank: number;
  nickname: string;
  score: number;
  comment: string;
  districtName: string;
}
export const TopUserRow: React.FC<TopUserRowProps> = (props) => {
  let userComment;
  if (props.comment.length <= 0) {
    userComment = `한마디 작성 중...`;
  } else {
    userComment = `${props.comment}`;
  }
  return (
    <Container me={props.me} rank={props.rank}>
      <Rank>{props.rank <= 3 ? ' ' : commafy(props.rank)}</Rank>
      <ContentsWrapper>
        <Info>
          <Name rank={props.rank}>
            <DistrictName districtName={props.districtName}>
              {props.districtName.slice(0, -1)}
            </DistrictName>
            {props.nickname}
          </Name>
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
    <Container rank={props.rank}>
      <Rank>{props.rank <= 3 ? ' ' : commafy(props.rank)}</Rank>
      <ContentsWrapper>
        <Info>
          <Name rank={props.rank}>
            {props.cityName.slice(0, -3)} {props.districtName}
          </Name>
          <Score>{commafy(props.score)}</Score>
        </Info>
        <PlayerCount>{commafy(props.playerCount)}명 참여</PlayerCount>
      </ContentsWrapper>
    </Container>
  );
};
