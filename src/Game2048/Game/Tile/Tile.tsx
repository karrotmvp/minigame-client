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
}

const SingleTile = styled.div<{ value: number }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  transition-property: left, top, transform;
  transition-duration: 250ms, 250ms, 100ms;
  transform: scale(1);

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
  const style = {
    width: tileWidth,
    height: tileWidth,
    top: coordinateToPixels(coordinate[1]),
    left: coordinateToPixels(coordinate[0]),
    transform: `scale(${scale})`,
  };

  return (
    <SingleTile
      className={`tile id-${id} value-${value}`}
      style={style}
      value={value}
    >
      {value}
    </SingleTile>
  );
};
