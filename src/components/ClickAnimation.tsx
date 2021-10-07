/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { ReactComponent as Karrot } from 'assets/karrot.svg';

const divStyle = ({ posX, posY, visible }: any) => css`
  // display: ${visible ? `block` : `none`};
  position: absolute;
  left: ${posX}px;
  top: ${posY}px;
  // z-index: 1000;
`;

interface ExpireProps {
  delay: number;
  posX: number;
  posY: number;
  visible: boolean;
  setVisible: any;
}
const Expire = ({ delay, posX, posY, visible, setVisible }: ExpireProps) => {
  console.log(posX, posY);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setVisible(false);
  //   }, delay);
  //   return () => {
  //     console.log('clean up?');
  //     setVisible(false);
  //   };
  // }, [delay, setVisible]);

  return (
    <>
      {visible ? (
        <div css={divStyle({ posX, posY, visible })}>
          <Karrot />
        </div>
      ) : (
        <div />
      )}
    </>
  );
};

export default Expire;
