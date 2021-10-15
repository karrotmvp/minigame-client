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
// import BackendService from 'services/backendService';

const axios = require('axios').default;

const appStyle = css`
  height: 100vh;
`;

function App() {
  const [pageRedirection, setPageRedirection] = useState<number>();
  const [userTownData, setUserTownData] = useState<string[]>([]);
  const dispatch = useDispatch();

  // async function getQueryParams(): Promise<{
  //   userCode: any;
  //   userRegionId: any;
  // }> {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const userCode: any = searchParams.get('code');
  //   const userRegionId: any = searchParams.get('region_id');
  //   dispatch(saveRegionId(userRegionId));
  //   return { userCode, userRegionId };
  // }

  // async function handleNonServiceArea(regionId: any): Promise<void> {
  //   const userTownData = await BackendService.getTownId(regionId);
  //   const { townId, townName } = userTownData;
  //   dispatch(saveTownId(townId));
  //   dispatch(saveTownName(townName));
  //   setUserTownData([townId, townName]);
  // }

  // useEffect(() => {
  //   getQueryParams().then((response) => {
  //     const { userCode, userRegionId } = response;
  //     handleNonServiceArea(userRegionId);
  //     if (userRegionId !== 'df5370052b3c') {
  //       setPageRedirection(1);
  //     } else {
  //       if (userCode !== null && userRegionId !== null) {
  //         BackendService.postOauth(userCode, userRegionId);
  //         setPageRedirection(2);
  //       }
  //     }
  //   });

  //   // return () => {
  //   //   cleanup;
  //   // };
  // }, []);
  // BELOW WORKS
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userCode: string | null = searchParams.get('code');
    const userRegionId: any = searchParams.get('region_id');
    console.log(userCode, userRegionId);
    dispatch(saveRegionId(userRegionId));
    logEvent(analytics, 'app_launched');
    // Check user's townId(지역구) using regionId
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL_PRODUCTION}/town?regionId=${userRegionId}`
      )
      .then((response: { data: { data: { id: string; name2: string } } }) => {
        const townId: string = response.data.data.id;
        const townName: string = response.data.data.name2;
        dispatch(saveTownId(townId));
        dispatch(saveTownName(townName));
        setUserTownData([townId, townName]);
        if (townId !== 'df5370052b3c') {
          setPageRedirection(1);
          // return (
          //   <Redirect
          //     to="non-service-area"

          //   />
          // );
        } else {
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
              .then((response: { data: { data: { accessToken: string } } }) => {
                window.localStorage.setItem(
                  'ACCESS_TOKEN',
                  response.data.data.accessToken
                );
                setPageRedirection(2);
                // return (
                //   <Redirect
                //     to="/home"
                //     // }}
                //   />
                // );
              });
          } else {
            setPageRedirection(3);
            // return (
            //   <Redirect
            //     to="/new-user-home"
            //     // }}
            //   />
            // );
          }
        }
      })
      .catch((error: any) => console.error(error));
  }, [dispatch]);

  return (
    <div css={appStyle}>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              console.log(pageRedirection);
              return pageRedirection === 1 ? (
                <Redirect
                  to={{
                    pathname: '/non-service-area',
                    state: {
                      townId: userTownData[0],
                      townName: userTownData[1],
                    },
                  }}
                />
              ) : pageRedirection === 2 ? (
                <Redirect to="/home" />
              ) : pageRedirection === 3 ? (
                <Redirect
                  to="/new-user-home"
                  // }}
                />
              ) : null;
            }}
          />
          {/* <Route exact path="/">
            <div>loading</div>
          </Route> */}
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
