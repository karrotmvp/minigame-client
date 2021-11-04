import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { usePrevious } from '../hooks/usePrevious';
import { boardPadding } from '../styles';

export type TileProps = {
  id: number;
  coordinate: [number, number];
  value: number;
};

interface Props extends TileProps {
  boardWidth: number;
  cellWidth: number;
}

const SingleTile = styled.div<{
  value: number;
  tileWidth: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.tileWidth}px;
  height: ${(props) => props.tileWidth - 6}px;

  border-radius: 3px

  transition-property: left, top, transform;
  transition-duration: 250ms, 250ms, 100ms;
  transform: ${(props) => `scale(${props.scale})`};
  top: ${(props) => props.offsetY}px;
  left: ${(props) => props.offsetX}px;
  font-style: normal;
  font-weight: 600;
  font-size: ${(props) =>
    props.value < 10 ? `2.5rem` : props.value < 100 ? `2.25rem` : `1rem`};
  color: ${(props) =>
    props.value === 2 ? `#C8D8EE` : 4 ? `#82B6FF` : 8 ? `#FFFFFF` : `#FFFFFF`};
  background: ${(props) =>
    props.value === 2 ? `#F5F8FB` : 4 ? `#E3EFFF` : 8 ? `#82B6FF` : `#2B2B2B`};

  box-shadow: ${(props) =>
    props.value === 2
      ? `0px 6px 0px 0px #AEC6DD`
      : 4
      ? `0px 6px 0px 0px #83B8FF`
      : 8
      ? `0px 6px 0px 0px #4192FF`
      : `0px 6px 0px 0px #000000`};
`;

export const Tile = ({
  boardWidth,
  cellWidth,
  id,
  coordinate,
  value,
}: Props) => {
  const [scale, setScale] = useState(1);
  console.log(boardWidth);
  const tileWidth = cellWidth;
  const coordinateToPixels = (coordinate: number) => {
    const pixel =
      (cellWidth + boardPadding * 16) * coordinate + boardPadding * 16;
    console.log(pixel);
    return pixel;
  };

  const perviousValue = usePrevious(value);
  const isNew = perviousValue === undefined;
  const hasChanged = perviousValue !== value;
  const shouldAnimate = isNew || hasChanged;

  useEffect(() => {
    if (shouldAnimate) {
      setScale(1.1);
      setTimeout(() => setScale(1), 100);
    }
  }, [shouldAnimate, scale]);

  return (
    <SingleTile
      className={`tile id-${id} value-${value}`}
      value={value}
      tileWidth={tileWidth}
      scale={scale}
      offsetX={coordinateToPixels(coordinate[0])}
      offsetY={coordinateToPixels(coordinate[1])}
    >
      {value}
    </SingleTile>
  );
};
