/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

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
  // position: fixed;
  left: 0;
  width: 100%;
  // top: 0;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 30px;
  background: transparent;
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
const divStyle = css`
  display: flex;
  flex-flow: column;
  height: 100%;
  // overflow: hidden;
  background: #faf5f4;
`;

const Heading = styled.div`
  margin: 0 26px 20px;
`;
const MyRow = styled.div`
  margin: 0 18px 12px;
`;

const ActionItem = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 0;
  display: flex;
  gap: 15px;
  justify-content: space-between;
  width: 100%;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
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
      <div css={divStyle}>
        <div css={customNav}>
          <div css={customNavIcon}>
            <AppEjectionButton />
          </div>
        </div>
        <Heading>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>{userNickname}</span>님은
            <br />
            {userDistrictName}에서
            <span css={emphasizedTextStyle}> {userRank}위</span>
            에요!
          </h1>
        </Heading>

        <MyRow>
          {userRank <= 10 ? (
            <TopUserRow
              me={true}
              rank={userRank}
              nickname={userNickname}
              score={userScore}
              comment={userComment}
            />
          ) : (
            <DefaultUserRow
              me={true}
              rank={userRank}
              nickname={userNickname}
              score={userScore}
            />
          )}
        </MyRow>

        <LeaderboardTabs />

        <ActionItem>
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
        </ActionItem>
      </div>
    </>
  );
};

export default Leaderboard;
