import React, { createContext, useContext, useMemo } from 'react';
import {
  Oauth2Api,
  UserApi,
  GameUserApi,
  GameTownApi,
  GamePlayApi,
  NotificationApi,
  RegionApi,
  SurveyApi,
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
    const gamePlayApi = new GamePlayApi(configuration);
    const gameTownApi = new GameTownApi(configuration);
    const gameUserApi = new GameUserApi(configuration);
    const notificationApi = new NotificationApi(configuration);
    const oauth2Api = new Oauth2Api(configuration);
    const regionApi = new RegionApi(configuration);
    const surveyApi = new SurveyApi(configuration);
    const userApi = new UserApi(configuration);

    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
      regionApi,
      surveyApi,
      notificationApi,
    };
  } else {
    console.log('no access token');
    const gamePlayApi = new GamePlayApi();
    const gameTownApi = new GameTownApi();
    const gameUserApi = new GameUserApi();
    const notificationApi = new NotificationApi();
    const oauth2Api = new Oauth2Api();
    const regionApi = new RegionApi();
    const surveyApi = new SurveyApi();
    const userApi = new UserApi();

    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
      regionApi,
      surveyApi,
      notificationApi,
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
