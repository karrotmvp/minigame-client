/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import Expire from './ClickAnimation';

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
  //
  // Convert the bottom code to React component
  //
  // Create 당근 component
  // Pass posX and posY of screen to props
  // When Clicked, the component is set to "visible" with corresponding posX and posY
  // useState can be used for visibility [visible, setVisible]
  //
  // features may be added later:
  // - random visible time (no need to have constant 1 sec)
  // const gameContainer = document.getElementById('clicker-game__container');
  // const karrotImage = require('assets/karrot.png').default;

  // const clickerAnimation = async (e: any) => {
  //   let posX = e.nativeEvent.offsetX - 25;
  //   let posY = e.nativeEvent.offsetY - 25;
  //   let karrot = document.createElement('img');
  //   karrot.src = karrotImage;
  //   karrot.className = `karrot`;
  //   karrot.style.position = `absolute`;
  //   karrot.style.left = `${posX}px`;
  //   karrot.style.top = `${posY}px`;
  //   karrot.style.zIndex = `1000`;

  //   gameContainer?.appendChild(karrot);

  //   setTimeout(() => {
  //     karrot.remove();
  //   }, 10000);
  // };
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
    }, 100);
    // await clickerAnimation(e);
    unmountComponentAtNode(document.getElementById('root'));
  };

  return (
    <div id="clicker-game__container" css={fullScreen} onClick={handleClick}>
      <h1>{score}</h1>
      <Expire
        delay={100}
        posX={position[0]}
        posY={position[1]}
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  );
};

export default GameContainer;
