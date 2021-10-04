/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

// const fullWidthButton = css`
//   background: #eb5d0e;
//   width: 100%;
//   color: white;
//   font-size: 24px;
//   // border-radius: 4px;
//   padding: 32px;
//   text-align: center;
//   border: none;
//   position: absolute;
//   bottom: 0;
// `;

// export { fullWidthButton };

const buttonStyle = ({ size, position }: any) => css`
  //
  // button style
  //
  background: #eb5d0e;
  text-align: center;
  border: none;
  border-radius: 10px;
  padding: 10px 10px;
  position: relative
  z-index: 100;
  //
  // button text style
  //
  font-style: normal;
  font-weight: bold;
  line-height: 161.7%;
  /* identical to box height, or 26px */
  color: #ffffff;
  ${
    size === `fullWidth`
      ? `
        padding-top: 20px;
        padding-bottom: 30px;
        width: 100%;
        border-radius: 0;
        font-size: 20px;
      `
      : size === `large`
      ? `
     
        width: 80%;
        margin: 20px;
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
      : null
  }
  ${
    position === `bottom`
      ? ` 
        position: absolute;
        bottom: 0;
        `
      : null
  }
`;

interface ButtonProps {
  position: string | null;
  size: string;
  text: string;
  onClick: () => void;
}
const Button = ({ size, position, text, onClick }: ButtonProps) => {
  return (
    <button css={buttonStyle({ size, position })} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
