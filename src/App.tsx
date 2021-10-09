/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
import NewUserHome from './pages/NewUserHome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { Navigator, Screen } from '@karrotframe/navigator';
import { getMini } from 'api/mini';
import { useEffect, useState } from 'react';
import BackendService from 'services/backendService';
import ReturningUserHome from 'pages/ReturningUserHome';
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

const appStyle = css`
  height: 100vh;
`;
const navStyle = css`
  --kf_navigator_navbar-borderColor: white;
`;
function App() {
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  let userData = {
    rank: 12,
    comment: '',
  };
  const handleAppEjection = () => {
    const mini = getMini();
    mini.close();
  };

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
      console.log(data.score);
      if (data.score >= 0) {
        setIsNewUser(true);
      } else {
        setIsNewUser(false);
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
            render={() => {
              return isNewUser ? (
                <Redirect to="/returning-user" />
              ) : (
                <Redirect to="/new-user" />
              );
            }}
          />
          <Route exact path="/new-user" component={NewUserHome} />

          <Route exact path="/returning-user" component={ReturningUserHome} />

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
