/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { ReactComponent as Karrot } from 'assets/karrot.svg';

interface karrotStyleProps {
  posX: number;
  posY: number;
}
const animation = keyframes`
  100% {
    transform: translateY(-500%);
    opacity: 0;
  }
}
`;
const karrotStyle = ({ posX, posY }: karrotStyleProps) => css`
  left: ${posX}px;
  top: ${posY}px;
  position: absolute;
  z-index: 10;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-name: ${animation};

  pointer-events: none;

  // transform: translateY(-500%);

  // transition: transform 500ms ease-in-out 25ms;
`;
interface ClickAnimationProps {
  posX: number;
  posY: number;
}
const ClickAnimation: React.FC<ClickAnimationProps> = (props) => {
  return (
    <>
      <Karrot css={karrotStyle({ posX: props.posX, posY: props.posY })} />
    </>
  );
};

export default ClickAnimation;
