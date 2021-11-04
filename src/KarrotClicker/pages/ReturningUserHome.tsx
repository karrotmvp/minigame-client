/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import Button from 'KarrotClicker/components/buttons/Button';
import LeaderboardTabs from 'KarrotClicker/components/leaderboard/LeaderboardTabs';
import { useEffect } from 'react';
import { AppEjectionButton } from 'KarrotClicker/components/buttons/AppEjectionButton';
import { useAnalytics } from 'services/analytics';
import { useHistory } from 'react-router-dom';
// import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { DefaultUserRow } from 'KarrotClicker/components/leaderboard/DefaultRow';
import { TopUserRow } from 'KarrotClicker/components/leaderboard/TopRow';
import useUserData from 'KarrotClicker/hooks/useUserData';
import DailyUserCount from 'KarrotClicker/components/DailyUserCount';
import TopImageUrl from '../assets/images/background.png';
import mvpLogoUrl from '../assets/images/mvp_logo.png';

const PageContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background: #faf5f4;
`;
const Nav = styled.div`
  background-image: url(${TopImageUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center -10px;
  width: 100%;
  height: 220px;
  margin-bottom: -20px;
`;
const customNav = css`
  left: 0;
  width: 100%;
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
  opacity: 1;
  transition: opacity 300ms;
  width: 2.25rem;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
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
`;

// const Container = styled.div`
//   display: flex;
//   flex-flow: column;

//   padding: 12px 14px;
//   margin: 4px 0;
//   width: 100%;
//   border-radius: 10px;
//   border: 1px solid #ebe0db;
//   background-color: #fff;

//   color: #3f3f3f;
//   h1 {
//     font-style: normal;
//     font-weight: normal;
//     font-size: 20px;
//     line-height: 161.7%;
//     /* or 32px */

//     letter-spacing: -0.02em;
//   }
//   h2 {
//     font-style: normal;
//     font-weight: normal;
//     font-size: 16px;
//     line-height: 161.7%;
//     /* identical to box height, or 26px */

//     letter-spacing: -0.02em;
//   }
// `;

// interface UserScoreNullProps {
//   nickname: string;
// }
// const UserScoreNull: React.FC<UserScoreNullProps> = (props) => {
//   return (
//     <Container>
//       <h1>
//         <span
//           style={{
//             fontWeight: 'bold',
//             color: '#EB5D0E',
//           }}
//         >
//           {props.nickname}
//         </span>
//         님,
//         <br />
//         아직 기록이 없어요
//       </h1>
//       <h2>당근을 수확하고 이웃들에게 한 마디 남겨봐요!</h2>
//     </Container>
//   );
// };
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
      {props.rank <= 10 ? (
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

const ReturningUserHome = () => {
  const history = useHistory();
  const analytics = useAnalytics();
  // const karrotRaiseApi = useKarrotRaiseApi();
  const {
    accessToken,
    // userId,
    userDistrictName,
    userNickname,
    userScore,
    userRank,
    userComment,
    // onUpdateUserData,
  } = useUserData();

  const handleGameStart = () => {
    analytics.logEvent('click_game_start_button', {
      user_type: 'returning_user',
    });
    history.push('/game');
  };

  // const getUserData = useCallback(
  //   async (karrotRaiseApi: KarrotRaiseApi, accessToken: string) => {
  //     try {
  //       const {data} = await karrotRaiseApi.getUserInfo(accessToken);
  //       if (data) {
  //         const { nickname, score, rank, comment } = response.data.data;
  //         onUpdateUserData(userId, nickname, score, rank, comment);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   },
  //   [onUpdateUserData, userId]
  // );

  useEffect(() => {
    // getUserData(karrotRaiseApi, accessToken);
    analytics.logEvent('view_returning_user_home_page');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <PageContainer>
      <Nav>
        <div css={customNav}>
          <div css={customNavIcon}>
            <AppEjectionButton />
          </div>
          <img
            src={mvpLogoUrl}
            alt=""
            style={{
              marginRight: '15px',
            }}
          />
        </div>
      </Nav>

      <MyRow>
        {
          userRank !== null ? (
            <UserScoreExists
              nickname={userNickname}
              rank={userRank}
              score={userScore}
              comment={userComment}
              districtName={userDistrictName}
            />
          ) : null
          // <UserScoreNull nickname={userNickname} />
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
        <DailyUserCount />
      </div>
      <ActionItem>
        <Button
          size={`large`}
          color={`primary`}
          text={`게임 시작`}
          onClick={handleGameStart}
        />
      </ActionItem>
    </PageContainer>
  );
};

export default ReturningUserHome;
