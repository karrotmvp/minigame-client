import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

import { useMinigameApi } from 'services/api/minigameApi';

export const useAccessToken = () => {
  const [cookies] = useCookies(['accessToken']);
  const accessToken: string = cookies.accessToken;
  return {
    accessToken,
  };
};

export const useSignAccessToken = () => {
  const minigameApi = useMinigameApi();
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

  const signAccessToken = useCallback(
    async (code: string, regionId: string) => {
      try {
        const {
          data: { data },
        } = await minigameApi.oauth2Api.karrotLoginUsingPOST({
          code,
          regionId,
        });
        if (data) {
          setCookie('accessToken', data.accessToken);

          return true;
        }
      } catch (error) {}
    },
    [minigameApi.oauth2Api, setCookie]
  );

  return {
    signAccessToken,
    removeCookie,
  };
};
