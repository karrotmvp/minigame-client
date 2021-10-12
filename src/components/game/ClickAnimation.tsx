/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { ReactComponent as Karrot } from 'assets/karrot.svg';

interface karrotStyleProps {
  posX: number;
  posY: number;
}
const karrotStyle = ({ posX, posY }: karrotStyleProps) => css`
  left: ${posX}px;
  top: ${posY}px;
  position: absolute;
  z-index: 10000;
`;
interface ClickAnimationProps {
  posX: number;
  posY: number;
}
const ClickAnimation = ({ posX, posY }: ClickAnimationProps) => {
  return (
    <>
      <Karrot css={karrotStyle({ posX, posY })} />
    </>
  );
};

export default ClickAnimation;
