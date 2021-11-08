import { useCookies } from 'react-cookie';
import { useMinigameApi } from 'services/api/minigameApi';

export const useAccessToken = () => {
  const minigameApi = useMinigameApi();
  const [cookies, setCookies] = useCookies(['accessToken']);
  const accessToken: string = cookies.accessToken;
  const getAccessToken = async (code: string, regionId: string) => {
    const {
      data: { data },
    } = await minigameApi.oauth2Api.karrotLoginUsingPOST({ code, regionId });
    if (data) {
      setCookies('accessToken', data.accessToken);
    }
  };

  return {
    accessToken,
    getAccessToken,
  };
};
