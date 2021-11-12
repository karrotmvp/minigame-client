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
  // const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  // const { setUserInfo } = useUserData();
  const [, setCookies] = useCookies(['accessToken']);

  const signAccessToken = async (code: string, regionId: string) => {
    try {
      const {
        data: { data },
      } = await minigameApi.oauth2Api.karrotLoginUsingPOST({ code, regionId });
      if (data) {
        setCookies('accessToken', data.accessToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    signAccessToken,
  };
};
