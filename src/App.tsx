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
    const searchParams = new URLSearchParams(window.location.search);
    console.log(window.location.search);
    const userCode = searchParams.get('code');
    const userRegionId = searchParams.get('region_id');
    // console.log(userCode, userRegionId);
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
          // console.log(response.data[`data`][`accessToken`]);
          setIsNewUser(false);
          console.log('direct to returning-user-home');

          // getCurrentuserInfo().then((data) => {
          //   dispatch(updateUserScore(data.score));
          //   console.log(`user's current total score: ${data.score}`);
          //   if (data.score > 0) {
          //     setIsNewUser(false);
          //   } else {
          //     setIsNewUser(true);
          //   }
          // });
        });
    } else {
      setIsNewUser(true);
      console.log('direct to new-user-home');
    }

    // .catch((error) => {
    // console.log(error);

    // const mini = getMini();
    // mini.startPreset({
    //   preset:
    //     'https://mini-assets.kr.karrotmarket.com/presets/common-login/alpha.html',
    //   params: {
    //     appId: `${process.env.REACT_APP_APP_ID}`,
    //   },
    //   onSuccess: function (result) {
    //     if (result && result.code) {
    //       console.log(result);
    //       console.log(`code: ${result.code}`);
    //       axios
    //         .post(
    //           `${process.env.REACT_APP_BASE_URL}/oauth`,
    //           {
    //             code: result.code,
    //             regionId: `9bdfe83b68f3`,
    //           },
    //           {
    //             headers: {
    //               'Content-Type': 'application/json',
    //             },
    //           }
    //         )
    //         .then((response: any) => {
    //           window.localStorage.setItem(
    //             'ACCESS_TOKEN',
    //             response.data[`data`][`accessToken`]
    //           );
    //           console.log(response);
    //         });
    //     }
    //   },
    // });
    // });
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
