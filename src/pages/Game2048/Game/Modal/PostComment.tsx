import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Button, DisabledButton } from 'components/Button';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useUserData } from 'hooks';
import { useMyGame2048Data } from 'pages/Game2048/hooks';
import { rem } from 'polished';
import { ReactComponent as Wow } from 'assets/svg/game2048/wow.svg';
import { useMinigameApi } from 'services/api/minigameApi';
import { useMini } from 'hooks';
import { useAnalytics } from 'services/analytics';

type Props = {
  setShouldModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PostComment: React.FC<Props> = (props) => {
  const analytics = useAnalytics();
  const { isTop } = useCurrentScreen();
  const { replace } = useNavigator();
  const minigameApi = useMinigameApi();
  const { townName2: districtName } = useUserData();
  const { isInWebEnvironment } = useMini();
  const {
    score,
    rank,
    comment: prevComment,
    updateMyComment,
  } = useMyGame2048Data();
  const [newComment, setNewComment] = useState({
    comment: prevComment,
    length: prevComment.length,
  });
  // Page navigation
  const goToLeaderboardPage = () => {
    replace(`/game-2048/leaderboard`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setNewComment({
      comment: e.target.value.slice(0, 19),
      length: e.target.value.length,
    });
    console.log(newComment);
  };

  const patchComment = async () => {
    if (isInWebEnvironment) {
      updateMyComment(newComment.comment);
      goToLeaderboardPage();
      return;
    }
    try {
      updateMyComment(newComment.comment);
      const { data } = await minigameApi.gamePlayApi.addCommentUsingPATCH(
        'GAME_2048',
        {
          comment: newComment.comment,
        }
      );
      if (data.status === 200) {
        analytics.logEvent('click_submit_comment_button', {
          game_type: '2048_puzzle',
          score: score,
          rank: rank,
        });
        props.setShouldModalOpen(false);
        goToLeaderboardPage();
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
  });
  return (
    <>
      <div
        style={{
          padding: `6px 0 25px`,
        }}
      >
        <Wow />
      </div>

      <Congrats>
        <span>혹시..천재세요?</span>
        <br />
        <span>{rank}위</span>로 Top 10에 들었어요!
      </Congrats>
      <Text>
        전국 Top 10만 쓸 수 있는 한 마디!
        <br />
        이웃들에게 자랑해보세요
      </Text>
      <ActionItems>
        <CommentInput>
          <input
            type="text"
            onChange={handleInputChange}
            value={newComment.comment}
            placeholder={`예) 오예~${districtName}짱! :)`}
            maxLength={20}
          />
          <span>{newComment.length}/20</span>
        </CommentInput>
        {newComment.length > 0 ? (
          <Button
            size={`large`}
            fontSize={rem(16)}
            color={`primary`}
            onClick={patchComment}
          >
            등록하기
          </Button>
        ) : (
          <DisabledButton size={`large`} fontSize={rem(16)} color={`disabled`}>
            등록하기
          </DisabledButton>
        )}
      </ActionItems>
    </>
  );
};

const Congrats = styled.h3`
  text-align: center;
  flex: 0 1 auto;

  font-style: normal;
  font-weight: bold;
  font-size: ${rem(22)};
  line-height: 161.7%;
  /* or 36px */

  text-align: center;
  letter-spacing: -0.03em;
  color: #3f3f3f;

  span {
    font-size: ${rem(22)};

    color: #0e74ff;
  }
`;

const Text = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* or 23px */

  text-align: center;

  color: #a9a9a9;
  margin: 15px 0 25px;
`;

const ActionItems = styled.div`
  flex: 0 1 40px;
  display: flex;
  flex-flow: column;
  width: 100%;
  gap: 25px;
`;

const CommentInput = styled.div`
  display: flex;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  width: 100%;
  height: 40px;
  padding: 10px;

  input {
    width: 100%;
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 161.7%;
    /* identical to box height, or 26px */
    border: none;
    color: #3f3f3f;

    &::placeholder {
      font-style: normal;
      font-weight: bold;
      font-size: 1rem;
      line-height: 161.7%;
      /* identical to box height, or 26px */

      color: #e0e0e0;
    }
  }
  span {
    position: inline;
    font-style: normal;
    font-weight: normal;
    font-size: ${rem(12)};
    line-height: 161.7%;
    /* or 19px */

    color: #a9a9a9;
  }
`;
