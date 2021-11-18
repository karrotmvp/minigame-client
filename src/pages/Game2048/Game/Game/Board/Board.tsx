import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { MemoizedTile as Tile } from '../Tile';
import { animationDuration, boardMargin, boardPadding } from '../styles';
import { useSwipeable } from 'react-swipeable';
import { Guide } from './Guide';
import { useGame } from '../../hooks';
import { useThrottledCallback } from 'use-debounce/lib';
import { MemoizedGrid as Grid } from '.';

type Props = {
  isUserNew: boolean;
  setIsUserNew: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Board: React.FC<Props> = (props) => {
  const { score, tileList, moveRight, moveLeft, moveUp, moveDown } = useGame();
  const [cellWidth, setCellWidth] = useState<number>(0);
  const tileContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const refPassthrough = (el: any) => {
    handlers.ref(el);
    tileContainerRef.current = el;
  };

  // =================================================================
  // mobile(touch) friendly
  const handlers = useSwipeable({
    onSwipeStart: (eventData) => {
      console.log(eventData);
      switch (eventData.dir) {
        case 'Left':
          moveLeft();
          break;
        case 'Right':
          moveRight();
          break;
        case 'Up':
          moveUp();
          break;
        case 'Down':
          moveDown();
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
          moveRight();
          break;
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
      }
    },
    animationDuration
    // { leading: true, trailing: false }
  );
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <TileContainer
        {...handlers}
        ref={refPassthrough}
        className="game-board"
        onPointerDown={() => props.setIsUserNew(false)}
      >
        {tileList.map(({ id, ...rest }) => (
          <Tile id={id} key={`tile-${id}`} {...rest} cellWidth={cellWidth} />
        ))}
        {props.isUserNew ? <Guide cellWidth={cellWidth} /> : null}
      </TileContainer>

      <Grid cellWidth={cellWidth} />
    </>
  );
};

const TileContainer = styled.div`
  position: absolute;
  z-index: 2;
  width: calc(100% - ${boardMargin}rem * 2);
  // height: auto;
  padding-top: calc(100% - ${boardMargin}rem * 2);
  margin: ${boardMargin}rem;
`;
