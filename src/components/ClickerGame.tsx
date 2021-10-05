/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const fullScreen = css`
  height: 100%;
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
`;

function ClickerGame({ score, onIncrease }: any) {
  return (
    <div css={fullScreen} onClick={onIncrease}>
      <h1>{score}</h1>
    </div>
  );
}

export default ClickerGame;
