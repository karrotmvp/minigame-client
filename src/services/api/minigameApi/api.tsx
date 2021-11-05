import React, { createContext, useContext, useMemo } from 'react';
import { Oauth2ApiFactory } from '../../openapi_generator/api';
import { Configuration } from '../../openapi_generator/configuration';
import useUserData from 'hooks/useUserData';
// export const Oauth2Api = () => Oauth2ApiFactory();
// Oauth2Api().karrotLoginUsingPOST({ code, regionId });

export const CreateMinigameApi = (accessToken?: string) => {
  const config = new Configuration({
    apiKey: accessToken,
  });
  if (accessToken) {
    const oauth2Api = () => Oauth2ApiFactory(config);

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

const MinigameApiContext = createContext(CreateMinigameApi(''));

export const MinigameApiProvider: React.FC = (props) => {
  const { accessToken } = useUserData();
  const api = useMemo(() => CreateMinigameApi(accessToken), [accessToken]);
  return (
    <MinigameApiContext.Provider value={api}>
      {props.children}
    </MinigameApiContext.Provider>
  );
};

export const useMinigameApi = () => useContext(MinigameApiContext);
