import React, { useCallback, useEffect } from 'react';
import '@karrotframe/navigator/index.css';
import { Navigator, Screen } from '@karrotframe/navigator';
import { Home } from 'pages/Home';
import { Game2048Home } from 'pages/Game2048/Home';
import { Game2048Game } from 'pages/Game2048/Game';
import { Game2048Leaderboard } from 'pages/Game2048/Leaderboard';
import { KarrotClickerHome } from 'pages/KarrotClicker/Home';
import { KarrotClickerGame } from 'pages/KarrotClicker/Game';
import { KarrotClickerLeaderboard } from 'pages/KarrotClicker/Leaderboard';
import { Survey } from 'pages/Survey';
import { Mission } from 'pages/Mission';
import {
  useAccessToken,
  useSignAccessToken,
  useUserData,
  useUser,
  useMini,
} from 'hooks';
import { useMinigameApi } from 'services/api/minigameApi';
import { useAnalytics } from 'services/analytics/firebase';
import { v4 as uuidv4 } from 'uuid';
import { RefererEnum } from 'redux/user';

const App: React.FC = () => {
  const karrotMini = useMini();
  const minigameApi = useMinigameApi();
  const analytics = useAnalytics();
  const { setTownInfo } = useUserData();
  const { accessToken } = useAccessToken();
  const { signAccessToken, removeCookie } = useSignAccessToken();
  const { setUser, setMission, setSubscription } = useUser();

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const preload: string | null = searchParams.get('preload');
    const code: string | null = searchParams.get('code');
    const regionId: string | null = searchParams.get('region_id');
    const installed: string | null = searchParams.get('installed');
    const referer: string | null = searchParams.get('referer');
    return [preload, code, regionId, installed, referer];
  };

  const getDistrictInfo = useCallback(
    async (regionId: string) => {
      try {
        const {
          data: { data },
        } = await minigameApi.regionApi.getTownInfoUsingGET(regionId);
        if (data) {
          setTownInfo(data.townId, data.name1, data.name2, data.name3);
        }
      } catch (error) {
        console.error(error);
      }
    },

    [minigameApi.regionApi, setTownInfo]
  );

  const isSubscribed = (installed: string | null) => {
    return installed === 'true' ? true : false;
  };

  const fetchData = useCallback(
    async (uuid: string, code: string, regionId: string) => {
      await signAccessToken(uuid, code, regionId);
      // await updateUserInfo();
    },
    [signAccessToken]
  );

  const retrieveUUID = () => {
    if (localStorage.getItem('uuid') !== null) {
      console.log('localstorage uuid', localStorage.getItem('uuid'));
      return;
    } else {
      const uuid = uuidv4();
      localStorage.setItem('uuid', uuid);
    }
  };

  const saveQueryString = ({
    uuid,
    regionId,
    isSubscribed,
    referer,
  }: {
    uuid: string;
    regionId: string;
    isSubscribed: boolean;
    referer: RefererEnum;
  }) => {
    setUser({ id: { uuid }, regionId, referer });
    setSubscription({ isSubscribed });
  };
  const checkLocalStorage = () => {
    const missionPreference = localStorage.getItem('missionPreference');
    if (missionPreference !== null) {
      const parsedMissionPreference = JSON.parse(missionPreference);
      setMission({
        page: { isCheckedOut: parsedMissionPreference.isMissionCheckedOut },
        popup: { hasSeen: parsedMissionPreference.hasMissionPopupSeen },
      });
    }
  };

  useEffect(() => {
    retrieveUUID();
    if (accessToken) {
      removeCookie('accessToken');
    }
    const [preload, code, regionId, installed, referer] = getQueryParams();
    // if (code)... returning user handler
    // else... new user handler

    analytics.logEvent('launch_app');

    setUser({ regionId: regionId as string });
    getDistrictInfo(regionId as string);
    console.log(preload, code, regionId, installed, referer);

    saveQueryString({
      uuid: localStorage.getItem('uuid') as string,
      regionId: regionId as string,
      isSubscribed: isSubscribed(installed),
      referer: referer?.toUpperCase() as RefererEnum,
    });
    checkLocalStorage();
    fetchData(
      localStorage.getItem('uuid') as string,
      code as string,
      regionId as string
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Navigator
      theme="Cupertino"
      onClose={() => {
        karrotMini.ejectApp();
      }}
    >
      <Screen path="/" component={Home} />
      {/* Game 2048 */}
      <Screen path="/game-2048" component={Game2048Home} />
      <Screen path="/game-2048/game" component={Game2048Game} />
      <Screen path="/game-2048/leaderboard" component={Game2048Leaderboard} />
      {/* Karrot Clicker */}
      <Screen path="/karrot-clicker" component={KarrotClickerHome} />
      <Screen path="/karrot-clicker/game" component={KarrotClickerGame} />
      <Screen
        path="/karrot-clicker/leaderboard"
        component={KarrotClickerLeaderboard}
      />
      <Screen path="/survey" component={Survey} />
      <Screen path="/mission" component={Mission} />
    </Navigator>
  );
};

export default App;
