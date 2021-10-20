export interface KarrotMarketMiniConfig {
  preserUrl?: string;
  appId?: string;
}

// Note: process.env.REACT_APP_* 은 웹팩에서 정의되기 때문에 외부에서 주입하지 않습니다
function validateEnv(): boolean {
  return [
    process.env.REACT_APP_MINI_PRESET,
    process.env.REACT_APP_APP_ID,
  ].every(Boolean);
}

export function loadFromEnv(): KarrotMarketMiniConfig {
  if (!validateEnv()) {
    throw new Error(
      'Environment does not fulfill karrot-market mini config properly'
    );
  }
  return {
    preserUrl: process.env.REACT_APP_MINI_PRESET,
    appId: process.env.REACT_APP_APP_ID,
  };
}
