import React, { createContext, useContext, useMemo } from 'react';
import {
  Oauth2Api,
  UserApi,
  GameUserApi,
  GameTownApi,
  GamePlayApi,
  TownApiFactory,
} from '../../openapi_generator/api';
import { Configuration } from '../../openapi_generator/configuration';
import { useAccessToken } from 'hooks';

function CreateMinigameApi({ accessToken }: { accessToken?: string }) {
  console.log('here', accessToken);
  if (accessToken) {
    const configuration = new Configuration({
      apiKey: `Bearer ${accessToken}`,
      basePath: `https://alpha.daangn-game.com`,
    });
    console.log(configuration);
    const oauth2Api = new Oauth2Api(configuration);
    const userApi = new UserApi(configuration);
    const gameUserApi = new GameUserApi(configuration);
    const gameTownApi = new GameTownApi(configuration);
    const gamePlayApi = new GamePlayApi(configuration);
    const townApi = () => TownApiFactory(configuration);
    console.log(gameUserApi);
    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
      townApi,
    };
  } else {
    console.log('no access token');
    const oauth2Api = new Oauth2Api();
    const userApi = new UserApi();
    const gameUserApi = new GameUserApi();
    const gameTownApi = new GameTownApi();
    const gamePlayApi = new GamePlayApi();
    const townApi = () => TownApiFactory();

    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
      townApi,
    };
  }
}

const MinigameApiContext = createContext<ReturnType<typeof CreateMinigameApi>>(
  null as any
);
export const MinigameApiProvider: React.FC = (props) => {
  const { accessToken } = useAccessToken();
  const api = useMemo(() => CreateMinigameApi({ accessToken }), [accessToken]);
  return (
    <MinigameApiContext.Provider value={api}>
      {props.children}
    </MinigameApiContext.Provider>
  );
};

export function useMinigameApi() {
  return useContext(MinigameApiContext);
}
