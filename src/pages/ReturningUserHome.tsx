/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import IconClose from 'assets/IconClose';
import DefaultUserRow from 'components/leaderboard/DefaultUserRow';
import TopUserRow from 'components/leaderboard/TopUserRow';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { sampleUserData } from 'sampleUserData';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';
import Button from 'components/Button';
import IndividualLeaderboard from 'components/leaderboard/IndividualLeaderboard';
import BackendService from 'services/backendService';
import { useEffect, useState } from 'react';
import { AppEjectionButton } from 'components/AppEjectionButton';
import { Link } from 'react-router-dom';

// nav
const customNav = css`
  left: 0;
  width: 100%;
  // height: 100%;
  top: 0;
  display: flex;
  width: 100%;
  height: 44px;
  padding: 0 0.5rem;
`;

const custonNavIcon = css`
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
//
const divStyle = css`
  display: flex;
  flex-flow: column;
  height: calc(100% - 2.75rem);
`;
const headingWrapper = css`
  flex: 1;
  padding: 20px 26px 20px; ;
`;
const leaderboardWrapper = css`
  overflow: auto;
  padding: 0 26px;
`;
const actionItemWrapper = css`
  display: flex;
  justify-content: center;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);

  text-decoration: none;
`;
const currentuserDataInfoRow = css`
  margin: 20px 0 10px;
`;
const initialState = {
  nickname: '',
  score: 0,
  rank: 0,
  comment: '',
};
const ReturningUserHome = () => {
  // console.log(townRankData);
  const [userData, setUserData] = useState(initialState);
  // const { push } = useNavigator();
  const handleGameStart = () => {
    // push(`/game`);
  };

  // const { nickname, score, rank, comment } = useSelector(
  //   (state: RootState) => ({
  //     nickname: state.userDataReducer.nickname,
  //     score: state.userDataReducer.score,
  //     rank: state.userDataReducer.rank,
  //     comment: state.userDataReducer.comment,
  //   })
  // );
  const getCurrentuserInfo = async () => {
    try {
      const response = await BackendService.getCurrentUserInfo();
      const responseData: any = response.data[`data`];
      return responseData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCurrentuserInfo().then((data) => {
      setUserData({
        nickname: data[`nickname`],
        score: data[`score`],
        rank: data[`rank`],
        comment: data[`comment`],
      });
    });
  }, []);
  return (
    <>
      {/* <ScreenHelmet title="홈" customCloseButton={<IconClose />} /> */}
      <div css={customNav}>
        <div css={custonNavIcon}>
          <AppEjectionButton />
        </div>
      </div>

      <div css={divStyle}>
        <div css={headingWrapper}>
          <h1 css={largeTextStyle}>
            <span css={emphasizedTextStyle}>{userData.nickname}</span>님은
            <br />
            우리동네에서
            <span css={emphasizedTextStyle}> {userData.rank}위</span>에요!
          </h1>
          <div css={currentuserDataInfoRow}>
            {userData.rank <= 10 ? (
              <TopUserRow
                rank={userData.rank}
                nickname={userData.nickname}
                score={userData.score}
                comment={userData.comment}
              />
            ) : (
              <DefaultUserRow
                rank={userData.rank}
                nickname={userData.nickname}
                score={userData.score}
              />
            )}
          </div>
        </div>
        <div css={leaderboardWrapper}>
          <IndividualLeaderboard />
        </div>
        <Link to="/game" css={actionItemWrapper}>
          <Button
            size={`large`}
            color={`primary`}
            text={`시작하기`}
            onClick={handleGameStart}
          />
        </Link>
      </div>
    </>
  );
};

export default ReturningUserHome;
