import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/styled';
import { useGame } from '../hooks/useGame';
import { Tile, TileProps } from '../Tile';
import { boardMargin, boardPadding } from '../styles';

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
  const tileContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [boardWidth, setBoardWidth] = useState<number>(0);

  useLayoutEffect(() => {
    function updateSize() {
      setBoardWidth(tileContainerRef.current.offsetWidth);
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
          <Tile boardWidth={boardWidth} id={id} key={`tile-${id}`} {...rest} />
        ))}
      </TileContainer>
      <Grid>
        {[...Array(16)].map((x, i) => (
          <Cell key={i} />
        ))}
      </Grid>
    </Container>
  );
};
