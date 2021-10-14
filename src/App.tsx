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

const axios = require('axios').default;

const appStyle = css`
  height: 100vh;
`;

function App() {
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userCode = searchParams.get('code');
    const userRegionId = searchParams.get('region_id');
    logEvent(analytics, 'app_launched');
    if (userCode !== null && userRegionId !== null) {
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL_PRODUCTION}/oauth`,
          {
            code: userCode,
            regionId: userRegionId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response: any) => {
          // redirect if townid !== 서초구 (df5370052b3c)
          console.log(response);
          if (response.data) {
            return (
              <Redirect
                to={{
                  pathname: '/non-service-area',
                  state: { townid: 'testId', townName: 'testName' },
                }}
              />
            );
          }
          // returning user if townid === 서초구
          else if (response.data) {
            window.localStorage.setItem(
              'ACCESS_TOKEN',
              response.data[`data`][`accessToken`]
            );
            setIsNewUser(false);
          }
          // new user in 서초구
          else {
            setIsNewUser(true);
            console.log('direct to new-user-home');
          }
        })
        .catch((error: any) => console.error(error));
    }
  }, [dispatch, isNewUser]);

  return (
    <div css={appStyle}>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            component={
              isNewUser ? () => <NewUserHome /> : () => <ReturningUserHome />
            }
          />
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
