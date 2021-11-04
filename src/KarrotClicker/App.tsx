/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
// import 'app.css';
import LoadingScreen from 'KarrotClicker/components/LoadingScreen';
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
import ReturningUserHome from 'KarrotClicker/pages/ReturningUserHome';
import NonServiceArea from 'KarrotClicker/pages/NonServiceArea';
import {
  emptyKarrotRaiseApi,
  KarrotRaiseApi,
  KarrotRaiseApiContext,
} from 'KarrotClicker/services/karrotRaiseApi';
import {
  createKarrotRaiseApi,
  loadFromEnv as loadKarrotRaiseApiConfig,
} from 'KarrotClicker/services/api/karrotRaise';
import {
  emptyKarrotMarketMini,
  KarrotMarketMiniContext,
} from 'services/karrotMarketMini';
import {
  createKarrotMarketMini,
  getMini,
  loadFromEnv as loadKarrotMarketMiniConfig,
} from 'services/karrotMarket/mini';
import useUserData from 'KarrotClicker/hooks/useUserData';

const appStyle = css`
  height: 100vh;
`;

interface NonServiceUserState {
  isBack: boolean;
  districtName: string;
}
export const KarrotClickerApp = () => {
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
          console.log('tracking returning-user... id:', id);
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
        const { data, status } = await karrotRaiseApi.getTownId(regionId);
        // example -> city=서울특별시(name1) district=서초구(name2)
        if (status === 200) {
          const { id: districtId, name2: districtName } = data;
          console.log(districtId, districtName);
          onUpdateRegionData(regionId, districtId, districtName);
          // Filter out if user is not in our service area
          // 서초, 송파, 광진, 강남, 강동 in order
          const openedDistricts = [
            'df5370052b3c',
            'edc00a5031fe',
            '264e8b88eaa1',
            '9bdfe83b68f3',
            '072985998dd4',
          ];
          const isMyDistrictOpen = openedDistricts.indexOf(districtId);
          console.log(isMyDistrictOpen, districtName);
          if (isMyDistrictOpen === -1) {
            if (typeof code === 'string') {
              setNonServiceUser({ isBack: true, districtName: districtName });
            } else {
              setNonServiceUser({ isBack: false, districtName: districtName });
            }
            setPageRedirection('non-service-area');
          } else {
            getAccessToken(karrotRaiseApi, code, regionId, analytics);
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
      try {
        if (code !== null) {
          const { data, status } = await karrotRaiseApi.postOauth2(
            code,
            regionId
          );
          if (status === 200) {
            const { accessToken } = data;
            console.log(accessToken, 'accessst   ooken');
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
      console.log('mini environment check,', getMini().environment);
      if (getMini().environment === 'Web') {
        setPageRedirection('home');
      }
      filterNonServiceTown(karrotRaiseApi, code, regionId);
    } catch (error) {
      console.error(error);
    }
  }, [analytics, filterNonServiceTown, karrotRaiseApi]);

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
                  path="/s"
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
};
