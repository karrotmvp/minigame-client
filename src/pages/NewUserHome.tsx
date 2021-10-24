/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  emphasizedTextStyle,
  largeTextStyle,
  mediumTextStyle,
} from 'styles/textStyle';
import Button from '../components/buttons/Button';
import IndividualLeaderboard from '../components/leaderboard/IndividualLeaderboard';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { useHistory } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { Analytics, useAnalytics } from 'services/analytics';
import { useKarrotMarketMini } from 'services/karrotMarketMini';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { getMini } from 'services/karrotMarket/mini';
import useUserData from 'hooks/useUserData';

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
  height: calc(100% - 2.75rem);
`;
const headingWrapper = css`
  padding: 20px 26px 20px; ;
`;
const leaderboardWrapper = css`
  flex: 1;

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
`;

const NewUserHome = () => {
  let history = useHistory();
  const analytics = useAnalytics();
  const karrotRaiseApi = useKarrotRaiseApi();
  const karrotMarketMini = useKarrotMarketMini();
  const { accessToken, userRegionId, userDistrictName, onUpdateAccessToken } =
    useUserData();

  const trackUser = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi, analytics: Analytics) => {
      try {
        const response = await karrotRaiseApi.getUserInfo();
        if (response.isFetched === true && response.data) {
          const { id } = response.data.data;
          analytics.setUserId(id);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getAccessToken = useCallback(
    async (karrotRaiseApi, code: string | null, regionId: string) => {
      try {
        if (code !== null) {
          const response = await karrotRaiseApi.postOauth2({
            code: code,
            regionId: regionId,
          });
          if (response.isFetched && response.data) {
            const { accessToken } = response.data.data;
            window.localStorage.setItem('ACCESS_TOKEN', accessToken);
          }
        } else {
          throw new Error('Either code OR regionId is null');
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const runOnSuccess = (code: string) => {
    getAccessToken(karrotRaiseApi, code, regionId);
    trackUser(karrotRaiseApi, analytics);
    analytics.logEvent('click_game_start_button', { type: 'new_user' });
    history.push('/game');
  };
  const handleNewUserAgreement = function () {
    // bypass mini preset in Web environment
    if (getMini().environment === 'Web') {
      history.push('/game');
    }
    karrotMarketMini.startPreset(runOnSuccess);
  };
  useEffect(() => {
    analytics.logEvent('view_new_user_home_page');
  }, [analytics]);
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
            <span css={emphasizedTextStyle}>{userDistrictName} 이웃</span>님,
            아직 기록이 없어요
          </h1>
          <h2 css={mediumTextStyle}>
            당근을 수확하고 이웃들에게 한 마디 남겨봐요!
          </h2>
        </div>
        <div css={leaderboardWrapper}>
          <IndividualLeaderboard />
        </div>
        <div css={actionItemWrapper}>
          <Button
            size={`large`}
            color={`primary`}
            text={`게임 시작`}
            onClick={handleNewUserAgreement}
          />
        </div>
      </div>
    </>
  );
};

export default NewUserHome;
