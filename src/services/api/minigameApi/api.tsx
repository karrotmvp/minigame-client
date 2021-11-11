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
import { minigameApiConfig, loadFromEnv as minigameApiEnv } from './config';

function CreateMinigameApi({
  accessToken,
  env,
}: {
  accessToken?: string;
  env: minigameApiConfig;
}) {
  console.log('here is your access token:', accessToken);
  if (accessToken) {
    const configuration = new Configuration({
      apiKey: `Bearer ${accessToken}`,
      basePath: env.baseUrl,
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
  const env = minigameApiEnv();
  const api = useMemo(
    () => CreateMinigameApi({ accessToken, env }),
    [accessToken, env]
  );
  return (
    <MinigameApiContext.Provider value={api}>
      {props.children}
    </MinigameApiContext.Provider>
  );
};

export function useMinigameApi() {
  return useContext(MinigameApiContext);
}
