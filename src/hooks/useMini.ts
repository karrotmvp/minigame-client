import { useNavigator } from '@karrotframe/navigator';
import { useAccessToken, useSignAccessToken, useUserData } from 'hooks';
import { useCallback } from 'react';
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
  const presetUrl = karrotMarketMiniConfig().presetUrl;
  const appId = karrotMarketMiniConfig().appId;

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

  const ejectApp = () => {
    mini.close();
  };

  const handleThirdPartyAgreement = async (runOnSuccess: () => void) => {
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
      onClose: function () {
        console.log('accesstoken from preset', accessToken);
        updateUserInfo();
      },
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
