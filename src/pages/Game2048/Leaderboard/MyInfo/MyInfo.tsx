import React from 'react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import { commafy } from 'utils/number';
import { useUser } from 'hooks';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { DistrictName } from 'styles/leaderboard';
import { ReactComponent as IconPencil } from 'assets/icon/svg/icon_pencil.svg';

interface Props {
  setIsCommentModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  myTownRank: number;
  myTownScore: number;
}
export const NotLoggedIn: React.FC<Props> = (props) => {
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
      <p
        style={{
          fontWeight: `bold`,
          fontSize: `${rem(22)}`,
          lineHeight: `160.2%`,
          color: `#0E74FF`,
        }}
      >
        {town.name2} 이웃님,
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
    </div>
  );
};

const MyInfo: React.FC<Props> = (props) => {
  const { user, town } = useUser();
  const { score: myScore, rank: myRank, comment } = useMyGame2048Data();
  const openCommentModal = () => {
    if (props.setIsCommentModalOpen) props.setIsCommentModalOpen(true);
  };
  return (
    <Container className="my-info">
      <div className="my-info__data">
        <div className="data__town-name">
          <DistrictName
            color="#0E74FF"
            style={{
              borderRadius: '10.5px',
              padding: '2px 8px',
            }}
          >
            <p>
              {town.name1!.replace(
                /(특별시|광역시|특별자치시|특별자치도)$/,
                ''
              )}
              &nbsp;{town.name2}
            </p>
          </DistrictName>
        </div>
        <div className="data__nickname">
          <p>{user.nickname}</p>
        </div>
        <div className="data__comment">
          <p>
            {comment === '' || comment === null
              ? '오른쪽 버튼을 눌러 한마디를 작성할 수 있어요'
              : comment}
          </p>
          <IconPencil onClick={openCommentModal} />
        </div>
      </div>
      <div
        style={{
          borderTop: `1px solid #E3EFFF`,
          margin: `12px 0 16px`,
        }}
      />
      <div className="row my-info__ranking">
        <div className="ranking">
          <div className="ranking__title">
            <p>동네 랭킹</p>
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
            borderLeft: `1px solid #E3EFFF`,
            height: `90px`,
            margin: `0 11px`,
          }}
        />
        <div className="ranking">
          <div className="ranking__title">
            <p>내 랭킹</p>
          </div>
          <div className="ranking__rank">
            <p>
              <span className="score">{myRank}</span>위
            </p>
          </div>
          <div className="ranking__score">
            <p>{commafy(myScore)}점</p>
          </div>
        </div>
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
  padding: ${rem(12)} ${rem(18)};
  background: #ffffff;
  border: 1px solid #4694ff;
  box-sizing: border-box;
  box-shadow: 0px 2px 10px rgba(0, 67, 147, 0.15);
  border-radius: 10px;
  font-style: normal;
  font-weight: normal;

  .my-info__data {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    .data__town-name {
      align-self: flex-start;
      p {
        font-size: ${rem(12)};
      }
    }
    .data__nickname {
      padding: 6px 0;
      p {
        font-weight: bold;
        font-size: ${rem(22)};
        text-align: center;
        color: #0e74ff;
      }
    }
    .data__comment {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      p {
        font-size: ${rem(12)};
        text-align: center;
        color: #7c7c7c;
      }
    }
  }

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
`;
