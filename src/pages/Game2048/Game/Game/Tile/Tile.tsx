import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { usePrevious } from '../../hooks';
import { boardPadding } from '../styles';

export type TileProps = {
  id: number;
  coordinate: [number, number];
  value: number;
};

interface Props extends TileProps {
  cellWidth: number;
}

const Tile: React.FC<Props> = (props) => {
  const [scale, setScale] = useState(1);
  const tileWidth = props.cellWidth;
  const coordinateToPixels = (coordinate: number) => {
    const pixel =
      (props.cellWidth + boardPadding * 16) * coordinate + boardPadding * 16;
    return pixel;
  };

  const perviousValue = usePrevious(props.value);
  const isNew = perviousValue === undefined;
  const hasChanged = perviousValue !== props.value;
  const shouldAnimate = isNew || hasChanged;

  useEffect(() => {
    if (shouldAnimate) {
      setScale(1.1);
      setTimeout(() => setScale(1), 100);
    }
  }, [shouldAnimate, scale]);

  return (
    <SingleTile
      style={{
        top: coordinateToPixels(props.coordinate[1]),
        left: coordinateToPixels(props.coordinate[0]),
        transform: `scale(${scale})`,
      }}
      value={props.value}
      tileWidth={tileWidth}
    >
      {props.value}
    </SingleTile>
  );
};
export const MemoizedTile = React.memo(Tile);

const SingleTile = styled.div<{
  value: number;
  tileWidth: number;
}>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.tileWidth}px;
  height: ${(props) => props.tileWidth - 6}px;
  font-family: 'Montserrat', sans-serif;
  border-radius: 3px;

  transition-property: left, top, transform;
  transition-duration: 150ms, 150ms, 150ms;

  font-style: normal;
  font-weight: 600;
  font-size: ${(props) =>
    props.value < 10
      ? `2.5rem`
      : props.value < 100
      ? `2.25rem`
      : props.value < 1000
      ? `1.875rem`
      : props.value < 10000
      ? `1.125rem`
      : `1rem`};
  color: ${(props) =>
    props.value === 2 ? `#AEC5DD` : props.value === 4 ? `#83B8FF` : `#FFFFFF`};
  background: ${(props) =>
    props.value === 2
      ? `#F5F8FB`
      : props.value === 4
      ? `#E3EFFF`
      : props.value === 8
      ? `#82B6FF`
      : props.value === 16
      ? `#4694FF`
      : props.value === 32
      ? `#0E74FF`
      : props.value === 64
      ? `#004DB7`
      : props.value === 128
      ? `#FFD789`
      : props.value === 256
      ? `#FFC554`
      : props.value === 512
      ? `#FFA800`
      : props.value < 4000
      ? `#FFA775`
      : props.value < 10000
      ? `#FF8845`
      : props.value < 100000
      ? `#EB5D0E`
      : `#2B2B2B`};

  box-shadow: ${(props) =>
    props.value === 2
      ? `0px 6px 0px 0px #AEC6DD`
      : props.value === 4
      ? `0px 6px 0px 0px #83B8FF`
      : props.value === 8
      ? `0px 6px 0px 0px #4192FF`
      : props.value === 16
      ? `0px 6px 0px 0px #006CFF`
      : props.value === 32
      ? `0px 6px 0px 0px #005AD5`
      : props.value === 64
      ? `0px 6px 0px 0px #003379`
      : props.value === 128
      ? `0px 6px 0px 0px #FFC34E`
      : props.value === 256
      ? `0px 6px 0px 0px #FFAB09`
      : props.value === 512
      ? `0px 6px 0px 0px #E29500`
      : props.value < 4000
      ? `0px 6px 0px 0px #FF8A48`
      : props.value < 10000
      ? `0px 6px 0px 0px #FF6F1E`
      : props.value < 100000
      ? `0px 6px 0px 0px #D64D00`
      : `0px 6px 0px 0px #000000`};
`;
