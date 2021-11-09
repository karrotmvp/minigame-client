<<<<<<< Updated upstream
import React, { createContext, useContext, useMemo } from 'react';
import { Oauth2ApiFactory } from '../../openapi_generator/api';
=======
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import {
  Oauth2Api,
  UserApi,
  GameUserApi,
  GameTownApi,
  GamePlayApi,
} from '../../openapi_generator/api';
>>>>>>> Stashed changes
import { Configuration } from '../../openapi_generator/configuration';
import useUserData from 'hooks/useUserData';
// export const Oauth2Api = () => Oauth2ApiFactory();
// Oauth2Api().karrotLoginUsingPOST({ code, regionId });

export const CreateMinigameApi = (accessToken?: string) => {
  const config = new Configuration({
    apiKey: accessToken,
  });
  if (accessToken) {
<<<<<<< Updated upstream
    const oauth2Api = () => Oauth2ApiFactory(config);

=======
    console.log(accessToken);
    const configuration = new Configuration({
      apiKey: `Bearer ${accessToken}`,
    });
    console.log(configuration);
    const oauth2Api = new Oauth2Api(configuration);
    const userApi = new UserApi(configuration);
    const gameUserApi = new GameUserApi(configuration);
    const gameTownApi = new GameTownApi(configuration);
    const gamePlayApi = new GamePlayApi(configuration);
    console.log(gameUserApi);
>>>>>>> Stashed changes
    return {
      oauth2Api,
    };
  } else {
    const oauth2Api = () => Oauth2ApiFactory();
    return { oauth2Api };
  }
};

// export const emptyMinigameApi = {
//   oauth2Api(...args: any[]) {
//     console.log(...args);
//   },
// };

<<<<<<< Updated upstream
const MinigameApiContext = createContext(CreateMinigameApi(''));

export const MinigameApiProvider: React.FC = (props) => {
  const { accessToken } = useUserData();
  const api = useMemo(() => CreateMinigameApi(accessToken), [accessToken]);
=======
const MinigameApiContext = createContext<ReturnType<typeof CreateMinigameApi>>(
  null as any
);

export const MinigameApiProvider: React.FC = (props) => {
  const { accessToken } = useAccessToken();
  const api = useMemo(() => CreateMinigameApi({ accessToken }), [accessToken]);
>>>>>>> Stashed changes
  return (
    <MinigameApiContext.Provider value={api}>
      {props.children}
    </MinigameApiContext.Provider>
  );
};

export const useMinigameApi = () => useContext(MinigameApiContext);
