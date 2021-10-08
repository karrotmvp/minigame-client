/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
import Home from './pages/Home';
import NewUserHome from './pages/NewUserHome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { Navigator, Screen } from '@karrotframe/navigator';
import { getMini } from 'api/mini';
import { useEffect, useState } from 'react';
import BackendService from 'services/backendService';
import { useDispatch } from 'react-redux';
import { addData } from 'reducers/userDataReducer';

const appStyle = css`
  height: 100vh;
`;
const navStyle = css`
  --kf_navigator_navbar-borderColor: white;
`;
function App() {
  // const [userData, setUserData] = useState({
  //   nickname: 'Neil',
  //   score: 0,
  //   rank: 12,
  //   comment: '',
  // });
  let userData = {
    rank: 12,
    comment: '',
  };
  const handleAppEjection = () => {
    const mini = getMini();
    mini.close();
  };

  const dispatch = useDispatch();

  const getCurrentuserInfo = async () => {
    try {
      const response = await BackendService.getCurrentUserInfo();
      const responseData: any = response.data[`data`];
      console.log(responseData);
      // setUserData(userData);
      // addUserData(responseData);
      // dispatch(addData('Jason', 2));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCurrentuserInfo();
    // addUserData('asdf');
    // const updateNickname = async () => dispatch(addNickname('jason'));
    // updateNickname();
    // dispatch(addData('Jason', 2));
  }, [dispatch]);

  return (
    <div css={appStyle}>
      <Navigator
        theme="Cupertino"
        css={navStyle}
        onClose={() => {
          console.log(`${handleAppEjection} 닫기버튼이 눌렸습니다`);
        }}
      >
        <Screen path="/">
          {window.localStorage.getItem('user') === null ? (
            <NewUserHome />
          ) : (
            <Home userData={userData} />
          )}
        </Screen>
        <Screen path="/game" component={Game} />
        <Screen path="/leaderboard" component={Leaderboard} />
      </Navigator>
    </div>
  );
}

export default App;
