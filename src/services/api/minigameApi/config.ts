export interface minigameApiConfig {
  baseUrl?: string;
}

// Note: process.env.REACT_APP_* 은 웹팩에서 정의되기 때문에 외부에서 주입하지 않습니다
function validateEnv(): boolean {
  return [process.env.REACT_APP_BASE_URL].every(Boolean);
}

export function loadFromEnv(): minigameApiConfig {
  if (!validateEnv()) {
    throw new Error(
      'Environment does not fulfill minigame api config properly'
    );
  }
  return {
    baseUrl: process.env.REACT_APP_BASE_URL,
  };
}
