import { useAccessToken, useSignAccessToken, useUserData } from 'hooks';
import { useAnalytics } from 'services/analytics';
import { useMinigameApi } from 'services/api/minigameApi';
import {
  getMini,
  loadFromEnv as karrotMarketMiniConfig,
} from 'services/karrotMarket/mini';

export const useMini = () => {
  const mini = getMini();
  const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { regionId, setUserInfo } = useUserData();
  const { accessToken } = useAccessToken();
  const { signAccessToken } = useSignAccessToken();
  const appId = karrotMarketMiniConfig().appId;
  const presetUrl = karrotMarketMiniConfig().presetUrl;
  const installationUrl = karrotMarketMiniConfig().installationUrl;

  const updateUserInfo = async () => {
    const {
      data: { data },
    } = await minigameApi.userApi.getUserInfoUsingGET();
    if (data) {
      setUserInfo(data.id, data.nickname);
      // FA: track user with set user id
      analytics.setUserId(data.id);
      console.log('setuserinfo', data.id, data.nickname);
    }
  };

  const isInWebEnvironment = (() => {
    if (mini.environment === 'Web') {
      return true;
    } else {
      return false;
    }
  })();
  // Leave miniapp
  const ejectApp = () => {
    mini.close();
  };

  // Third-party agreement handler
  const handleThirdPartyAgreement = async (runOnSuccess?: () => void) => {
    mini.startPreset({
      preset: presetUrl!,
      params: {
        appId: appId!,
      },
      onSuccess: async function (result) {
        if (result && result.code) {
          const response = await signAccessToken(result.code, regionId);
          console.log(response);
          if (response === true) {
            await updateUserInfo();
            if (runOnSuccess) {
              runOnSuccess();
            }
          }
        }
      },
      onClose: function () {
        console.log('accesstoken from preset', accessToken);
        updateUserInfo();
      },
      onFailure: function () {},
    });
  };

  // Installation handler
  const handleInstallation = async (
    runOnSuccess?: () => void,
    runOnClose?: () => void
  ) => {
    console.log('installation handler opened');
    mini.startPreset({
      preset: installationUrl!,
      onSuccess: async function (result) {
        console.log(result);
        if (result.ok) {
          console.log('즐겨찾기 성공');

          if (runOnSuccess) {
            runOnSuccess();
          }
        }
      },
      onFailure: async function () {
        console.log('installation handler failed');
      },
      onClose: () => {
        if (runOnClose) {
          console.log('installation handler closed');
          runOnClose();
        }
      },
    });
  };

  // Share handler
  const shareApp = (url: string, text: string) => {
    mini.share({
      url,
      text,
    });
  };

  return {
    isInWebEnvironment,
    ejectApp,
    handleThirdPartyAgreement,
    handleInstallation,
    shareApp,
  };
};

// const mini = getMini();
// mini.startPreset({
//   preset: `https://mini-assets.kr.karrotmarket.com/presets/mvp-game-recommend-installation/alpha.html`,
//   onSuccess: async function (result) {
//     if (result.ok) {
//       console.log('즐겨찾기 성공');
//     }
//   },
// });
