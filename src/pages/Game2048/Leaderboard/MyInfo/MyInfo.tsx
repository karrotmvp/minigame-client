import React from 'react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import { commafy } from 'utils/number';
import { useUser } from 'hooks';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { DistrictName } from 'styles/leaderboard';
import { ReactComponent as IconPencil } from 'assets/icon/svg/icon_pencil.svg';
import type { Town } from 'redux/user';

interface ComponentProps {
  setIsCommentModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstInTown?: boolean;
  myTownRank?: number;
  myTownScore?: number;
}

interface TownProps {
  town: Town;
  myTownRank?: number;
}
const FirstInTown: React.FC<TownProps> = (props) => {
  return (
    <>
      <p
        style={{
          fontWeight: `bold`,
          fontSize: `${rem(22)}`,
          lineHeight: `160.2%`,
          color: `#0E74FF`,
        }}
      >
        {props.town.name2} 이웃님,
        <br />
        이웃님이 우리 동네&nbsp;
        <span
          style={{
            fontWeight: `bold`,
            fontSize: `${rem(22)}`,
            lineHeight: `160.2%`,
            color: `#EC9C00`,
          }}
        >
          첫 주민!
        </span>
      </p>
      <div
        style={{
          borderTop: `1px solid #E3EFFF`,
          margin: `18px 0 18px`,
        }}
      />
      <p
        style={{
          fontSize: `${rem(14)}`,
          lineHeight: `161.7%`,
          color: `#4694FF`,
        }}
      >
        지금 바로 게임하고
        <br />
        {props.town.name2}도 랭킹에 참여해봐요
      </p>
    </>
  );
};

const NotLoggedIn: React.FC<TownProps> = (props) => {
  return (
    <>
      <p
        style={{
          fontWeight: `bold`,
          fontSize: `${rem(22)}`,
          lineHeight: `160.2%`,
          color: `#0E74FF`,
        }}
      >
        {props.town.name2} 이웃님,
        <br />
        우리 동네는&nbsp;
        <span
          style={{
            fontWeight: `bold`,
            fontSize: `${rem(22)}`,
            lineHeight: `160.2%`,
            color: `#EC9C00`,
          }}
        >
          {props.myTownRank}위
        </span>
        에요!
      </p>
      <div
        style={{
          borderTop: `1px solid #E3EFFF`,
          margin: `18px 0 18px`,
        }}
      />
      <p
        style={{
          fontSize: `${rem(14)}`,
          lineHeight: `161.7%`,
          color: `#4694FF`,
        }}
      >
        이웃님의 실력으로
        <br />
        우리 동네 순위를 올릴수 있어요
      </p>
    </>
  );
};

export const NotRanked: React.FC<ComponentProps> = (props) => {
  const { town } = useUser();
  return (
    <div
      style={{
        display: `flex`,
        flexFlow: `column`,
        justifyContent: `space-between`,
        width: `100%`,
        padding: `${rem(22)} ${rem(18)}`,
        background: `#ffffff`,
        border: `1px solid #4694ff`,
        boxSizing: `border-box`,
        boxShadow: `0px 2px 10px rgba(0, 67, 147, 0.15)`,
        borderRadius: `10px`,
        textAlign: `center`,
      }}
    >
      {props.isFirstInTown ? (
        <FirstInTown town={town} />
      ) : (
        <NotLoggedIn town={town} myTownRank={props.myTownRank} />
      )}
    </div>
  );
};

const MyInfo: React.FC<ComponentProps> = (props) => {
  const { user, town } = useUser();
  const { score: myScore, rank: myRank, comment } = useMyGame2048Data();
  const openCommentModal = () => {
    if (props.setIsCommentModalOpen) props.setIsCommentModalOpen(true);
  };
  return (
    <Container className="my-info">
      <div className="my-info__ranking">
        <div className="ranking">
          <div className="ranking__title">
            <p>
              {town.name1!.replace(
                /(특별시|광역시|특별자치시|특별자치도)$/,
                ''
              )}
              &nbsp;{town.name2}
            </p>
          </div>
          <div className="ranking__rank">
            <p>
              <span className="score">{props.myTownRank}</span>위
            </p>
          </div>
          <div className="ranking__score">
            <p>{commafy(props.myTownScore)}점</p>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            width: '1px',
            minWidth: '1px',
            borderLeft: `1px solid #E3EFFF`,
            height: '104px',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
          }}
        />
        <div className="ranking">
          <div className="ranking__title">
            <p>{user.nickname}</p>
          </div>
          <div className="ranking__rank">
            <p>
              <span className="score">{myScore === 0 ? '-' : myRank}</span>위
            </p>
          </div>
          <div className="ranking__score">
            <p>{myScore === 0 ? '-' : commafy(myScore)}점</p>
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: `1px solid #E3EFFF`,
          margin: `20px 0 16px`,
        }}
      />
      <div className="comment">
        <p className="comment__edit">
          나의 한 마디
          <IconPencil onClick={openCommentModal} />
        </p>

        <p className="comment__my-comment">
          {comment === '' || comment === null
            ? `${town.name2} 파이팅!`
            : comment}
        </p>
      </div>
    </Container>
  );
};

export const MemoizedMyInfo = React.memo(MyInfo);

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 100%;
  padding: 20px 18px 15px;
  background: #ffffff;
  border: 1px solid #4694ff;
  box-sizing: border-box;
  box-shadow: 0px 2px 10px rgba(0, 67, 147, 0.15);
  border-radius: 10px;
  font-style: normal;
  font-weight: normal;

  .my-info__ranking {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-evenly;
    .ranking {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      min-width: calc(160px - 18px);
      .ranking__title {
        background: #f3f8ff;
        border-radius: 12.5px;
        padding: 4px 12px;
        p {
          font-weight: 600;
          font-size: ${rem(14)};

          color: #0e74ff;
        }
      }
      .ranking__rank {
        padding: 12px 0 6px;
        p {
          color: #0e74ff;
          font-size: ${rem(14)};
          span.score {
            font-family: Montserrat;
            font-style: normal;
            font-weight: bold;
            font-size: ${rem(34)};
          }
        }
      }
      .ranking__score {
        p {
          font-size: ${rem(14)};
          color: #5b5b5b;
        }
      }
    }
  }
  .comment {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    .comment__edit {
      font-size: ${rem(12)};
      line-height: 103.7%;
      text-align: center;
      color: #5b5b5b;
      display: inline-flex;
      gap: 4px;
    }
    .comment__my-comment {
      font-weight: bold;
      font-size: ${rem(16)};
      line-height: 161.7%;
      text-align: center;
      color: #0e74ff;
    }
  }
`;
