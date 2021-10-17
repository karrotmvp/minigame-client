/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
import NewUserHome from './pages/NewUserHome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { useEffect, useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logEvent } from 'firebase/analytics';
import { analytics } from 'services/firebase/firebaseConfig';
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

  async function filterNonServiceTown(code: string | null, regionId: any) {
    try {
      const { data } = await BackendApi.getTownId(regionId);
      // example -> city=서울특별시(name1) district=서초구(name2)
      const { id: districtId, name2: districtName } = data;
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
    } catch (error) {
      console.error(error);
    }
  }

  async function getAccessToken(code: string | null, regionId: string | null) {
    try {
      if (code !== null && regionId !== null) {
        const data = BackendApi.postOauth2({
          code: code,
          regionId: regionId,
        });
        return data;
      } else {
        throw new Error('Either code OR regionId is null');
      }
    } catch (error) {
      console.error('oops', error);
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userCode: string | null = searchParams.get('code');
    const userRegionId: string | null = searchParams.get('region_id');
    try {
      dispatch(saveRegionId(userRegionId));
      filterNonServiceTown(userCode, userRegionId);
      getAccessToken(userCode, userRegionId)
        .then((response) => {
          const accessToken = response.data.accessToken;
          console.log('Access token generated: ', accessToken);
          window.localStorage.setItem('ACCESS_TOKEN', accessToken);
          setPageRedirection('home');
        })
        .catch((error) => {
          console.error(
            'Access token generation failed, possibly no code exists (aka new user)',
            error
          );
          setPageRedirection('new-user-home');
        });
      // Promise.all([promise1, promise2]).then((values) => {
      //   console.log(values);
      // });
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                      townId: userTownData[0],
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
            render={(props) => <NonServiceArea {...props} />}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
