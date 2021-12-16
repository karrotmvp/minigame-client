import React from 'react';
import styled from '@emotion/styled';
import { commafy } from 'utils/number';
import iconMedalFirst from 'assets/icon/svg/icon_medal_first.svg';
import iconMedalSecond from 'assets/icon/svg/icon_medal_second.svg';
import iconMedalThird from 'assets/icon/svg/icon_medal_third.svg';
import { rem } from 'polished';

interface UserRowProps {
  rank: number;
  nickname: string;
  score: number;
  comment: string | null;
  cityName: string;
  districtName: string;
  style?: React.CSSProperties;
}

interface TownRowProps {
  rank: number;
  cityName: string;
  districtName: string;
  playerCount: number;
  score: number;
  style?: React.CSSProperties;
}

const UserRow: React.FC<UserRowProps> = (props) => {
  let userComment;
  if (props.comment === '' || props.comment === null) {
    userComment = `${props.districtName} 파이팅!`;
  } else {
    userComment = `${props.comment}`;
  }
  return (
    <>
      <Container rank={props.rank}>
        <div className="rank">{props.rank <= 3 ? 0 : commafy(props.rank)}</div>
        <div className="info">
          <div className="info__data">
            <div className="data__name">
              {props.nickname}
              <DistrictName>
                <p>
                  {props.cityName} {props.districtName}
                </p>
              </DistrictName>
            </div>
            <div className="data__score">{commafy(props.score)}</div>
          </div>
          <SpeechBalloon>{userComment}</SpeechBalloon>
        </div>
      </Container>
    </>
  );
};

const TownRow: React.FC<TownRowProps> = (props) => {
  return (
    <>
      <Container rank={props.rank}>
        <div className="rank">{props.rank <= 3 ? 0 : commafy(props.rank)}</div>
        <div className="info">
          <div className="info__data">
            <div className="data__name">
              {props.cityName} {props.districtName}
            </div>
            <div className="data__score">{commafy(props.score)}</div>
          </div>
          <PlayerCount>{commafy(props.playerCount)}명</PlayerCount>
        </div>
      </Container>
    </>
  );
};

export const MemoizedUserRow = React.memo(UserRow);
export const MemoizedTownRow = React.memo(TownRow);

const Container = styled.div<{ rank?: number }>`
  display: flex;
  flex-flow: row;

  padding-left: 6px;
  &::before {
    content: '';
    background-image: ${(props) =>
      props.rank === 1
        ? `url(${iconMedalFirst})`
        : props.rank === 2
        ? `url(${iconMedalSecond})`
        : props.rank === 3
        ? `url(${iconMedalThird})`
        : undefined};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 19px;
    height: 25px;
    position: absolute;
    top: 18px;
    left: 2px;
  }

  .rank {
    width: ${rem(30)};

    margin-top: 3px;

    font-weight: bold;
    font-size: 12px;
    line-height: 161.7%;
    /* or 19px */

    color: #7c7c7c;
  }
  .info {
    flex: 1;
    .info__data {
      display: flex;
      flex-flow: row;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;

      .data__name {
        display: flex;
        flex-flow: row;
        gap: 6px;
        align-items: center;

        font-style: normal;
        font-weight: 600;
        font-size: ${rem(18)};
        line-height: 161.7%;
        /* identical to box height, or 26px */

        color: #0e74ff;
      }
      .data__score {
        display: flex;
        justify-content: flex-end;
        flex: 1;

        font-style: normal;
        font-weight: normal;
        font-size: ${rem(15)};
        line-height: 161.7%;
        /* or 19px */
        color: #5b5b5b;
      }
    }
  }
`;

const SpeechBalloon = styled.div`
  width: fit-content;
  font-style: normal;
  font-weight: normal;
  font-size: ${rem(12)};
  line-height: 161.7%;
  color: #7c7c7c;
`;

const PlayerCount = styled.div`
  width: fit-content;

  font-style: normal;
  font-weight: noraml;
  font-size: ${rem(14)};
  line-height: 161.7%;
  /* or 19px */

  color: #7c7c7c;
`;

const DistrictName = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 0 8px;

  box-sizing: border-box;
  background: #f5f5f5;
  border-radius: 9.5px;

  p {
    font-size: 12px;
    line-height: 161.7%;
    color: #7c7c7c;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: fit-content;
    max-width: 80px;
  }
`;
