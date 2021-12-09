import React, { createContext, useContext, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  setUserId as firebaseSetUserId,
} from 'firebase/analytics';
import { AnalyticsCallOptions } from '@firebase/analytics';
import type { FirebaseAnalyticsConfig } from './config';
import { loadFromEnv as firebaseAnalyticsEnv } from './config';

function createFirebaseAnalytics({
  config,
}: {
  config?: FirebaseAnalyticsConfig;
}) {
  if (config) {
    console.log(config);
    const app = initializeApp(config);
    const analytics = getAnalytics(app);
    console.log('analytics provider success');

    const logEvent = (
      eventName: string,
      params?: Record<string, unknown>
    ): void => {
      firebaseLogEvent(analytics, eventName, params);
    };
    const setUserId = (id: string, options?: AnalyticsCallOptions): void => {
      firebaseSetUserId(analytics, id, options);
    };

    return {
      logEvent,
      setUserId,
    };
  } else {
    console.log('analytics provider fail');

    const logEvent = (...args: any[]) => {
      console.log(...args);
    };
    const setUserId = (...args: any[]) => {
      console.log(...args);
    };
    return {
      logEvent,
      setUserId,
    };
  }
}

const AnalyticsContext = createContext<
  ReturnType<typeof createFirebaseAnalytics>
>(null as any);

export const AnalyticsProvider: React.FC = (props) => {
  const config = firebaseAnalyticsEnv();
  const analytics = useMemo(
    () => createFirebaseAnalytics({ config }),
    [config]
  );
  console.log('analytics provider initiated');
  return (
    <AnalyticsContext.Provider value={analytics}>
      {props.children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);
