import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { MemoizedTile as Tile } from '../Tile';
import type { TileProps } from '../Tile';
import { boardMargin, boardPadding } from '../styles';
import { useSwipeable } from 'react-swipeable';
import { MemoizedGrid as Grid } from '.';

type Props = {
  tileList: TileProps[];
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
};
export const Board: React.FC<Props> = (props) => {
  const [cellWidth, setCellWidth] = useState<number>(0);
  const tileContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const refPassthrough = (el: any) => {
    handlers.ref(el);
    tileContainerRef.current = el;
  };

  // mobile(touch) friendly
  const handlers = useSwipeable({
    onSwipeStart: (eventData) => {
      switch (eventData.dir) {
        case 'Left':
          props.moveLeft();
          break;
        case 'Right':
          props.moveRight();
          break;
        case 'Up':
          props.moveUp();
          break;
        case 'Down':
          props.moveDown();
          break;
      }
    },
    delta: 10,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

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

  return (
    <Grid cellWidth={cellWidth}>
      <TileContainer {...handlers} ref={refPassthrough} className="game-board">
        {props.tileList.map(({ id, ...rest }) => (
          <Tile id={id} key={id} {...rest} cellWidth={cellWidth} />
        ))}
      </TileContainer>
    </Grid>
  );
};

const TileContainer = styled.div`
  position: absolute;
  z-index: 2;
  width: calc(100% - ${boardMargin}rem * 2);
  height: auto;
  padding-top: calc(100% - ${boardMargin}rem * 2);

  margin-left: -${boardPadding}rem;
  margin-top: -${boardPadding}rem;
`;
