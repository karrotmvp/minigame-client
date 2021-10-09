/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
import NewUserHome from './pages/NewUserHome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { useEffect, useState } from 'react';
import BackendService from 'services/backendService';
import ReturningUserHome from 'pages/ReturningUserHome';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

const appStyle = css`
  height: 100vh;
`;

function App() {
  const [isNewUser, setIsNewUser] = useState<boolean>(true);

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
    getCurrentuserInfo().then((data) => {
      if (data.score < 0) {
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
      }
    });
  }, []);
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
