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
  const gameContainer = document.getElementById('clicker-game__container');

  const clickerAnimation = async ({ posX, posY }: any) => {
    let karrot = document.createElement('div');
    karrot.className = `karrot`;
    karrot.style.position = `absolute`;
    karrot.style.width = `30px`;
    karrot.style.height = `30px`;
    karrot.style.backgroundColor = 'hotpink';

    let coords = `x pos: ${posX} & y pos: ${posY}`;
    console.log(coords);

    karrot.style.left = `${posX}px`;
    karrot.style.top = `${posY}px`;
    let karrotImage = document.createElement('img');
    karrotImage.src = 'src/assets/karrot.png';

    karrot.appendChild(karrotImage);
    gameContainer?.appendChild(karrot);

    setTimeout(() => {
      karrot.remove();
    }, 10000);
    console.log('works');
  };

  const handleClick = async (e: any) => {
    let posX = e.clientX;
    let posY = e.clientY;
    await onIncrease();
    await clickerAnimation({ posX, posY });
  };
  return (
    <div id="clicker-game__container" css={fullScreen} onClick={handleClick}>
      <h1>{score}</h1>
    </div>
  );
};

export default ClickerGame;
