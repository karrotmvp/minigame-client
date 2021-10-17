/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
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
// import { logEvent } from 'firebase/analytics';
// import { analytics } from 'services/firebase/firebaseConfig';
import ReturningUserHome from 'pages/ReturningUserHome';
import NonServiceArea from 'pages/NonServiceArea';
import {
  saveRegionId,
  saveTownId,
  saveTownName,
} from 'reducers/userDataReducer';
import BackendApi from 'services/backendApi/backendApi';

const appStyle = css`
  height: 100vh;
`;

function App() {
  const [pageRedirection, setPageRedirection] = useState<string>('loading');
  const [userTownData, setUserTownData] = useState<string[]>([]);
  const [isNonServiceUserBack, setIsNonServiceUserBack] = useState(false);
  const dispatch = useDispatch();

  const filterNonServiceTown = useCallback(
    async (code: string | null, regionId: string) => {
      const response = await BackendApi.getTownId({ regionId: regionId });
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
    },
    [dispatch]
  );
  const getAccessToken = useCallback(
    async (code: string | null, regionId: string) => {
      // code !== null means user is a returning user
      if (code !== null) {
        const response = await BackendApi.postOauth2({
          code: code,
          regionId: regionId,
        });
        if (response.isFetched && response.data) {
          const { accessToken } = response.data.data;
          console.log('access-token', accessToken);
          window.localStorage.setItem('ACCESS_TOKEN', accessToken);
          setPageRedirection('home');
        }
      } else {
        setPageRedirection('new-user-home');
      }
    },
    []
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userCode: string | null = searchParams.get('code');
    const userRegionId: any = searchParams.get('region_id');
    dispatch(saveRegionId(userRegionId));
    filterNonServiceTown(userCode, userRegionId);
    getAccessToken(userCode, userRegionId);
  }, [dispatch, filterNonServiceTown, getAccessToken]);

  return (
    <div css={appStyle}>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              console.log(`Redirect page to ${pageRedirection}`);
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
                <div>loading</div>
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
    </div>
  );
}

export default App;
