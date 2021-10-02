// import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@karrotframe/navigator/index.css';
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import { Navigator, Screen } from '@karrotframe/navigator';

const appStyle = css`
  height: 100vh;
`;

// import Mini from '@karrotmarket/mini';
//
function App() {
  // const mini = new Mini();
  return (
    <div css={appStyle}>
      <Navigator
        theme="Cupertino"
        onClose={() => {
          console.log('닫기버튼이 눌렸습니다');
        }}
      >
        <Screen path="/" component={Home} />
        <Screen path="/game" component={Game} />
        <Screen path="/leaderboard" component={Leaderboard} />
      </Navigator>
    </div>
  );
}

export default App;
