/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyle = ({ size, color }: any) => css`
  background: ${color === `primary`
    ? `#eb5d0e`
    : `secondary`
    ? `#F39E6E`
    : `#F39E6E`};
  text-align: center;
  border: none;
  border-radius: 10px;
  padding: 10px 10px;
  // position: relative
  // z-index: 100;

  font-style: normal;
  font-weight: bold;
  line-height: 161.7%;
  /* identical to box height, or 26px */
  color: #ffffff;
  ${size === `fullWidth`
    ? `
        padding-top: 20px;
        padding-bottom: 30px;
        width: 100%;
        border-radius: 0;
        font-size: 20px;
      `
    : size === `large`
    ? `
     
        width: 100%;
        // margin: 20px;
        border-radius: 10px;
        font-size: 16px;
      `
    : size === `medium`
    ? `
        width: 150px;
        padding: 10px 20px;

        `
    : size === `small`
    ? `
        width: 100px;
        padding: 10px 20px;

        `
    : null}
`;

interface ButtonProps {
  size: string;
  color: string;
  text: string;
  onClick: () => void;
}
const Button = ({ size, color, text, onClick }: ButtonProps) => {
  return (
    <button css={buttonStyle({ size, color })} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
