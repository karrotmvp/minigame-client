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
  const [, setCookies] = useCookies(['accessToken']);

  const signAccessToken = async (code: string, regionId: string) => {
    const {
      data: { data },
    } = await minigameApi.oauth2Api.karrotLoginUsingPOST({ code, regionId });
    if (data) {
      setCookies('accessToken', data.accessToken);
    }
  };

  return {
    signAccessToken,
  };
};
