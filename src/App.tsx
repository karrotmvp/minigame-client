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
    const userRegionId: any = searchParams.get('region_id');
    console.log(userCode, userRegionId);
    dispatch(saveRegionId(userRegionId));
    logEvent(analytics, 'app_launched');

    // Check user's townId(지역구) using regionId
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/town?regionId=${userRegionId}`)
      .then((response: { data: { data: { id: string; name2: string } } }) => {
        const townId: string = response.data.data.id;
        const townName: string = response.data.data.name2;
        dispatch(saveTownId(townId));
        dispatch(saveTownName(townName));
        setUserTownData([townId, townName]);
        if (townId !== 'df5370052b3c') {
          if (userCode !== null || undefined) {
            setNonServiceUserBack(true);
          }
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
                      nonServiceUserBack: nonServiceUserBack,
                    },
                  }}
                />
              ) : pageRedirection === 2 ? (
                <Redirect to="/home" />
              ) : pageRedirection === 3 ? (
                <Redirect to="/new-user-home" />
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
