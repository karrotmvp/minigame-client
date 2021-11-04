import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Tile, TileProps } from '../Tile';
import { boardMargin, boardPadding } from '../styles';

const Container = styled.div`
  position: relative;
`;

const TileContainer = styled.div<{ boardWidth: number }>`
  position: absolute;
  z-index: 2;
  width: calc(100% - ${boardMargin}rem * 2);
  margin-left: ${boardMargin}rem;
`;
const Grid = styled.div`
  width: calc(100% - ${boardMargin}rem * 2);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${boardPadding}rem;

  margin: ${boardMargin}rem;

  background: #c8d8ee;
  border: ${boardPadding}rem solid #c8d8ee;
  box-sizing: border-box;
  border-radius: 6px;
`;

const Cell = styled.div<{ cellWidth: number }>`
  width: ${(props) => props.cellWidth}px;
  height: ${(props) => props.cellWidth}px;
  background: #f5f8fb;
  border-radius: 3px;
`;

type Props = {
  tiles: TileProps[];
};
export const Board = ({ tiles }: Props) => {
  const tileContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [boardWidth, setBoardWidth] = useState<number>(0);
  const [cellWidth, setCellWidth] = useState<number>(0);

  useLayoutEffect(() => {
    function updateSize() {
      setBoardWidth(tileContainerRef.current.offsetWidth);
      setCellWidth(
        (tileContainerRef.current.offsetWidth - 5 * boardPadding * 16) / 4
      );
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Container className="board">
      <TileContainer
        className="tile-container"
        ref={tileContainerRef}
        boardWidth={boardWidth}
      >
        {tiles.map(({ id, ...rest }) => (
          <Tile
            id={id}
            key={`tile-${id}`}
            {...rest}
            boardWidth={boardWidth}
            cellWidth={cellWidth}
          />
        ))}
      </TileContainer>
      <Grid>
        {[...Array(16)].map((x, i) => (
          <Cell key={i} cellWidth={cellWidth} />
        ))}
      </Grid>
    </Container>
  );
};
