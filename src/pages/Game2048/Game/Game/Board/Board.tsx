import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { MemoizedTile as Tile, TileProps } from '../Tile';
import { animationDuration, boardMargin, boardPadding } from '../styles';
import { useSwipeable } from 'react-swipeable';
import { Guide } from './Guide';
import { useThrottledCallback } from 'use-debounce/lib';
import { MemoizedGrid as Grid } from '.';

type Props = {
  isUserNew: boolean;
  setIsUserNew: React.Dispatch<React.SetStateAction<boolean>>;
  tileList: TileProps[];
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
};
export const Board: React.FC<Props> = (props) => {
  // const { score, tileList, moveRight, moveLeft, moveUp, moveDown, resetGame } =
  //   useGame();
  const [cellWidth, setCellWidth] = useState<number>(0);
  const tileContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const refPassthrough = (el: any) => {
    handlers.ref(el);
    tileContainerRef.current = el;
  };

  // const { tileList, moveRight, moveLeft, moveUp, moveDown, resetGame } =
  //   useGame();

  // =================================================================
  // mobile(touch) friendly
  const handlers = useSwipeable({
    onSwipeStart: (eventData) => {
      console.log(eventData);
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
  // desktop(keyboard) friendly
  const handleKeyDown = useThrottledCallback(
    (e: KeyboardEvent) => {
      // disables page scrolling with keyboard arrows
      e.preventDefault();
      switch (e.code) {
        case 'ArrowRight':
          props.moveRight();
          break;
        case 'ArrowLeft':
          props.moveLeft();
          break;
        case 'ArrowUp':
          props.moveUp();
          break;
        case 'ArrowDown':
          props.moveDown();
          break;
      }
    },
    animationDuration
    // { leading: true, trailing: false }
  );
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  // =================================================================

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
      <TileContainer
        {...handlers}
        ref={refPassthrough}
        className="game-board"
        onPointerDown={() => props.setIsUserNew(false)}
      >
        {props.tileList.map(({ id, ...rest }) => (
          <Tile id={id} key={`tile-${id}`} {...rest} cellWidth={cellWidth} />
        ))}
        {props.isUserNew ? <Guide cellWidth={cellWidth} /> : null}
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
