import { createContext, useContext } from 'react';

export const game2048ApiContext = createContext({});
export const useGame2048Api = () => useContext(game2048ApiContext);
