import React, { createContext, useContext, useMemo } from 'react';
import {
  Oauth2ApiFactory,
  UserApiFactory,
  GameUserApiFactory,
  GameTownApiFactory,
  GamePlayApiFactory,
} from '../../openapi_generator/api';
import { Configuration } from '../../openapi_generator/configuration';
import { useCookies } from 'react-cookie';

export const CreateMinigameApi = (accessToken?: string) => {
  const config = new Configuration({
    apiKey: accessToken,
    accessToken: accessToken,
  });
  console.log(config);

  if (accessToken) {
    const oauth2Api = () => Oauth2ApiFactory(config);
    const userApi = () => UserApiFactory(config);
    const gameUserApi = () => GameUserApiFactory(config);
    const gameTownApi = () => GameTownApiFactory(config);
    const gamePlayApi = () => GamePlayApiFactory(config);
    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
    };
  } else {
    const oauth2Api = () => Oauth2ApiFactory();
    const userApi = () => UserApiFactory();
    const gameUserApi = () => GameUserApiFactory();
    const gameTownApi = () => GameTownApiFactory();
    const gamePlayApi = () => GamePlayApiFactory();

    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
    };
  }
};

const MinigameApiContext = createContext(CreateMinigameApi(''));

export const MinigameApiProvider: React.FC = (props) => {
  // retrieve access-token from cookie
  const [cookies] = useCookies();
  const accessToken = cookies.accessToken;
  const api = useMemo(() => CreateMinigameApi(accessToken), [accessToken]);
  return (
    <MinigameApiContext.Provider value={api}>
      {props.children}
    </MinigameApiContext.Provider>
  );
};

export const useMinigameApi = () => useContext(MinigameApiContext);
