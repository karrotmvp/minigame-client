import { useSignAccessToken, useUserData, useUser } from 'hooks';
import { useCallback } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';
import {
  getMini,
  loadFromEnv as karrotMarketMiniConfig,
} from 'services/karrotMarket/mini';

export const useMini = () => {
  const mini = getMini();
  // const analytics = useAnalytics();
  const minigameApi = useMinigameApi();
  const { regionId, setUserInfo } = useUserData();
  const { signAccessToken } = useSignAccessToken();
  const appId = karrotMarketMiniConfig().appId;
  const presetUrl = karrotMarketMiniConfig().presetUrl;
  const installationUrl = karrotMarketMiniConfig().installationUrl;

  const { uuid } = useUser();

  const updateUserInfo = async () => {
    const {
      data: { data },
    } = await minigameApi.userApi.getUserInfoUsingGET();
    if (data) {
      setUserInfo(data.id, data.nickname);
      // FA: track user with set user id
      // analytics.setUserId(data.id);
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
          // console.log('1', result.code);
          const response = await signAccessToken(uuid, result.code, regionId);
          // console.log('2', response);
          if (response === true) {
            // console.log('3');
            updateUserInfo();
            if (runOnSuccess !== undefined) {
              // console.log('4');
              runOnSuccess();
            }
          }
        }
      },
      onClose: function () {
        updateUserInfo();
      },
      onFailure: function () {},
    });
  };

  // Installation handler
  const handleSubscribe = useCallback(
    async (runOnSuccess?: () => void, runOnClose?: () => void) => {
      mini.startPreset({
        preset: installationUrl!,
        onSuccess: async function (result) {
          if (result.ok) {
            if (runOnSuccess) {
              runOnSuccess();
            }
          }
        },
        onFailure: async function () {},
        onClose: () => {
          if (runOnClose) {
            runOnClose();
          }
        },
      });
    },
    [installationUrl, mini]
  );

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
    handleSubscribe,
    shareApp,
  };
};
