import React from 'react';
import styled from '@emotion/styled';
import { useUser } from 'hooks';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { commafy } from 'utils/number';
import { rem } from 'polished';
import { ReactComponent as IconPencil } from 'assets/icon/svg/icon_pencil.svg';
import { ReactComponent as IconArrowFront } from 'assets/icon/svg/icon_arrow_front_small.svg';
// 가입유저
// 동네기록o 개인기록o
// 동네기록o 개인기록x
// 동네기록x 개인기록x

interface ComponentProps {
  setIsCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstInTown?: boolean;
  myTownRank?: number;
  myTownScore?: number;
  myRank?: number;
  myScore?: number;
}

const UserLoggedIn: React.FC<ComponentProps> = (props) => {
  const { user, town } = useUser();
  const { comment } = useMyGame2048Data();

  return (
    <Container className="my-info">
      <ShareModalButton onClick={() => props.setIsShareModalOpen(true)}>
        🔥 순위 올리기 <IconArrowFront />
      </ShareModalButton>
      <div className="my-info__ranking">
        <div className="ranking">
          <div className="ranking__title">
            <p>{user.nickname}</p>
          </div>
          <div className="ranking__rank">
            <p>
              <span className="score">
                {typeof props.myScore === 'number' && props.myScore > 0
                  ? props.myRank
                  : '-'}
              </span>{' '}
              위
            </p>
          </div>
          <div className="ranking__score">
            <p>
              {typeof props.myScore === 'number' && props.myScore > 0
                ? commafy(props.myScore)
                : '-'}
              점
            </p>
          </div>
        </div>
        <VerticalDivider />
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
              </span>{' '}
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
      </div>
      <HorizontalDivider />
      <div className="comment">
        <p className="comment__edit">
          나의 한 마디
          <IconPencil onClick={() => props.setIsCommentModalOpen(true)} />
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

const ShareModalButton = styled.button`
  
  border-radius: 5px;
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(12)};
  line-height: 161.7%;
  color: #ffffff;

  width: fit-content;
  padding: 4px 8px;

  background: #0E74FF;
  box-shadow: 0px 4px 0px 0px #1457AE;

  position: absolute;
  width: fit-content;
  top: -25px;
  right: 16px;
  
  &:after {
    z-index: 1000;
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-top-color: #1457AE;
    border-bottom: 0;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0 15px;
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
      width: 50%;

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
