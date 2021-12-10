import { useSignAccessToken, useUser } from 'hooks';
import { useCallback } from 'react';
import { useMinigameApi } from 'services/api/minigameApi';
import {
  getMini,
  loadFromEnv as karrotMarketMiniConfig,
} from 'services/karrotMarket/mini';

export const useMini = () => {
  const mini = getMini();
  const minigameApi = useMinigameApi();
  const { signAccessToken } = useSignAccessToken();
  const { user, setUser } = useUser();

  const appId = karrotMarketMiniConfig().appId;
  const presetUrl = karrotMarketMiniConfig().presetUrl;
  const installationUrl = karrotMarketMiniConfig().installationUrl;

  const updateUserInfo = async () => {
    const {
      data: { data },
    } = await minigameApi.userApi.getUserInfoUsingGET();
    if (data) {
      setUser({ userId: data.id, nickname: data.nickname });
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
          const response = await signAccessToken(
            user.uuid as string,
            result.code,
            user.regionId as string
          );
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
