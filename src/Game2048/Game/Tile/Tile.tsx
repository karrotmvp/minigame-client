import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { usePrevious } from '../hooks/usePrevious';
import { boardMargin, boardPadding } from '../Board/styles/Board';

export type TileProps = {
  id: number;
  coordinate: [number, number];
  value: number;
};

interface Props extends TileProps {
  boardWidth: number;
}

const SingleTile = styled.div`
  position: absolute;
  // aspect-ratio: 1;
  // font-weight: bold;
  text-align: center;

  transition-property: left, top, transform;
  transition-duration: 250ms, 250ms, 100ms;
  transform: scale(1);
  background: yellow;
`;

export const Tile = ({ boardWidth, id, coordinate, value }: Props) => {
  const [scale, setScale] = useState(1);
  const tileWidth = (boardWidth - boardPadding * 16 * 5) / 4;
  const coordinateToPixels = (coordinate: number) => {
    const pixel = (coordinate / 4) * boardWidth + boardPadding * 16;
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
  console.log(coordinate);
  const style = {
    width: tileWidth,
    height: tileWidth,
    top: coordinateToPixels(coordinate[1]),
    left: coordinateToPixels(coordinate[0]),
    transform: `scale(${scale})`,
  };

  return (
    <SingleTile className={`tile id-${id} value-${value}`} style={style}>
      {value}
    </SingleTile>
  );
};
