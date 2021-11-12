import React, { useCallback, useEffect, useState } from 'react';
import '@karrotframe/navigator/index.css';
import { Navigator, Screen } from '@karrotframe/navigator';
import { Home } from 'pages/Home';
import { Game2048Home } from 'pages/Game2048/Home';
import { Game2048Game } from 'pages/Game2048/Game';
import { Game2048Leaderboard } from 'pages/Game2048/Leaderboard';
import { KarrotClickerHome } from 'pages/KarrotClicker/Home';
import { KarrotClickerGame } from 'pages/KarrotClicker/Game';
import { KarrotClickerLeaderboard } from 'pages/KarrotClicker/Leaderboard';
import { NonServiceArea } from 'pages/NonServiceArea';
// import { LoadingScreen } from 'components/LoadingScreen';

import {
  createFirebaseAnalytics,
  loadFromEnv as loadFirebaseAnalyticsConfig,
} from 'services/analytics/firebase';
import { AnalyticsContext, emptyAnalytics } from 'services/analytics';
import {
  KarrotMarketMiniContext,
  emptyKarrotMarketMini,
} from 'services/karrotMarketMini';
import {
  createKarrotMarketMini,
  loadFromEnv as loadKarrotMarketMiniConfig,
} from 'services/karrotMarket/mini';

import { useSignAccessToken, useUserData } from 'hooks';
import { useMinigameApi } from 'services/api/minigameApi';

const App: React.FC = () => {
  const minigameApi = useMinigameApi();
  const { setRegionInfo, setTownInfo } = useUserData();
  const { signAccessToken } = useSignAccessToken();
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [karrotMarketMini, setKarrotMarketMini] = useState(
    emptyKarrotMarketMini
  );
  // Firebase Analytics가 설정되어 있으면 인스턴스를 초기화하고 교체합니다.
  useEffect(() => {
    try {
      // check analytics
      const config = loadFirebaseAnalyticsConfig();
      const analytics = createFirebaseAnalytics(config);
      setAnalytics(analytics);
    } catch (error) {
      console.error(error);
    }
  }, []);
  // Mini...
  useEffect(() => {
    try {
      // check karrot-mini
      const karrotMarketMiniConfig = loadKarrotMarketMiniConfig();
      const karrotMarketMini = createKarrotMarketMini(karrotMarketMiniConfig);
      setKarrotMarketMini(karrotMarketMini);
    } catch (error) {
      console.error(error);
      // no-op
    }
  }, []);

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code: string | null = searchParams.get('code');
    const regionId: string | null = searchParams.get('region_id');
    return [code, regionId];
  };
  const getDistrictInfo = useCallback(
    async (regionId: string) => {
      try {
        const {
          data: { data },
        } = await minigameApi.regionApi().getTownInfoUsingGET(regionId);
        if (data) {
          setTownInfo(data.townId, data.name1, data.name2, data.name3);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [minigameApi, setTownInfo]
  );
  useEffect(() => {
    try {
      const [code, regionId] = getQueryParams();
      analytics.logEvent('launch_app');
      console.log(code, regionId);
      // handle if code and/or region id does not exist
      if (regionId) {
        setRegionInfo(regionId);
        getDistrictInfo(regionId);
        if (code) {
          signAccessToken(code, regionId);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [analytics]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      <KarrotMarketMiniContext.Provider value={karrotMarketMini}>
        <Navigator
          theme="Cupertino"
          onClose={() => {
            console.log('Close button is pressed');
            karrotMarketMini.close();
          }}
        >
          <Screen path="/" component={Home} />
          {/* Game 2048 */}
          <Screen path="/game-2048" component={Game2048Home} />
          <Screen path="/game-2048/game" component={Game2048Game} />
          <Screen
            path="/game-2048/leaderboard"
            component={Game2048Leaderboard}
          />
          {/* Karrot Clicker */}
          <Screen path="/karrot-clicker" component={KarrotClickerHome} />
          <Screen path="/karrot-clicker/game" component={KarrotClickerGame} />
          <Screen
            path="/karrot-clicker/leaderboard"
            component={KarrotClickerLeaderboard}
          />
          <Screen path="/non-service-area" component={NonServiceArea} />
        </Navigator>
      </KarrotMarketMiniContext.Provider>
    </AnalyticsContext.Provider>
  );
};

export default App;
