/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ReactComponent as PointingFinger } from 'assets/svg/KarrotClicker/pointing_finger.svg';
import { Button } from 'components/Button/Button';

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
  setIsUserNew: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Guide: React.FC<PopupModalProps> = (props) => {
  const handleClick = () => {
    props.setIsUserNew(false);
  };
  return (
    <>
      <PointingFinger />
      <p css={directionText}>
        점점 작아지는 당근을 터치해
        <br />
        당근을 모아보세요!
        <br />
        계속 터치하면 당근은
        <br />
        작아지지 않아요
      </p>
      <Button
        size={`medium`}
        color={`secondary`}
        text={`게임 시작하기`}
        onClick={handleClick}
      />
    </>
  );
};
