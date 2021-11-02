import React from 'react';
import '@karrotframe/navigator/index.css';
import { Navigator, Screen } from '@karrotframe/navigator';
// import { KarrotClickerApp } from 'KarrotClicker';
import { Home } from 'Home';
import { Game2048Home } from 'Game2048/Home';
import { Game2048Game } from 'Game2048/Game';
import { Game2048Leaderboard } from 'Game2048/Leaderboard';

const App: React.FC = () => {
  return (
    <Navigator
      theme="Cupertino"
      onClose={() => {
        console.log('Close button is pressed');
      }}
    >
      <Screen path="/" component={Home} />
      {/* <Screen path="/karrot-clicker" component={KarrotClickerApp} /> */}
      <Screen path="/game-2048" component={Game2048Home} />
      <Screen path="/game-2048/game" component={Game2048Game} />
      <Screen path="/game-2048/leaderboard" component={Game2048Leaderboard} />
    </Navigator>
  );
};

export default App;
