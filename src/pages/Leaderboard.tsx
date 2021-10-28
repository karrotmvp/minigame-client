/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
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
const PageContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background: #faf5f4;
`;
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
  padding: 0 15px;
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

const Heading = styled.div`
  margin: 0 26px 20px;

  font-family: Cafe24SsurroundAir;
  font-size: 22px;
  font-style: normal;
  line-height: 161.7%;
  /* or 36px */

  letter-spacing: -0.02em;

  color: #3f3f3f;
`;

const EmphasizedSpan = styled.span`
  font-family: Cafe24Ssurround;
  font-weight: bold;

  color: #eb5d0e;
`;
const MyRow = styled.div`
  margin: 0 18px 12px;
`;

const ActionItem = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  gap: 15px;
  justify-content: space-between;
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
    history.push('/game');
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
        const { data } = await karrotRaiseApi.getUserInfo(accessToken);
        if (data) {
          const { nickname, score, rank, comment } = data;
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
        history.push('/game' /* the "new" state */);
      }
    };
  }, [history, onResetCount]);
  return (
    <PageContainer>
      <div css={customNav}>
        <div css={customNavIcon}>
          <AppEjectionButton />
        </div>
      </div>
      <Heading>
        <EmphasizedSpan>{userNickname}</EmphasizedSpan>님은
        <br />
        {userDistrictName}에서
        <EmphasizedSpan> {userRank}위</EmphasizedSpan>
        에요!
      </Heading>

      <MyRow>
        {userRank <= 10 ? (
          <TopUserRow
            me={true}
            rank={userRank}
            nickname={userNickname}
            score={userScore}
            comment={userComment}
            districtName={userDistrictName}
          />
        ) : (
          <DefaultUserRow
            me={true}
            rank={userRank}
            nickname={userNickname}
            score={userScore}
            districtName={userDistrictName}
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
    </PageContainer>
  );
};

export default Leaderboard;
