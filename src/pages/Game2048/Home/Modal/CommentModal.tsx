import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Nav } from 'components/Navigation';
import { rem } from 'polished';
import { useAnalytics } from 'services/analytics';
import { useCurrentScreen } from '@karrotframe/navigator';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMini, useUser } from 'hooks';
import { useMyGame2048Data } from 'pages/Game2048/hooks';

interface Props {
  setIsCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleRefresh: () => Promise<void>;
}
export const CommentModal: React.FC<Props> = (props) => {
  const analytics = useAnalytics();
  const { isTop } = useCurrentScreen();
  const minigameApi = useMinigameApi();
  const { isInWebEnvironment } = useMini();
  const { town } = useUser();
  const { comment: prevComment, updateMyComment } = useMyGame2048Data();
  const [comment, setComment] = useState('');
  const handleCommentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, maxLength } = e.target;
    setComment(value.slice(0, maxLength));
  };

  const closeCommentModal = () => {
    props.setIsCommentModalOpen(false);
  };

  const patchComment = async ({ comment }: { comment: string }) => {
    if (isInWebEnvironment) {
      updateMyComment(comment);
      props.setIsCommentModalOpen(false);
      return;
    }
    try {
      const { data } = await minigameApi.gamePlayApi.addCommentUsingPATCH(
        'GAME_2048',
        {
          comment: comment,
        }
      );
      if (data.status === 200) {
        analytics.logEvent('click_submit_comment_button', {
          game_type: '2048_puzzle',
        });
        updateMyComment(comment);
        props.handleRefresh();
        props.setIsCommentModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_comment_modal', {
        game_type: '2048_puzzle',
      });
    }
  }, [analytics, isTop]);

  return (
    <>
      <Nav
        appendLeft={
          <p
            style={{
              fontSize: `${rem(16)}`,
              color: `#fff`,
            }}
          >
            취소
          </p>
        }
        appendCenter={
          <p
            style={{
              fontSize: `${rem(16)}`,
              fontWeight: `bold`,
              color: `#fff`,
            }}
          >
            한 마디 수정
          </p>
        }
        appendRight={
          <p
            style={{
              fontSize: `${rem(16)}`,

              color: `#fff`,
            }}
          >
            확인
          </p>
        }
        style={{
          position: 'absolute',
          top: 0,
        }}
        onClickLeft={closeCommentModal}
        onClickRight={() => patchComment({ comment: comment })}
      />
      <CommentInput>
        <input
          className="comment__input"
          autoFocus
          type="text"
          maxLength={20}
          placeholder={
            prevComment === '' || prevComment === null
              ? `예) 오예~${town.name2}짱! :)`
              : `${prevComment}`
          }
          onChange={(e) => handleCommentInput(e)}
          value={comment}
        />
        <div className="comment__divider" />
        <p className="comment__length">{comment.length}/20</p>
      </CommentInput>
    </>
  );
};

const CommentInput = styled.div`
  width: 100%;
  padding: 38px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #ffffff;
  line-height: 161.7%;

  input.comment__input {
    font-size: ${rem(18)};
    border: none;
    background: none;
    width: 100%;
    text-align: center;
  }
  div.comment__divider {
    border-top: 1px solid #e3efff;
    margin: 8px 0 12px 0;
    min-width: 100%;
  }
  p.comment_length {
    font-size: ${rem(14)};
  }
`;
