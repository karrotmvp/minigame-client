import styled from '@emotion/styled';
import { useNavigator } from '@karrotframe/navigator';
import { CloseIcon } from 'assets/Icon';
import { ActiveUserCount } from 'components/ActiveUserCount';
import { OldButton } from 'components/Button';
import { Nav } from 'components/Navigation/Nav';
import { useUserData } from 'hooks';
import { rem } from 'polished';
import { useEffect } from 'react';
import { useAnalytics } from 'services/analytics';
import { useKarrotClickerData } from '../hooks';
import { LeaderboardTabs } from '../Leaderboard/LeaderboardTabs';
import { DefaultUserRow, TopUserRow } from '../Leaderboard/LeaderboardTabs/Row';

interface UserScoreExistsProps {
  userName: string;
  rank: number;
  score: number;
  comment: string;
  districtName: string;
}
const UserScoreExists: React.FC<UserScoreExistsProps> = (props) => {
  return (
    <>
      {props.rank <= 10 ? (
        <TopUserRow
          me={true}
          rank={props.rank}
          userName={props.userName}
          score={props.score}
          comment={props.comment}
          districtName={props.districtName}
        />
      ) : (
        <DefaultUserRow
          me={true}
          rank={props.rank}
          userName={props.userName}
          score={props.score}
          districtName={props.districtName}
        />
      )}
    </>
  );
};

export const Home = () => {
  const { push } = useNavigator();
  const analytics = useAnalytics();
  const { userName, districtName } = useUserData();
  const { rank, score, comment } = useKarrotClickerData();
  const goToGamePage = () => {
    push(`/karrot-clicker/game`);
  };
  const handleGameStart = () => {
    analytics.logEvent('click_game_start_button', {
      user_type: 'returning_user',
    });
    goToGamePage();
  };

  useEffect(() => {
    // getUserData(karrotRaiseApi, accessToken);
    analytics.logEvent('view_returning_user_home_page');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // leave mini app
  const leaveMiniApp = () => {};
  return (
    <Page className="karrot-clicker-home-page">
      <Nav appendLeft={<CloseIcon />} />
      <Banner className="banner">
        {/* <BannerImage /> */}
        {/* <img src={BannerImage} /> */}
      </Banner>
      <MyRow>
        {
          rank !== null ? (
            <UserScoreExists
              userName={userName!}
              rank={rank!}
              score={score!}
              comment={comment!}
              districtName={districtName!}
            />
          ) : null
          // <UserScoreNull userName={useruserName} />
        }
      </MyRow>
      <LeaderboardTabs />
      <div
        style={{
          position: 'absolute',
          bottom: '90px',
          right: '24px',
          zIndex: 101,
        }}
      >
        <ActiveUserCount gameType="GAME_KARROT" />
      </div>
      <ActionItems>
        <OldButton
          size={`large`}
          color={`primary`}
          text={`게임 시작`}
          onClick={handleGameStart}
        />
      </ActionItems>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background: #faf5f4;
`;
const Banner = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 1rem;
  // width: 100px;
`;

const MyRow = styled.div`
  margin: 0 18px 12px;
`;
const ActionItems = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${rem(15)} ${rem(18)} ${rem(30)};
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;
