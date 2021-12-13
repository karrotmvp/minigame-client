import styled from '@emotion/styled';
import { useCallback, useEffect } from 'react';
import { useAnalytics } from 'services/analytics';
import { useCurrentScreen, useNavigator } from '@karrotframe/navigator';
import { OldButton } from 'components/Button';
import { DefaultUserRow, TopUserRow } from './LeaderboardTabs/Row';
import { LeaderboardTabs } from './LeaderboardTabs';
import { useMini, useUser } from 'hooks';
import { useMyKarrotClickerData } from '../hooks';
import { useMinigameApi } from 'services/api/minigameApi';
import { Nav } from 'components/Navigation/Nav';
import { ReactComponent as IconClose } from 'assets/icon/svg/icon_close.svg';
import { useGame } from '../Game/hooks';
import { rem } from 'polished';
interface UserScoreExistsProps {
  nickname: string;
  rank: number;
  score: number;
  comment: string;
  districtName: string;
}
const UserScoreExists: React.FC<UserScoreExistsProps> = (props) => {
  return (
    <>
      {props.rank === 0 ? null : props.rank <= 10 ? (
        <TopUserRow
          me={true}
          rank={props.rank}
          nickname={props.nickname}
          score={props.score}
          comment={props.comment}
          districtName={props.districtName}
        />
      ) : (
        <DefaultUserRow
          me={true}
          rank={props.rank}
          nickname={props.nickname}
          score={props.score}
          districtName={props.districtName}
        />
      )}
    </>
  );
};

export const Leaderboard = () => {
  const { push, replace } = useNavigator();
  const { isTop } = useCurrentScreen();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const karrotMarketMini = useMini();
  const { user, town } = useUser();
  const { gameType, score, rank, comment, updateMyKarrotClickerData } =
    useMyKarrotClickerData();
  const { onResetCount, resumeGame } = useGame();

  // Page navigation
  const goToGamePage = () => {
    replace(`/karrot-clicker/game`);
  };
  const goBackToPlatform = () => {
    analytics.logEvent('click_leave_game_button', {
      game_type: 'karrot_clicker',
      location: 'leaderboard_page',
    });
    push(`/`);
  };

  const handlePlayAgain = async () => {
    analytics.logEvent('click_game_play_again_button', {
      game_type: 'karrot_clicker',
    });

    goToGamePage();
    onResetCount();
    resumeGame();
  };

  const handleShare = () => {
    const url = 'https://daangn.onelink.me/HhUa/8db9923d';
    const text = `${user.nickname}님은 당근모아에서 전국 ${rank}등!`;
    karrotMarketMini.shareApp(url, text);
    analytics.logEvent('click_share_button', {
      game_type: 'karrot_clicker',
      location: 'leaderboard_page',
    });
  };

  const getMyData = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await minigameApi.gameUserApi.getMyRankInfoUsingGET(gameType);
      if (data) {
        if (data.score && data.rank) {
          updateMyKarrotClickerData(data.score, data.rank);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [gameType, minigameApi.gameUserApi, updateMyKarrotClickerData]);

  useEffect(() => {
    if (isTop) {
      getMyData();
      analytics.logEvent('view_leaderboard_page', {
        game_type: 'karrot_clicker',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, isTop]);
  return (
    <Page className="">
      <Nav appendLeft={<IconClose />} onClickLeft={goBackToPlatform} />
      {score === 0 ? null : (
        <Heading>
          <EmphasizedSpan>{user.nickname}</EmphasizedSpan>님은
          <EmphasizedSpan> {rank}위</EmphasizedSpan>
          에요!
        </Heading>
      )}

      <MyRow>
        {score === 0 ? null : (
          <UserScoreExists
            nickname={user.nickname as string}
            rank={rank}
            score={score}
            comment={comment}
            districtName={town.name2 as string}
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
  font-size: ${rem(22)};
  font-style: normal;
  line-height: 161.7%;
  /* or 36px */

  letter-spacing: -0.02em;

  color: #3f3f3f;
`;

const EmphasizedSpan = styled.span`
  font-family: Cafe24Ssurround;
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(22)};
  line-height: 161.7%;
  /* or 36px */

  letter-spacing: -0.02em;

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
