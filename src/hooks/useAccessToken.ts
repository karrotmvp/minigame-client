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
  const [, setCookie, removeCookie] = useCookies(['accessToken']);

  const signAccessToken = useCallback(
    async (uuid: string, code: string, regionId: string) => {
      try {
        const {
          data: { data },
        } = await minigameApi.oauth2Api.karrotLoginUsingPOST(uuid, regionId, {
          code,
        });
        if (data) {
          setCookie('accessToken', data.accessToken);
          // console.log('accessToken', data);
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
