/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import LoadingScreen from 'components/LoadingScreen';
import NewUserHome from './pages/NewUserHome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { useCallback, useEffect, useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import {
  Analytics,
  AnalyticsContext,
  emptyAnalytics,
} from 'services/analytics';
import {
  createFirebaseAnalytics,
  loadFromEnv as loadFirebaseAnalyticsConfig,
} from 'services/analytics/firebase';
import ReturningUserHome from 'pages/ReturningUserHome';
import NonServiceArea from 'pages/NonServiceArea';
import {
  emptyKarrotRaiseApi,
  KarrotRaiseApi,
  KarrotRaiseApiContext,
} from 'services/karrotRaiseApi';
import {
  createKarrotRaiseApi,
  loadFromEnv as loadKarrotRaiseApiConfig,
} from 'services/api/karrotRaise';
import {
  emptyKarrotMarketMini,
  KarrotMarketMiniContext,
} from 'services/karrotMarketMini';
import {
  createKarrotMarketMini,
  loadFromEnv as loadKarrotMarketMiniConfig,
} from 'services/karrotMarket/mini';
import useUserData from 'hooks/useUserData';

const appStyle = css`
  height: 100vh;
`;

function App() {
  const [pageRedirection, setPageRedirection] = useState<string>('loading');
  const [isNonServiceUserBack, setIsNonServiceUserBack] = useState(false);
  const [karrotMarketMini, setKarrotMarketMini] = useState(
    emptyKarrotMarketMini
  );
  const [karrotRaiseApi, setKarrotRaiseApi] = useState(emptyKarrotRaiseApi);
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const {
    userRegionId,
    userDistrictId,
    userDistrictName,
    onUpdateAccessToken,
    onUpdateRegionData,
    onUpdateUserData,
  } = useUserData();

  // Firebase Analytics가 설정되어 있으면 인스턴스를 초기화하고 교체합니다.
  useEffect(() => {
    try {
      // check analytics
      const config = loadFirebaseAnalyticsConfig();
      const analytics = createFirebaseAnalytics(config);
      setAnalytics(analytics);
    } catch {
      // noop
    }
  }, []);
  useEffect(() => {
    try {
      // check karrot-raise api
      const karrotRaiseApiConfig = loadKarrotRaiseApiConfig();
      const karrotRaiseApi = createKarrotRaiseApi(karrotRaiseApiConfig);
      setKarrotRaiseApi(karrotRaiseApi);
    } catch {
      // no-op
    }
  }, []);
  useEffect(() => {
    try {
      // check karrot-mini
      const karrotMarketMiniConfig = loadKarrotMarketMiniConfig();
      const karrotMarketMini = createKarrotMarketMini(karrotMarketMiniConfig);
      setKarrotMarketMini(karrotMarketMini);
    } catch (error) {
      console.error(error);
      // no-op
    }
  }, []);

  const trackUser = useCallback(
    async (karrotRaiseApi: KarrotRaiseApi, analytics: Analytics) => {
      try {
        const response = await karrotRaiseApi.getUserInfo();
        if (response.isFetched === true && response.data) {
          const { id, nickname, score, rank, comment } = response.data.data;
          console.log('tracking user... id:', id);
          analytics.setUserId(id);
          onUpdateUserData(id, nickname, score, rank, comment);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateUserData]
  );
  const filterNonServiceTown = useCallback(
    async function (
      karrotRaiseApi: KarrotRaiseApi,
      code: string | null,
      regionId: string
    ) {
      try {
        const response = await karrotRaiseApi.getTownId(regionId);
        // example -> city=서울특별시(name1) district=서초구(name2)
        if (response.isFetched && response.data) {
          const { id: districtId, name2: districtName } = response.data.data;
          onUpdateRegionData(userRegionId, districtId, districtName);
          // Filter out if user is not in 서초구
          // 서초구id = df5370052b3c
          if (districtId !== 'df5370052b3c') {
            if (code !== null || undefined) {
              setIsNonServiceUserBack(true);
            }
            setPageRedirection('non-service-area');
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateRegionData, userRegionId]
  );
  const getAccessToken = useCallback(
    async function (
      karrotRaiseApi: KarrotRaiseApi,
      code: string | null,
      regionId: string,
      analytics: Analytics
    ): Promise<void> {
      // code !== null means user is a returning user
      try {
        if (code !== null) {
          const response = await karrotRaiseApi.postOauth2(code, regionId);
          console.log(response);
          if (response.isFetched && response.data) {
            const { accessToken } = response.data.data;
            window.localStorage.setItem('ACCESS_TOKEN', accessToken);
            await trackUser(karrotRaiseApi, analytics);
            onUpdateAccessToken(accessToken);
            setPageRedirection('home');
          }
        } else {
          setPageRedirection('new-user-home');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateAccessToken, trackUser]
  );

  async function getQueryParams(targetUrl: string) {
    const searchParams = new URLSearchParams(targetUrl);
    const userCode: string | null = searchParams.get('code');
    const userRegionId: any = searchParams.get('region_id');
    return { userCode: userCode, userRegionId: userRegionId };
  }
  useEffect(() => {
    analytics.logEvent('launch_app');
    getQueryParams(window.location.search).then((response) => {
      let { userCode: code, userRegionId: regionId } = response;
      // What to do if region_id is null? (meaning the mini-app is not opened from karrot market app)
      // if (code === null) {
      //   code = 'testcode';
      // }
      // if (regionId === null) {
      //   regionId = 'df5370052b3c';
      // }
      onUpdateRegionData(regionId, userDistrictId, userDistrictName);
      filterNonServiceTown(karrotRaiseApi, code, regionId);
      getAccessToken(karrotRaiseApi, code, regionId, analytics);
    });
  }, [
    analytics,
    filterNonServiceTown,
    getAccessToken,
    karrotRaiseApi,
    onUpdateRegionData,
    userDistrictId,
    userDistrictName,
  ]);

  return (
    <div css={appStyle}>
      {/* Create combined context provider */}
      <KarrotRaiseApiContext.Provider value={karrotRaiseApi}>
        <AnalyticsContext.Provider value={analytics}>
          <KarrotMarketMiniContext.Provider value={karrotMarketMini}>
            <Router>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => {
                    return pageRedirection === 'non-service-area' ? (
                      <Redirect
                        to={{
                          pathname: '/non-service-area',
                          state: {
                            districtName: userDistrictName,
                            isNonServiceUserBack: isNonServiceUserBack,
                          },
                        }}
                      />
                    ) : pageRedirection === 'home' ? (
                      <Redirect to="/home" />
                    ) : pageRedirection === 'new-user-home' ? (
                      <Redirect to="/new-user-home" />
                    ) : (
                      <LoadingScreen />
                    );
                  }}
                />
                <Route exact path="/new-user-home">
                  <NewUserHome />
                </Route>
                <Route exact path="/home">
                  <ReturningUserHome />
                </Route>
                <Route exact path="/game">
                  <Game />
                </Route>
                <Route exact path="/leaderboard">
                  <Leaderboard />
                </Route>
                <Route
                  exact
                  path="/non-service-area"
                  render={(props: any) => <NonServiceArea {...props} />}
                />
              </Switch>
            </Router>
          </KarrotMarketMiniContext.Provider>
        </AnalyticsContext.Provider>
      </KarrotRaiseApiContext.Provider>
    </div>
  );
}

export default App;
