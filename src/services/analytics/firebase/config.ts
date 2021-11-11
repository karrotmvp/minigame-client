import type { FirebaseOptions } from 'firebase/app';

export type FirebaseAnalyticsConfig = FirebaseOptions;

// Note: process.env.REACT_APP_* 은 웹팩에서 정의되기 때문에 외부에서 주입하지 않습니다
function validateEnv(): boolean {
  return [
    process.env.REACT_APP_FIREBASE_API_KEY,
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    process.env.REACT_APP_FIREBASE_PROJECT_ID,
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    process.env.REACT_APP_FIREBASE_APP_ID,
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  ].every(Boolean);
}

export function loadFromEnv(): FirebaseAnalyticsConfig {
  if (!validateEnv()) {
    throw new Error('Environment does not fulfill firebase config properly');
  }
  return {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
}
