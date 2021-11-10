import styled from '@emotion/styled';
import { useCallback, useEffect } from 'react';
import { useAnalytics } from 'services/analytics';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import useClickCounter from 'pages/KarrotClicker/hooks/useClickCounter';
import { OldButton } from 'components/Button';
import { DefaultUserRow, TopUserRow } from './LeaderboardTabs/Row';
import { LeaderboardTabs } from './LeaderboardTabs';
import { useMini, useUserData } from 'hooks';
import { useMyKarrotClickerData } from '../hooks';
import { useMinigameApi } from 'services/api/minigameApi';
import { Nav } from 'components/Navigation/Nav';
import { CloseIcon } from 'assets/Icon';

export const Leaderboard = () => {
  const { push, pop } = useNavigator();
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const karrotMarketMini = useMini();
  const { userName, districtName } = useUserData();
  const { gameType, score, rank, comment, updateMyKarrotClickerData } =
    useMyKarrotClickerData();
  const { onResetCount } = useClickCounter();

  // Page navigation
  const goToGamePage = () => {
    pop();
  };
  const leaveMiniApp = () => {
    karrotMarketMini.ejectApp();
    analytics.logEvent('click_leave_mini_app_button');
    console.log(`${analytics.logEvent('click_leave_mini_app_button')}`);
  };

  const handlePlayAgain = async () => {
    analytics.logEvent('click_game_play_again_button', {
      game_type: 'karrot-clicker',
    });
    console.log(
      `${analytics.logEvent('click_game_play_again_button', {
        game_type: 'karrot-clicker',
      })}`
    );
    // onResetCount();
    goToGamePage();
  };

  const handleShare = () => {
    const url = 'https://daangn.onelink.me/HhUa/3a219555';
    const text =
      '우리동네에서 나는 몇 등? 당근모아를 플레이 하고 동네 이웃들에게 한 마디를 남겨보세요!';
    karrotMarketMini.shareApp(url, text);
    analytics.logEvent('click_share_button', {
      game_type: 'karrot-clicker',
    });
    console.log(
      `${analytics.logEvent('click_share_button', {
        game_type: 'karrot-clicker',
      })}`
    );
  };

  const getMyData = useCallback(async () => {
    const {
      data: { data },
    } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
    if (data) {
      updateMyKarrotClickerData(data.score, data.rank, data.comment);
    }
  }, [gameType, minigameApi.gameUserApi, updateMyKarrotClickerData]);

  useEffect(() => {
    if (isTop) {
      getMyData();
      analytics.logEvent('view_leaderboard_page', {
        game_type: 'karrot-clicker',
      });
      console.log(
        `${analytics.logEvent('view_leaderboard_page', {
          game_type: 'karrot-clicker',
        })}`
      );
    }
  }, []);
  return (
    <Page className="">
      <Nav appendLeft={<CloseIcon />} onClickLeft={leaveMiniApp} />
      <Heading>
        <EmphasizedSpan>{userName}</EmphasizedSpan>님은
        <EmphasizedSpan> {rank}위</EmphasizedSpan>
        에요!
      </Heading>

      <MyRow>
        {rank! <= 10 ? (
          <TopUserRow
            me={true}
            rank={rank}
            userName={userName}
            score={score}
            comment={comment}
            districtName={districtName!}
          />
        ) : (
          <DefaultUserRow
            me={true}
            rank={rank}
            userName={userName}
            score={score}
            districtName={districtName}
          />
        )}
      </MyRow>

      <LeaderboardTabs />

      <ActionItem>
        <OldButton
          size={`medium`}
          color={`secondary`}
          text={`다시하기`}
          onClick={handlePlayAgain}
        />
        <OldButton
          size={`medium`}
          color={`primary`}
          text={`초대하기`}
          onClick={handleShare}
        />
      </ActionItem>
    </Page>
  );
};

// nav
const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background: #faf5f4;
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
