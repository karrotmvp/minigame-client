/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import { ReactComponent as Karrot } from 'assets/svg/KarrotClicker/small_circle_karrot.svg';
import { useCallback, useState } from 'react';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { OldButton, DisabledButton } from 'components/Button';
import { useNavigator } from '@karrotframe/navigator';
import { useCookies } from 'react-cookie';
import { useKarrotClickerData } from 'pages/KarrotClicker/hooks';
import { useUserData } from 'hooks';
const largeText = css`
  margin: 15px 0;
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

type Props = {
  rank: number;
  comment: string;
};
export const TopRank: React.FC<Props> = (props) => {
  const { push } = useNavigator();
  const [cookies] = useCookies();
  const [topUserComment, setTopUserComment] = useState({
    comment: props.comment,
    length: props.comment.length,
  });
  const karrotRaiseApi = useKarrotRaiseApi();
  const { score, rank, updateKarrotClickerData } = useKarrotClickerData();
  const { districtName } = useUserData();
  // Page navigation
  const goToLeaderboardPage = () => {
    push(`/karrot-clicker/leaderboard`);
  };

  const handleTopUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopUserComment({
      comment: e.target.value.slice(0, 19),
      length: e.target.value.length,
    });
  };
  const addComment = useCallback(async function (
    karrotRaiseApi: KarrotRaiseApi,
    accessToken: string,
    comment: string
  ) {
    const { status } = await karrotRaiseApi.patchUserComment(
      accessToken,
      comment
    );
    if (status === 200) {
      updateKarrotClickerData(score, rank, comment);
      // onUpdateUserData(userId, useruserName, userScore, userRank, comment);
      goToLeaderboardPage();
    }
  },
  []);

  return (
    <>
      <Karrot />
      <h1
        css={[largeTextStyle, largeText]}
        style={{ textAlign: 'center', flex: '0 1 auto' }}
      >
        <span css={emphasizedTextStyle}>축하해요!</span>
        <br />
        <span css={emphasizedTextStyle}>{props.rank}위</span>로 순위권에
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
            onChange={handleTopUserInput}
            value={topUserComment.comment}
            placeholder={`예) 내가 ${districtName}짱!`}
            maxLength={20}
          />
          <p css={commentLengthCount}>{topUserComment.length}/20</p>
        </div>

        {topUserComment.length > 0 ? (
          <OldButton
            size={`large`}
            color={`primary`}
            text={`등록하기`}
            onClick={() => {
              addComment(
                karrotRaiseApi,
                cookies.accessToken,
                topUserComment.comment
              );
            }}
          />
        ) : (
          <DisabledButton size={`large`} text={`등록하기`} />
        )}
      </div>
    </>
  );
};
