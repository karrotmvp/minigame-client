import { useNavigator } from '@karrotframe/navigator';
import { useAccessToken, useSignAccessToken, useUserData } from 'hooks';
import { useAnalytics } from 'services/analytics';
import {
  getMini,
  loadFromEnv as karrotMarketMiniConfig,
} from 'services/karrotMarket/mini';

export const useMini = () => {
  const mini = getMini();
  const analytics = useAnalytics();
  const { regionId } = useUserData();

  const { signAccessToken } = useSignAccessToken();
  const presetUrl = karrotMarketMiniConfig().presetUrl;
  const appId = karrotMarketMiniConfig().appId;
  const { push } = useNavigator();
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

  const handleThirdPartyAgreement = (runOnSuccess: () => void) => {
    mini.startPreset({
      preset: presetUrl!,
      params: {
        appId: appId!,
      },
      onSuccess: function (result) {
        if (result && result.code) {
          signAccessToken(result.code, regionId);
          analytics.logEvent('click_karrot_mini_preset_agree_button', {
            game_type: 'karrot-clicker',
          });

          // return new Promise((resolve, reject) => {
          //   if (accessToken) {
          //     resolve('resolved');
          //   } else {
          //     reject('rejected');
          //   }
          // });
          runOnSuccess();
        }
      },
      onClose: function () {},
      onFailure: function () {},
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
