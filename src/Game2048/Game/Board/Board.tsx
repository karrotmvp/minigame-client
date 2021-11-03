import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useGame } from '../hooks/useGame';
import { Tile, TileProps } from '../Tile';
import { boardMargin, boardPadding } from './styles/Board';
import { BoardProvider } from './context/BoardContext';

const Container = styled.div`
  position: relative;
`;

const TileContainer = styled.div<{ boardWidth: number }>`
  position: absolute;
  z-index: 2;

  width: calc(100% - ${boardMargin}rem * 2);
  // height: ${(props) => props.boardWidth}px;
  margin-left: ${boardMargin}rem;
`;
const Grid = styled.div`
  width: calc(100% - ${boardMargin}rem * 2);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${boardPadding}rem;
  background: black;

  margin: ${boardMargin}rem;
  border: ${boardPadding}rem solid;
`;

const Cell = styled.div`
  aspect-ratio: 1;
  background: hotpink;
`;

type Props = {
  tiles: TileProps[];
};
export const Board = ({ tiles }: Props) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [boardWidth, setBoardWidth] = useState<number>(0);
  useEffect(() => {
    setBoardWidth(ref.current.offsetWidth);
  }, []);

  // const boardWidth = `calc(100 % - ${boardMargin} * 2)`;
  return (
    <Container className="board">
      {/* <BoardProvider boardWidth={ref}> */}
      <TileContainer
        className="tile-container"
        ref={ref}
        boardWidth={boardWidth}
      >
        {tiles.map(({ id, ...rest }) => (
          <Tile boardWidth={boardWidth} id={id} key={`tile-${id}`} {...rest} />
        ))}
        {/* {tileList} */}
      </TileContainer>
      <Grid>
        {[...Array(16)].map((x, i) => (
          <Cell key={i} />
        ))}
      </Grid>
      {/* </BoardProvider> */}
    </Container>
  );
};
