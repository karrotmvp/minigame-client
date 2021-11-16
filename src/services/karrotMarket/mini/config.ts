export interface KarrotMarketMiniConfig {
  appId?: string;
  presetUrl?: string;
  installationUrl?: string;
}

// Note: process.env.REACT_APP_* 은 웹팩에서 정의되기 때문에 외부에서 주입하지 않습니다
function validateEnv(): boolean {
  return [
    process.env.REACT_APP_APP_ID,
    process.env.REACT_APP_MINI_PRESET,
    process.env.REACT_APP_MINI_INSTALLATION_URL,
  ].every(Boolean);
}

export function loadFromEnv(): KarrotMarketMiniConfig {
  if (!validateEnv()) {
    throw new Error(
      'Environment does not fulfill karrot-market mini config properly'
    );
  }
  return {
    appId: process.env.REACT_APP_APP_ID,
    presetUrl: process.env.REACT_APP_MINI_PRESET,
    installationUrl: process.env.REACT_APP_MINI_INSTALLATION_URL,
  };
}
