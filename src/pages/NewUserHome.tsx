/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Button from '../components/buttons/Button';
import { AppEjectionButton } from 'components/buttons/AppEjectionButton';
import { useHistory } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { Analytics, useAnalytics } from 'services/analytics';
// import { useKarrotMarketMini } from 'services/karrotMarketMini';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';
import { getMini } from 'services/karrotMarket/mini';
import LeaderboardTabs from 'components/leaderboard/LeaderboardTabs';
import useUserData from 'hooks/useUserData';
import DailyUserCount from 'components/DailyUserCount';
import TopImageUrl from 'assets/images/background.png';
import mvpLogoUrl from 'assets/images/mvp_logo.png';
import { loadFromEnv as KarrotMiniPreset } from 'services/karrotMarket/mini';
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
  // const karrotMarketMini = useKarrotMarketMini();
  const { userRegionId, onUpdateAccessToken } = useUserData();

  const mini = getMini();
  console.log(userRegionId);
  const trackUser = useCallback(
    async (
      karrotRaiseApi: KarrotRaiseApi,
      accessToken: string,
      analytics: Analytics
    ) => {
      try {
        const { data, status } = await karrotRaiseApi.getUserInfo(accessToken);
        if (status === 200) {
          const { id } = data;
          analytics.setUserId(id);
          console.log('tracking new-user... id:', id);
        } else {
          throw new Error('response data from getUserInfo api is undefined');
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getAccessToken = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi, code: string, regionId: string) => {
      try {
        console.log(code, regionId, 'beforeapi');
        const { data, status } = await karrotRaiseApi.postOauth2(
          code,
          regionId
        );
        if (status === 200) {
          const { accessToken } = data;
          console.log(accessToken);
          // window.localStorage.setItem('ACCESS_TOKEN', accessToken);
          onUpdateAccessToken(accessToken);
          return accessToken;
        } else {
          throw new Error('Either code OR regionId is null');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateAccessToken]
  );

  const handleNewUserAgreement = async function (
    karrotRaiseApi: KarrotRaiseApi,
    userRegionId: string,
    analytics: Analytics
  ) {
    // bypass mini preset in Web environment
    if (getMini().environment === 'Web') {
      history.push('/game');
    } else {
      analytics.logEvent('click_karrot_mini_preset', {
        user_type: 'new_user',
      });
      const presetUrl = KarrotMiniPreset().presetUrl;
      const appId = KarrotMiniPreset().appId;
      mini.startPreset({
        preset: presetUrl!,
        params: {
          appId: appId!,
        },
        onSuccess: async function (result: any) {
          if (result && result.code) {
            try {
              const accessToken = await getAccessToken(
                karrotRaiseApi,
                result.code,
                userRegionId
              );
              if (accessToken) {
                await trackUser(karrotRaiseApi, accessToken, analytics);
                analytics.logEvent('click_game_start_button', {
                  user_type: 'new_user',
                });
                history.push('/game');
              }
            } catch (error) {
              console.error(error);
            }
          }
        },
      });
    }
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
          <img src={mvpLogoUrl} alt="" style={{ marginRight: '15px' }} />
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
          onClick={() =>
            handleNewUserAgreement(karrotRaiseApi, userRegionId, analytics)
          }
        />
      </ActionItem>
    </PageContainer>
  );
};

export default NewUserHome;
