/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { largeTextStyle, emphasizedTextStyle } from 'styles/textStyle';
import Button from 'components/buttons/Button';
import { DefaultUserRow } from 'components/leaderboard/DefaultRow';
import { TopUserRow } from 'components/leaderboard/TopRow';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAnalytics } from 'services/analytics';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { useKarrotMarketMini } from 'services/karrotMarketMini';
import LeaderboardTabs from 'components/leaderboard/LeaderboardTabs';
import useUserData from 'hooks/useUserData';
import useClickCounter from 'hooks/useClickCounter';

// nav
const customNav = css`
  left: 0;
  width: 100%;
  top: 0;
  display: flex;
  width: 100%;
  height: 44px;
  padding: 0 0.5rem;
`;
const customNavIcon = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: opacity 300ms;
  width: 2.25rem;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;
// main div
const divStyle = css`
  display: flex;
  flex-flow: column;
  height: calc(100% - 2.75rem);
`;
// heading
const headingWrapper = css`
  padding: 20px 26px 20px;
`;
// refresh

// leaderboard
const leaderboardWrapper = css`
  flex: 1;
  overflow: auto;
  padding: 0 26px;
`;
// action
const actionItemWrapper = css`
  display: flex;
  gap: 15px;
  justify-content: space-between;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;
const currentUserInfoRow = css`
  margin: 20px 0 10px;
`;

const Leaderboard = () => {
  const history = useHistory();
  const analytics = useAnalytics();
  const karrotRaiseApi = useKarrotRaiseApi();
  const karrotMarketMini = useKarrotMarketMini();
  const {
    accessToken,
    userId,
    userDistrictName,
    userNickname,
    userScore,
    userRank,
    userComment,
    onUpdateUserData,
  } = useUserData();
  const { onResetCount } = useClickCounter();
  const handlePlayAgain = async () => {
    analytics.logEvent('click_game_play_again_button');
    onResetCount();
    history.replace('/game');
  };

  const handleShare = async () => {
    analytics.logEvent('click_share_button');
    const url = 'https://daangn.onelink.me/HhUa/3a219555';
    const text =
      '우리동네에서 나는 몇 등? 당근모아를 플레이 하고 동네 이웃들에게 한 마디를 남겨보세요!';
    karrotMarketMini.share(url, text);
  };

  const getUserData = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi, accessToken: string) => {
      try {
        const response = await karrotRaiseApi.getUserInfo(accessToken);
        if (response.isFetched && response.data) {
          const { nickname, score, rank, comment } = response.data.data;
          onUpdateUserData(userId, nickname, score, rank, comment);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateUserData, userId]
  );

  useEffect(() => {
    analytics.logEvent('view_leaderboard_page');
    getUserData(karrotRaiseApi, accessToken);
  }, [accessToken, analytics, getUserData, karrotRaiseApi]);

  useEffect(() => {
    return () => {
      if (history.action === 'POP') {
        onResetCount();
        history.replace('/game' /* the "new" state */);
      }
    };
  }, [history, onResetCount]);
  return (
    <>
      <div css={customNav}>
        <div css={customNavIcon}>
          <AppEjectionButton />
        </div>
      </div>
      <div css={divStyle}>
        <div css={headingWrapper}>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>{userNickname}</span>님은
            <br />
            {userDistrictName}에서
            <span css={emphasizedTextStyle}> {userRank}위</span>
            에요!
          </h1>
          <div css={currentUserInfoRow}>
            {userRank <= 10 ? (
              <TopUserRow
                rank={userRank}
                nickname={userNickname}
                score={userScore}
                comment={userComment}
              />
            ) : (
              <DefaultUserRow
                rank={userRank}
                nickname={userNickname}
                score={userScore}
              />
            )}
          </div>
        </div>

        <div css={leaderboardWrapper}>
          <LeaderboardTabs />
        </div>
        <div css={actionItemWrapper}>
          <Button
            size={`medium`}
            color={`secondary`}
            text={`자랑하기`}
            onClick={handleShare}
          />
          <Button
            size={`medium`}
            color={`primary`}
            text={`다시하기`}
            onClick={handlePlayAgain}
          />
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
