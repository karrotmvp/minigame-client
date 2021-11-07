import styled from '@emotion/styled';
import { commafy } from 'utils/functions/numberFunctions';
import Medal1Url from 'assets/svg/game2048/medal1.svg';
import Medal2Url from 'assets/svg/game2048/medal1.svg';
import Medal3Url from 'assets/svg/game2048/medal1.svg';
import { rem } from 'polished';

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
    width: 15px;
    height: 20px;
    // transform: scale(1.5);
    position: absolute;
    top: 16px;
    left: 20px;
  }
`;

const Rank = styled.div`
  width: 25px;
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

// TOP USER ROW
const SpeechBalloon = styled.div`
  position: relative;
  width: fit-content;
  padding: 1px 6px;
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
  font-weight: normal;
  font-size: ${rem(10)};
  line-height: 161.7%;
  /* or 16px */

  color: #7c7c7c;
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
interface TopUserRowProps {
  me?: boolean;
  rank: number;
  userName: string;
  score: number;
  comment: string;
  cityName: string;
  districtName: string;
}
export const TopUserRow: React.FC<TopUserRowProps> = (props) => {
  let userComment;
  if (props.comment.length <= 0 || null) {
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
            {props.userName}
            <DistrictName districtName={props.districtName}>
              {props.cityName.slice(0, 2)} {props.districtName}
            </DistrictName>
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