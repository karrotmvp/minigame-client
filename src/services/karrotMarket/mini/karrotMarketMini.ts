import Mini from '@karrotmarket/mini';
import {
  emptyKarrotMarketMini,
  KarrotMarketMini,
} from 'services/karrotMarketMini';
import { KarrotMarketMiniConfig } from './config';

let mini: Mini;
const getMini = () => {
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
  const presetUrl = `${config.preserUrl}`;
  const appId = `${config.appId}`;
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
    };
  }
}
