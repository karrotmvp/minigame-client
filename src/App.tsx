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
import { useDispatch } from 'react-redux';
// import { AnalyticsContext } from 'services/analytics';
import { emptyAnalytics } from 'services/analytics';
import {
  createFirebaseAnalytics,
  loadFromEnv as loadFirebaseAnalyticsConfig,
} from 'services/analytics/firebase';

import ReturningUserHome from 'pages/ReturningUserHome';
import NonServiceArea from 'pages/NonServiceArea';
import {
  saveRegionId,
  saveTownId,
  saveTownName,
} from 'reducers/userDataReducer';
import { trackUser } from 'services/firebase/trackUser';
import {
  emptyKarrotRaiseApi,
  KarrotRaiseApi,
  KarrotRaiseApiContext,
} from 'services/karrotRaiseApi';
import {
  createKarrotRaiseApi,
  loadFromEnv as loadKarrotRaiseApiConfig,
} from 'services/backendService/karrotRaiseApi';

const appStyle = css`
  height: 100vh;
`;

function App() {
  const [pageRedirection, setPageRedirection] = useState<string>('loading');
  const [userTownData, setUserTownData] = useState<string[]>([]);
  const [isNonServiceUserBack, setIsNonServiceUserBack] = useState(false);
  const dispatch = useDispatch();

  const [analytics, setAnalytics] = useState(emptyAnalytics);
  // Firebase Analytics가 설정되어 있으면 인스턴스를 초기화하고 교체합니다.
  useEffect(() => {
    try {
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
          dispatch(saveTownId(districtId));
          dispatch(saveTownName(districtName));
          setUserTownData([districtId, districtName]);
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
    [dispatch]
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
          if (response.isFetched && response.data) {
            const { accessToken } = response.data.data;
            window.localStorage.setItem('ACCESS_TOKEN', accessToken);
            await trackUser(karrotRaiseApi, analytics);
            setPageRedirection('home');
          }
        } else {
          setPageRedirection('new-user-home');
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userCode: string | null = searchParams.get('code');
    const userRegionId: any = searchParams.get('region_id');

    analytics.logEvent('app_launched');

    dispatch(saveRegionId(userRegionId));
    filterNonServiceTown(userCode, userRegionId);
    getAccessToken(userCode, userRegionId);
  }, [analytics, dispatch, filterNonServiceTown, getAccessToken]);

  return (
    <div css={appStyle}>
      {/* Create combined context provider */}
      <KarrotRaiseApiContext.Provider value={karrotRaiseApi}>
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
                            townName: userTownData[1],
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
      </KarrotRaiseApiContext.Provider>
    </div>
  );
}

export default App;
