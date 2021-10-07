/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
import Home from './pages/Home';
import NewUserHome from './pages/NewUserHome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { Navigator, Screen } from '@karrotframe/navigator';
import { getMini } from 'api/mini';
import { useState } from 'react';

const appStyle = css`
  height: 100vh;
`;

const navStyle = css`
  --kf_navigator_navbar-borderColor: white;
`;
function App() {
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  const handleAppEjection = () => {
    const mini = getMini();
    mini.close();
  };

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
          {isNewUser ? <NewUserHome setIsNewUser={setIsNewUser} /> : <Home />}
        </Screen>
        <Screen path="/game" component={Game} />
        <Screen path="/leaderboard" component={Leaderboard} />
      </Navigator>
    </div>
  );
}

export default App;
