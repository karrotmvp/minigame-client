import { createContext, useContext } from 'react';

export interface Analytics {
  logEvent(eventName: string, params?: Record<string, unknown>): void;
}

export const emptyAnalytics: Analytics = {
  logEvent(...args) {
    console.log(...args);
  },
};

export const AnalyticsContext = createContext(emptyAnalytics);
export const useAnalytics = () => useContext(AnalyticsContext);
