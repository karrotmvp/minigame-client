import { AnalyticsCallOptions } from '@firebase/analytics';
import { createContext, useContext } from 'react';

export interface Analytics {
  logEvent(eventName: string, params?: Record<string, unknown>): void;
  setUserId(eventname: string, options?: AnalyticsCallOptions): void;
}

// wow, such empty...
export const emptyAnalytics: Analytics = {
  logEvent(...args) {
    console.log(...args);
  },
  setUserId(...args) {
    console.log(...args);
  },
};

export const AnalyticsContext = createContext(emptyAnalytics);
export const useAnalytics = () => useContext(AnalyticsContext);
