/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
// import { ReactComponent as Karrot } from 'assets/svg/KarrotClicker/small_circle_karrot.svg';
import karrotImageUrl from 'assets/svg/KarrotClicker/small_circle_karrot.svg';

import React, { useEffect, useState } from 'react';
import { OldButton, OldDisabledButton } from 'components/Button';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { useUserData } from 'hooks';
import { useMyKarrotClickerData } from 'pages/KarrotClicker/hooks';
import { useMinigameApi } from 'services/api/minigameApi';
import { useAnalytics } from 'services/analytics';
import { rem } from 'polished';

type Props = {
  setShouldModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export const CommentModal: React.FC<Props> = (props) => {
  const { isTop } = useCurrentScreen();
  const { replace } = useNavigator();
  const minigameApi = useMinigameApi();
  const analytics = useAnalytics();
  const {
    score,
    rank,
    comment: prevComment,
    updateMyKarrotClickerData,
    updateMyComment,
  } = useMyKarrotClickerData();
  const [currentComment, setCurrentComment] = useState({
    comment: prevComment,
    length: prevComment.length,
  });

  const { townName2: districtName } = useUserData();
  // Page navigation
  const goToLeaderboardPage = () => {
    replace(`/karrot-clicker/leaderboard`);
  };

  const handleCommentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentComment({
      comment: e.target.value.slice(0, 19),
      length: e.target.value.length,
    });
  };

  const handleUpdateComment = () => {
    minigameApi.gamePlayApi.addCommentUsingPATCH('GAME_KARROT', {
      comment: currentComment.comment,
    });
    updateMyKarrotClickerData(score, rank);
    updateMyComment(currentComment.comment);
    analytics.logEvent('click_submit_comment_button', {
      game_type: 'karrot_clicker',
      score: score,
      rank: rank,
    });
    // close comment modal
    props.setShouldModalOpen(false);
    goToLeaderboardPage();
  };
  useEffect(() => {
    if (isTop) {
      analytics.logEvent('view_comment_modal', {
        game_type: 'karrot_clicker',
      });
    }
  }, [analytics, isTop, prevComment, rank]);

  return (
    <>
      {/* <Karrot /> */}
      <img src={karrotImageUrl} alt="" />
      <h1
        css={[largeTextStyle, largeText]}
        style={{ textAlign: 'center', flex: '0 1 auto' }}
      >
        <span css={[emphasizedTextStyle, largeText]}>축하해요!</span>
        <br />
        <span css={[emphasizedTextStyle, largeText]}>{rank}위</span>로 순위권에
        들었어요!
      </h1>
      <hr css={horizontalLine} />
      <p css={infoText}>
        {districtName} 이웃들에게
        <br />
        하고 싶은 말을 남겨보세요
      </p>
      <div css={bottomActionDiv}>
        <div css={commentInputWrapper}>
          <input
            css={commentInput}
            type="text"
            onChange={handleCommentInput}
            value={currentComment.comment}
            placeholder={`예) 내가 ${districtName}짱!`}
            maxLength={20}
          />
          <p css={commentLengthCount}>{currentComment.length}/20</p>
        </div>

        {currentComment.length > 0 ? (
          <OldButton
            size={`large`}
            color={`primary`}
            text={`등록하기`}
            onClick={handleUpdateComment}
          />
        ) : (
          <OldDisabledButton size={`large`} text={`등록하기`} />
        )}
      </div>
    </>
  );
};

const largeText = css`
  margin: 15px 0;
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(22)};
  line-height: 161.7%;
  /* or 36px */

  text-align: center;
  letter-spacing: -0.03em;
`;
const horizontalLine = css`
  display: block;
  height: 0;
  width: 100%;
  border: 0.1px solid #e7e7e7;
`;
const infoText = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #a9a9a9;
  text-align: center;
  margin: 15px 0 23px;
`;
const commentInputWrapper = css`
  display: flex;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  width: 100%;
  height: 40px;
  padding: 10px;
`;
const commentInput = css`
  width: 100%;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 161.7%;
  /* identical to box height, or 26px */
  border: none;
  color: #3f3f3f;

  &::placeholder {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 161.7%;
    /* identical to box height, or 26px */

    color: #e0e0e0;
  }
`;
const commentLengthCount = css`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 161.7%;
  /* or 19px */

  color: #a9a9a9;
`;
const bottomActionDiv = css`
  flex: 0 1 40px;
  display: flex;
  flex-flow: column;
  width: 100%;
  gap: 10px;
`;
