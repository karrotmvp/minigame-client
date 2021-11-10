import { useSignAccessToken, useUserData } from 'hooks';
import {
  getMini,
  loadFromEnv as karrotMarketMiniConfig,
} from 'services/karrotMarket/mini';

export const useMini = () => {
  const mini = getMini();
  const { regionId } = useUserData();
  const { signAccessToken } = useSignAccessToken();
  const presetUrl = karrotMarketMiniConfig().presetUrl;
  const appId = karrotMarketMiniConfig().appId;

  const isInWebEnvironment = (() => {
    if (mini.environment === 'Web') {
      return true;
    } else {
      return false;
    }
  })();

  const ejectApp = () => {
    mini.close();
  };

  const handleThirdPartyAgreement = () => {
    mini.startPreset({
      preset: presetUrl!,
      params: {
        appId: appId!,
      },
      onSuccess: async function (result) {
        if (result && result.code) {
          signAccessToken(result.code, regionId);
        }
      },
    });
  };

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
    shareApp,
  };
};
