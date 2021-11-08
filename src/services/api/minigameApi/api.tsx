import React, { createContext, useContext, useMemo } from 'react';
import {
  Oauth2Api,
  UserApi,
  GameUserApi,
  GameTownApi,
  GamePlayApi,
} from '../../openapi_generator/api';
import { Configuration } from '../../openapi_generator/configuration';
import { useAccessToken } from 'hooks';

function CreateMinigameApi({ accessToken }: { accessToken?: string }) {
  console.log('here', accessToken);
  if (accessToken) {
    console.log(accessToken);
    const configuration = new Configuration({
      apiKey: accessToken,
    });
    console.log(configuration);
    const oauth2Api = new Oauth2Api(configuration);
    const userApi = new UserApi(configuration);
    const gameUserApi = new GameUserApi(configuration);
    const gameTownApi = new GameTownApi(configuration);
    const gamePlayApi = new GamePlayApi(configuration);
    console.log(gameUserApi);
    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
    };
  } else {
    console.log('no access token');
    const oauth2Api = new Oauth2Api();
    const userApi = new UserApi();
    const gameUserApi = new GameUserApi();
    const gameTownApi = new GameTownApi();
    const gamePlayApi = new GamePlayApi();
    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
    };
  }
}

const MinigameApiContext = createContext(CreateMinigameApi({}));

export const MinigameApiProvider: React.FC = (props) => {
  // retrieve access-token from cookie
  const { accessToken } = useAccessToken();
  const api = CreateMinigameApi({ accessToken });
  return (
    <MinigameApiContext.Provider value={api}>
      {props.children}
    </MinigameApiContext.Provider>
  );
};

export function useMinigameApi() {
  return useContext(MinigameApiContext);
}
