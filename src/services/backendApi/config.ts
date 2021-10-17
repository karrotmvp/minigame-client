// Note: process.env.REACT_APP_* 은 웹팩에서 정의되기 때문에 외부에서 주입하지 않습니다
function validateEnv(): boolean {
  return [process.env.REACT_APP_BASE_URL, process.env.REACT_APP_APP_ID].every(
    Boolean
  );
}

export function loadFromEnv() {
  if (!validateEnv()) {
    throw new Error('Environment does not fulfill backend api config properly');
  }
  return {
    baseUrl: process.env.REACT_APP_BASE_URL,
    appId: process.env.REACT_APP_APP_ID,
  };
}
