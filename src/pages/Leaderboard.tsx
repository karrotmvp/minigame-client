/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { largeTextStyle, emphasizedTextStyle } from 'styles/textStyle';
import Button from 'components/buttons/Button';
import DefaultUserRow from 'components/leaderboard/DefaultUserRow';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from 'reducers/counterReducer';
import TopUserRow from 'components/leaderboard/TopUserRow';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAnalytics } from 'services/analytics';

import { RootState } from 'reducers/rootReducer';
import { getMini } from 'services/karrotmarket/mini';
import BackendApi from 'services/backendApi/backendApi';
import { useKarrotRaiseApi } from 'services/karrotRaiseApi';

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

const initialState = {
  nickname: '서초구 이웃',
  score: 0,
  rank: 99999,
  comment: '',
};

const Leaderboard = () => {
  const [userData, setUserData] = useState(initialState);
  const history = useHistory();
  const dispatch = useDispatch();
  const analytics = useAnalytics();

  const { townName } = useSelector((state: RootState) => ({
    townName: state.userDataReducer.townName,
  }));
  const karrotRaiseApi = useKarrotRaiseApi();

  const handlePlayAgain = async () => {
    analytics.logEvent('game_play_again');
    dispatch(reset());
    history.replace('/game');
  };

  // Share must be triggered by "user activation"
  const handleShare = async () => {
    analytics.logEvent('share');
    const mini = getMini();
    mini.share({
      url: 'https://daangn.onelink.me/HhUa/3a219555',
      text: '당근모아를 플레이 하고 동네 이웃들에게 한 마디를 남겨보세요!',
    });
  };

  const getUserData = useCallback(async function (karrotRaiseApi) {
    try {
      const response = await karrotRaiseApi.getUserInfo();
      if (response.isFetched && response.data) {
        const { nickname, score, rank, comment } = response.data.data;
        setUserData({
          nickname: nickname,
          score: score,
          rank: rank,
          comment: comment,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getUserData(karrotRaiseApi);
  }, [getUserData, karrotRaiseApi]);

  useEffect(() => {
    return () => {
      if (history.action === 'POP') {
        history.replace('/game' /* the new state */);
        dispatch(reset());
      }
    };
  }, [dispatch, history]);
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
            <span css={emphasizedTextStyle}>{userData.nickname}</span>님은
            <br />
            {townName}에서
            <span css={emphasizedTextStyle}> {userData.rank}위</span>
            에요!
          </h1>
          <div css={currentUserInfoRow}>
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
