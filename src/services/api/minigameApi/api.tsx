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
  VisitorApi,
  ScoreLogApi,
} from '../../openapi_generator/api';
import { Configuration } from '../../openapi_generator/configuration';
import { useAccessToken } from 'hooks';
import { loadFromEnv as minigameApiEnv } from './config';

function CreateMinigameApi({
  accessToken,
  basePath,
}: {
  accessToken?: string;
  basePath?: string;
}) {
  if (accessToken && basePath) {
    const configuration = new Configuration({
      apiKey: `Bearer ${accessToken}`,
      basePath: `${basePath.replace(/\/+$/, '')}`,
    });
    const gamePlayApi = new GamePlayApi(configuration);
    const gameTownApi = new GameTownApi(configuration);
    const gameUserApi = new GameUserApi(configuration);
    const notificationApi = new NotificationApi(configuration);
    const oauth2Api = new Oauth2Api(configuration);
    const regionApi = new RegionApi(configuration);
    const surveyApi = new SurveyApi(configuration);
    const userApi = new UserApi(configuration);
    const visitorApi = new VisitorApi(configuration);
    const scoreLogApi = new ScoreLogApi(configuration);
    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
      regionApi,
      surveyApi,
      notificationApi,
      visitorApi,
      scoreLogApi,
    };
  } else if (basePath) {
    const configuration = new Configuration({
      basePath: `${basePath.replace(/\/+$/, '')}`,
    });
    const gamePlayApi = new GamePlayApi(configuration);
    const gameTownApi = new GameTownApi(configuration);
    const gameUserApi = new GameUserApi(configuration);
    const notificationApi = new NotificationApi(configuration);
    const oauth2Api = new Oauth2Api(configuration);
    const regionApi = new RegionApi(configuration);
    const surveyApi = new SurveyApi(configuration);
    const userApi = new UserApi(configuration);
    const visitorApi = new VisitorApi(configuration);
    const scoreLogApi = new ScoreLogApi(configuration);
    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
      regionApi,
      surveyApi,
      notificationApi,
      visitorApi,
      scoreLogApi,
    };
  } else {
    const gamePlayApi = new GamePlayApi();
    const gameTownApi = new GameTownApi();
    const gameUserApi = new GameUserApi();
    const notificationApi = new NotificationApi();
    const oauth2Api = new Oauth2Api();
    const regionApi = new RegionApi();
    const surveyApi = new SurveyApi();
    const userApi = new UserApi();
    const visitorApi = new VisitorApi();
    const scoreLogApi = new ScoreLogApi();
    return {
      oauth2Api,
      userApi,
      gameUserApi,
      gameTownApi,
      gamePlayApi,
      regionApi,
      surveyApi,
      notificationApi,
      visitorApi,
      scoreLogApi,
    };
  }
}

const MinigameApiContext = createContext<ReturnType<typeof CreateMinigameApi>>(
  null as any
);
export const MinigameApiProvider: React.FC = (props) => {
  const { accessToken } = useAccessToken();
  const basePath = minigameApiEnv().baseUrl;
  const api = useMemo(
    () => CreateMinigameApi({ accessToken, basePath }),
    [accessToken, basePath]
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

export type MinigameApiType = ReturnType<typeof CreateMinigameApi>;
