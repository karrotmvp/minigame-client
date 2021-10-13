/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
import NewUserHome from './pages/NewUserHome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logEvent } from 'firebase/analytics';
import { analytics } from 'services/firebase/firebaseConfig';
import ReturningUserHome from 'pages/ReturningUserHome';

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
          `${process.env.REACT_APP_BASE_URL}/oauth`,
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
          window.localStorage.setItem(
            'ACCESS_TOKEN',
            response.data[`data`][`accessToken`]
          );
          setIsNewUser(false);
        });
    } else {
      setIsNewUser(true);
      console.log('direct to new-user-home');
    }
  }, [dispatch, isNewUser]);
  console.log(isNewUser);

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
        </Switch>
      </Router>
    </div>
  );
}

export default App;
