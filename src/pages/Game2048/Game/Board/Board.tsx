import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/styled';
import { Tile, TileProps } from '../Tile';
import { animationDuration, boardMargin, boardPadding } from '../styles';
import { useGame } from '../hooks/useGame';
import { useThrottledCallback } from 'use-debounce/lib';
import { useSwipeable } from 'react-swipeable';

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

export const Board = () => {
  const tileContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [boardWidth, setBoardWidth] = useState<number>(0);
  const [cellWidth, setCellWidth] = useState<number>(0);

  const { tileList, moveRight, moveLeft, moveUp, moveDown } = useGame();

  // mobile(touch) friendly
  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log('User Swiped!', eventData),
    onSwipedLeft: useThrottledCallback(() => moveLeft(), animationDuration, {
      leading: true,
      trailing: false,
    }),
    onSwipedRight: useThrottledCallback(() => moveRight(), animationDuration, {
      leading: true,
      trailing: false,
    }),
    onSwipedUp: useThrottledCallback(() => moveUp(), animationDuration, {
      leading: true,
      trailing: false,
    }),
    onSwipedDown: useThrottledCallback(() => moveDown(), animationDuration, {
      leading: true,
      trailing: false,
    }),
    preventDefaultTouchmoveEvent: true,
  });

  // desktop(keyboard) friendly
  const handleKeyDown = useCallback(
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
      console.log('GameSection', tileList);
    },
    [tileList, moveRight, moveLeft, moveUp, moveDown]
  );
  const throttledHandleKeyDown = useThrottledCallback(
    handleKeyDown,
    animationDuration,
    { leading: true, trailing: false }
  );
  useEffect(() => {
    window.addEventListener('keydown', throttledHandleKeyDown);

    return () => {
      window.removeEventListener('keydown', throttledHandleKeyDown);
    };
  }, [throttledHandleKeyDown]);

  // change board & tile size responsively to window size
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
    <Container className="board" {...handlers}>
      <TileContainer
        className="tile-container"
        ref={tileContainerRef}
        boardWidth={boardWidth}
      >
        {tileList.map(({ id, ...rest }) => (
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
