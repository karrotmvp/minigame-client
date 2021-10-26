/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Button from '../components/buttons/Button';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { useHistory } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { Analytics, useAnalytics } from 'services/analytics';
import { useKarrotMarketMini } from 'services/karrotMarketMini';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { getMini } from 'services/karrotMarket/mini';
import LeaderboardTabs from 'components/leaderboard/LeaderboardTabs';
import useUserData from 'hooks/useUserData';
import DailyUserCount from 'components/DailyUserCount';
import TopImageUrl from 'assets/background.png';

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
  background-position: center center;
  width: 100%;
  height: 220px;
  margin-bottom: -5px;
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

const ActionItem = styled.div`
  // position: fixed;
  // bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 24px 34px;
  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
`;

const NewUserHome = () => {
  let history = useHistory();
  const analytics = useAnalytics();
  const karrotRaiseApi = useKarrotRaiseApi();
  const karrotMarketMini = useKarrotMarketMini();
  const { accessToken, userRegionId, onUpdateAccessToken } = useUserData();

  const trackUser = useCallback(
    async (
      karrotRaiseApi: KarrotRaiseApi,
      accessToken: string,
      analytics: Analytics
    ) => {
      try {
        const response = await karrotRaiseApi.getUserInfo(accessToken);
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
            onUpdateAccessToken(accessToken);
          }
        } else {
          throw new Error('Either code OR regionId is null');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateAccessToken]
  );

  const runOnSuccess = (code: string) => {
    getAccessToken(karrotRaiseApi, code, userRegionId);
    trackUser(karrotRaiseApi, accessToken, analytics);
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
    <PageContainer>
      <Nav>
        <div css={customNav}>
          <div css={customNavIcon}>
            <AppEjectionButton />
          </div>
        </div>
      </Nav>

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
          onClick={handleNewUserAgreement}
        />
      </ActionItem>
    </PageContainer>
  );
};

export default NewUserHome;
