import useUserData from 'hooks/useUserData';
import { useCallback, useEffect } from 'react';
import { Analytics, useAnalytics } from 'services/analytics';
import { KarrotRaiseApi, useKarrotRaiseApi } from 'services/karrotRaiseApi';

export const withLogIn = (WrappedComponent: any) => {
  const LogInCheck = () => {
    const karrotRaiseApi = useKarrotRaiseApi();
    const analytics = useAnalytics();
    const { code, userRegionId, onUpdateAccessToken, onUpdateUserData } =
      useUserData();

    const trackUser = useCallback(
      async (
        karrotRaiseApi: KarrotRaiseApi,
        accessToken: string,
        analytics: Analytics
      ) => {
        console.log('entered tracking');
        try {
          const { data, status } = await karrotRaiseApi.getUserInfo(
            accessToken
          );
          if (status === 200) {
            const { id, nickname, score, rank, comment } = data;
            onUpdateUserData(id, nickname, score, rank, comment);
            analytics.setUserId(id);
            console.log('tracking returning-user... id:', id);
          }
        } catch (error) {
          console.error(error);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    const getAccessToken = useCallback(
      async (
        karrotRaiseApi: KarrotRaiseApi,
        code: string | null,
        regionId: string,
        analytics: Analytics
      ) => {
        // code !== null means user is a returning user
        console.log('accesstoken attempt');
        try {
          if (code !== null) {
            const { data, status } = await karrotRaiseApi.postOauth2(
              code,
              regionId
            );
            console.log(data, status);
            if (status === 200) {
              const { accessToken } = data;
              console.log(accessToken, 'accessst   ooken');
              // window.localStorage.setItem('ACCESS_TOKEN', accessToken);
              onUpdateAccessToken(accessToken);
              trackUser(karrotRaiseApi, accessToken, analytics);
              // setPageRedirection('home');
            }
          } else {
            // setPageRedirection('new-user-home');
          }
        } catch (error) {
          console.error(error);
        }
      },
      [onUpdateAccessToken, trackUser]
    );

    useEffect(() => {
      getAccessToken(karrotRaiseApi, code, userRegionId!, analytics);
      console.log('withLogin', userRegionId);
    }, []);
    return <WrappedComponent />;
  };
  return LogInCheck;
};
