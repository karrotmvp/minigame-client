import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Tile, TileProps } from '../Tile';
import { boardMargin, boardPadding } from '../styles';
import { SwipeableHandlers } from 'react-swipeable';
import { DebouncedState } from 'use-debounce/lib/useDebouncedCallback';
import { Guide } from './Guide';

type Props = {
  handlers: SwipeableHandlers;
  tileList: TileProps[];
  handleKeyDown: DebouncedState<(e: KeyboardEvent) => void>;
  isUserNew: boolean;
  setIsUserNew: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Board: React.FC<Props> = (props) => {
  const tileContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [cellWidth, setCellWidth] = useState<number>(0);

  // change board & tile size responsively to window size
  useLayoutEffect(() => {
    function updateSize() {
      setCellWidth(
        (tileContainerRef.current.offsetWidth - 5 * boardPadding * 16) / 4
      );
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', props.handleKeyDown);
    return () => {
      window.removeEventListener('keydown', props.handleKeyDown);
    };
  }, [props.handleKeyDown]);

  return (
    <Container
      className="board"
      {...props.handlers}
      onPointerDown={() => props.setIsUserNew(false)}
    >
      <TileContainer className="tile-container" ref={tileContainerRef}>
        {props.tileList.map(({ id, ...rest }) => (
          <Tile id={id} key={`tile-${id}`} {...rest} cellWidth={cellWidth} />
        ))}
      </TileContainer>
      <Grid>
        {[...Array(16)].map((x, i) => (
          <Cell key={i} cellWidth={cellWidth} />
        ))}
      </Grid>
      {props.isUserNew ? <Guide cellWidth={cellWidth} /> : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const TileContainer = styled.div`
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
  border-radius: 10px;
`;
