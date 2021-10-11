/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
import NewUserHome from './pages/NewUserHome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { useEffect, useState } from 'react';
import BackendService from 'services/backendService';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserScore } from 'reducers/userDataReducer';
import { getMini } from 'api/mini';
import ReturningUserHome from 'pages/ReturningUserHome';
const axios = require('axios').default;

const appStyle = css`
  height: 100vh;
`;

function App() {
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const dispatch = useDispatch();

  const getCurrentuserInfo = async () => {
    try {
      const response = await BackendService.getCurrentUserInfo();
      const responseData: any = response.data[`data`];
      return responseData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCurrentuserInfo()
      .then((data) => {
        console.log(data);
        dispatch(updateUserScore(data.score));
        if (data.score > 0) {
          setIsNewUser(false);
        } else {
          setIsNewUser(true);
        }
      })
      .catch((error) => {
        console.log(error);
        const mini = getMini();
        mini.startPreset({
          preset:
            'https://mini-assets.kr.karrotmarket.com/presets/common-login/alpha.html',
          params: {
            appId: `${process.env.REACT_APP_APP_ID}`,
          },
          onSuccess: function (result) {
            if (result && result.code) {
              console.log(result);
              console.log(`code: ${result.code}`);
              axios
                .post(
                  `${process.env.REACT_APP_BASE_URL}/oauth`,
                  {
                    code: result.code,
                    regionId: `9bdfe83b68f3`,
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
                  console.log(response);
                });
            }
          },
        });
      });
  }, [dispatch]);

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
