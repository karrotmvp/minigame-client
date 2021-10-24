/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactComponent as PointingFinger } from 'assets/PointingFinger.svg';
import Button from 'components/buttons/Button';

const directionText = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* or 23px */

  text-align: center;

  color: #ffffff;
`;

interface PopupModalProps {
  setShouldPopup: any;
}
const GameDirectionPopupModal: React.FC<PopupModalProps> = (props) => {
  return (
    <>
      <PointingFinger />
      <p css={directionText}>
        당근을 모아보세요
        <br />
        단, 당근은 점점 작아져요!
      </p>
      <Button
        size={`medium`}
        color={`secondary`}
        text={`게임 시작하기`}
        onClick={() => {
          props.setShouldPopup(false);
        }}
      />
    </>
  );
};

export default GameDirectionPopupModal;
