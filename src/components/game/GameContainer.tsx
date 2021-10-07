/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import ClickAnimation from './ClickAnimation';

const fullScreen = css`
  height: 100%;
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
`;

interface ClickerGameProps {
  score: number;
  onIncrease: any;
}

const GameContainer = ({ score, onIncrease }: ClickerGameProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<number[]>([]);

  const handleVisibility = async (e: any) => {
    setPosition([e.nativeEvent.offsetX - 25, e.nativeEvent.offsetY - 25]);
    setVisible(true);
  };
  const handleClick = async (e: any) => {
    e.stopPropagation();
    await onIncrease();
    await handleVisibility(e);
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  return (
    <div id="clicker-game__container" css={fullScreen} onClick={handleClick}>
      <h1>{score}</h1>
      <ClickAnimation posX={position[0]} posY={position[1]} visible={visible} />
    </div>
  );
};

export default GameContainer;
