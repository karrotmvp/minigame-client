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

interface NonServiceUserState {
  isBack: boolean;
  districtName: string;
}
function App() {
  const [pageRedirection, setPageRedirection] = useState<string>('loading');
  const [nonServiceUser, setNonServiceUser] = useState<NonServiceUserState>({
    isBack: false,
    districtName: '',
  });

  const [karrotMarketMini, setKarrotMarketMini] = useState(
    emptyKarrotMarketMini
  );
  const [karrotRaiseApi, setKarrotRaiseApi] = useState(emptyKarrotRaiseApi);
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const {
    // userRegionId,
    // userDistrictId,
    // userDistrictName,
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
    async (
      karrotRaiseApi: KarrotRaiseApi,
      accessToken: string,
      analytics: Analytics
    ) => {
      try {
        const { data, status } = await karrotRaiseApi.getUserInfo(accessToken);
        if (status === 200) {
          const { id, nickname, score, rank, comment } = data;
          onUpdateUserData(id, nickname, score, rank, comment);
          analytics.setUserId(id);
          console.log('tracking user... id:', id);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const filterNonServiceTown = useCallback(
    async function (
      karrotRaiseApi: KarrotRaiseApi,
      code: string | null,
      regionId: string
    ) {
      try {
        console.log('workd?', regionId);
        const { data, status } = await karrotRaiseApi.getTownId(regionId);
        // console.log(data);
        // example -> city=서울특별시(name1) district=서초구(name2)
        if (status === 200) {
          const { id: districtId, name2: districtName } = data;
          console.log(districtId, districtName);
          onUpdateRegionData(regionId, districtId, districtName);
          // Filter out if user is not in our service area
          const openedDistricts = [
            '서초구',
            '송파구',
            '강남구',
            '강동구',
            '광진구',
          ];
          const isMyDistrictOpen = openedDistricts.indexOf(districtName + '');
          console.log(openedDistricts.indexOf(districtName), isMyDistrictOpen);
          if (isMyDistrictOpen === -1) {
            if (typeof code === 'string') {
              setNonServiceUser({ isBack: true, districtName: districtName });
            } else {
              setNonServiceUser({ isBack: false, districtName: districtName });
            }
            setPageRedirection('non-service-area');
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onUpdateRegionData]
  );
  const getAccessToken = useCallback(
    async function (
      karrotRaiseApi: KarrotRaiseApi,
      code: string | null,
      regionId: string,
      analytics: Analytics
    ): Promise<void> {
      // code !== null means user is a returning user
      console.log(regionId, 'accessstooken?');
      try {
        if (code !== null) {
          const { data, status } = await karrotRaiseApi.postOauth2(
            code,
            regionId
          );
          if (status === 200) {
            const { accessToken } = data;
            // window.localStorage.setItem('ACCESS_TOKEN', accessToken);
            onUpdateAccessToken(accessToken);
            trackUser(karrotRaiseApi, accessToken, analytics);
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

  useEffect(() => {
    try {
      analytics.logEvent('launch_app');
      const searchParams = new URLSearchParams(window.location.search);
      const code: string | null = searchParams.get('code');
      const regionId: any = searchParams.get('region_id');
      // What to do if region_id is null? (meaning the mini-app is not opened from karrot market app)
      // if (code === null) {
      //   code = 'testcode';
      // }
      // if (regionId === null) {
      //   regionId = 'df5370052b3c';
      // }
      // onUpdateRegionData(regionId, userDistrictId, userDistrictName);
      console.log(regionId);
      filterNonServiceTown(karrotRaiseApi, code, regionId);
      getAccessToken(karrotRaiseApi, code, regionId, analytics);
    } catch (error) {
      console.error(error);
    }
  }, [analytics, filterNonServiceTown, getAccessToken, karrotRaiseApi]);

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
                            districtName: nonServiceUser.districtName,
                            isNonServiceUserBack: nonServiceUser.isBack,
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
