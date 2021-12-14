import React from 'react';
import styled from '@emotion/styled';
import { useUser } from 'hooks';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { commafy } from 'utils/number';
import { rem } from 'polished';
import { ReactComponent as IconPencil } from 'assets/icon/svg/icon_pencil.svg';

// 가입유저
// 동네기록o 개인기록o
// 동네기록o 개인기록x
// 동네기록x 개인기록x

interface ComponentProps {
  setIsCommentModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstInTown?: boolean;
  myTownRank?: number;
  myTownScore?: number;
}

const UserLoggedIn: React.FC<ComponentProps> = (props) => {
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
              )}{' '}
              {town.name2}
            </p>
          </div>
          <div className="ranking__rank">
            <p>
              <span className="score">
                {typeof props.myTownScore === 'number' && props.myTownScore > 0
                  ? props.myTownRank
                  : '-'}
              </span>
              위
            </p>
          </div>
          <div className="ranking__score">
            <p>
              {typeof props.myTownScore === 'number' && props.myTownScore > 0
                ? commafy(props.myTownScore)
                : '-'}
              점
            </p>
          </div>
        </div>
        <VerticalDivider />
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
      <HorizontalDivider />
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

export const MemoizedUserLoggedIn = React.memo(UserLoggedIn);

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

const VerticalDivider = styled.div`
  position: absolute;
  width: 1px;
  width: 1px;
  min-width: 1px;
  border-left: 1px solid #e3efff;
  height: 104px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
`;

const HorizontalDivider = styled.div`
  border-top: 1px solid #e3efff;
  margin: 20px 0 16px;
`;
