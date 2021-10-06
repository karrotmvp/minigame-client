/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

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

const ClickerGame = ({ score, onIncrease }: ClickerGameProps) => {
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
  const gameContainer = document.getElementById('clicker-game__container');
  const karrotImage = require('assets/karrot.png').default;

  const clickerAnimation = async (e: any) => {
    let posX = e.pageX;
    let posY = e.pageY;
    let karrot = document.createElement('img');
    karrot.src = karrotImage;
    karrot.className = `karrot`;
    karrot.style.position = `absolute`;
    karrot.style.left = `${posX}px`;
    karrot.style.top = `${posY}px`;

    gameContainer?.appendChild(karrot);

    setTimeout(() => {
      karrot.remove();
    }, 1000);
  };

  const handleClick = async (e: any) => {
    await onIncrease();
    await clickerAnimation(e);
  };
  return (
    <div id="clicker-game__container" css={fullScreen} onClick={handleClick}>
      <h1>{score}</h1>
    </div>
  );
};

export default ClickerGame;
