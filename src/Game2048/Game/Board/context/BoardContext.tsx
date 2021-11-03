import { createContext } from 'react';
// import { tileCount as defaultTileCount } from "../index";

export const BoardContext = createContext({
  boardWidth: 0,
});

type Props = {
  boardWidth: number;
  children: any;
};

export const BoardProvider = ({ children, boardWidth = 0 }: Props) => {
  return (
    <BoardContext.Provider value={{ boardWidth }}>
      {children}
    </BoardContext.Provider>
  );
};
