import { useUserData } from 'hooks';
import { useCookies } from 'react-cookie';
import { useAnalytics } from 'services/analytics';
import { useMinigameApi } from 'services/api/minigameApi';

export const useAccessToken = () => {
  const [cookies] = useCookies(['accessToken']);
  const accessToken: string = cookies.accessToken;
  return {
    accessToken,
  };
};

// const getMyInfo = useCallback(async () => {
//   try {
//     const {
//       data: { data },
//     } = await minigameApi.userApi.getUserInfoUsingGET();
//     if (data) {
//       setUserInfo(data.id, data.nickname);
//       // FA: track user with set user id
//       analytics.setUserId(data.id);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }, [analytics, minigameApi.userApi, setUserInfo]);

export const useSignAccessToken = () => {
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { setUserInfo } = useUserData();
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
