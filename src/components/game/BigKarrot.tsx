/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
// import { ReactComponent as BigKarrot } from 'assets/Seocho_daangn.svg';
import { memo, FC } from 'react';
import BigKarrotImageUrl from 'assets/big_karrot.png';

const animationKeyframes = keyframes`
  100% {
    transform: scale(0.01);
    // transform: rotate(45deg);
  }
}
`;

const animation = (animationPlayState: string) => css`
  animation-duration: 5s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-name: ${animationKeyframes};
  animation-fill-mode: forwards;
  animation-play-state: ${animationPlayState};
  // pointer-events: none;
`;

interface BigKarrotProps {
  handleKarrotTouch: React.TouchEventHandler;
  handleGameOver: () => void;
  animationPlayState: string;
}
const BigKarrot: FC<BigKarrotProps> = (props) => {
  console.log(props.animationPlayState);
  return (
    <img
      src={BigKarrotImageUrl}
      alt=""
      // ref={BigKarrotRef as any}
      onTouchStart={props.handleKarrotTouch}
      onAnimationEnd={props.handleGameOver}
      css={animation(props.animationPlayState)}
      style={{
        height: '20rem',
        width: 'auto',
        transform: 'rotate(45deg)',
      }}
    />
  );
};

export default memo(BigKarrot);
