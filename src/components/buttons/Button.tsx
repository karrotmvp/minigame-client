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
        border-radius: 10px;
        font-size: 16px;
      `
    : size === `medium`
    ? `
        width: 100%;
        padding: 10px 20px;
        font-size: 16px;


        `
    : size === `small`
    ? `
        width: 100px;
        padding: 10px 20px;

        `
    : null}

  box-shadow: 0px 8px 0px 0px #000000;
`;

interface ButtonProps {
  size: string;
  color?: string;
  text: string;
  onClick?: () => void;
}

export const DisabledButton = ({ size, text }: ButtonProps) => {
  return (
    <button
      css={buttonStyle({ size })}
      style={{
        background: '#D7D7D7',
      }}
      disabled
    >
      {text}
    </button>
  );
};

const Button = ({ size, color, text, onClick }: ButtonProps) => {
  return (
    <button css={buttonStyle({ size, color })} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
