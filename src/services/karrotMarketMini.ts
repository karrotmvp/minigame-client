import { createContext, useContext } from 'react';

export interface KarrotMarketMini {
  startPreset(runOnSuccess: (code: string) => void): void;
  close(): void;
  share(url: string, text: string): void;
  // configuration(): { presetUrl: string; appId: string };
  // appId: string;
  // presetUrl: string;
}

// wow, such empty...
export const emptyKarrotMarketMini: KarrotMarketMini = {
  startPreset(...args) {
    console.log(...args);
  },
  close(...args) {
    console.log(...args);
  },
  share(...args) {
    console.log(...args);
  },
};

export const KarrotMarketMiniContext = createContext(emptyKarrotMarketMini);
export const useKarrotMarketMini = () => useContext(KarrotMarketMiniContext);
