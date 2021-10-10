/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactComponent as PointingFinger } from 'assets/PointingFinger.svg';

const directionText = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* or 23px */

  text-align: center;

  color: #ffffff;
`;
const GameDirectionPopupModal = () => {
  return (
    <>
      <PointingFinger />
      <p css={directionText}>
        아무 곳이나 눌러보세요!
        <br />
        10번을 누르면
        <br />
        1개의 당근을 모을 수 있어요
      </p>
    </>
  );
};

export default GameDirectionPopupModal;
