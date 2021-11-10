import Mini from '@karrotmarket/mini';
import {
  emptyKarrotMarketMini,
  KarrotMarketMini,
} from 'services/karrotMarketMini';

import { KarrotMarketMiniConfig } from './config';

let mini: Mini;
export const getMini = () => {
  if (mini) {
    return mini;
  } else {
    return (mini = new Mini());
  }
};

export function createKarrotMarketMini(
  config: KarrotMarketMiniConfig
): KarrotMarketMini {
  const mini = getMini();
  const presetUrl: string = config.presetUrl!;
  const appId: string = config.appId!;

  async function startPreset(runOnSuccess: (code: string) => void) {
    mini.startPreset({
      preset: presetUrl,
      params: {
        appId: appId,
      },
      onSuccess: async function (result) {
        if (result && result.code) {
          try {
            runOnSuccess(result.code);

            console.log(result.code, 'api');
          } catch (error) {
            console.error(error);
          }
        }
      },
      onFailure() {
        throw new Error('mini-app preset failed');
      },
    });
  }

  async function close() {
    mini.close();
    console.log('Ejected from the app. Now back to Karrot Market');
  }

  async function share(url: string, text: string) {
    mini.share({
      url: url,
      text: text,
    });
  }

  if (mini.environment === 'Web') {
    return emptyKarrotMarketMini;
  } else {
    return {
      startPreset,
      close,
      share,
      // appId,
      // presetUrl,
    };
  }
}

// //
// import { useSignAccessToken, useUserData } from 'hooks';
// import { loadFromEnv as karrotMarketMiniConfig } from 'services/karrotMarket/mini';
// export const getMini = () => {
//   if (mini) {
//     return mini;
//   } else {
//     return (mini = new Mini());
//   }
// };
// export const useKarrotMarketMini = () => {
//   const { regionId } = useUserData();
//   const { signAccessToken } = useSignAccessToken();
//   const presetUrl = karrotMarketMiniConfig().presetUrl;
//   const appId = karrotMarketMiniConfig().appId;

//   const isInWebEnvironment = (() => {
//     if (mini.environment === 'Web') {
//       return true;
//     } else {
//       return false;
//     }
//   })();

//   const ejectApp = () => {
//     mini.close();
//   };

//   const handleThirdPartyAgreement = () => {
//     mini.startPreset({
//       preset: presetUrl!,
//       params: {
//         appId: appId!,
//       },
//       onSuccess: async function (result) {
//         if (result && result.code) {
//           signAccessToken(result.code, regionId);
//         }
//       },
//     });
//   };

//   const shareApp = (url: string, text: string) => {
//     mini.share({
//       url,
//       text,
//     });
//   };

//   return {
//     isInWebEnvironment,
//     ejectApp,
//     handleThirdPartyAgreement,
//     shareApp,
//   };
// };
