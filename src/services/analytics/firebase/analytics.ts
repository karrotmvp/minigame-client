import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import type { Analytics } from '../../analytics';
import type { FirebaseAnalyticsConfig } from './config';

export function createFirebaseAnalytics(config: FirebaseAnalyticsConfig): Analytics {
  const app = initializeApp(config);
  const analytics = getAnalytics(app);

  return {
    logEvent(eventName, params) {
      logEvent(analytics, eventName, params);
    },
  };
}
