/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem } from 'polished';

const oldButtonStyle = ({ size, color }: any) => css`
  background: ${
    color === `primary` ? `#EB5D0E` : `secondary` ? `#F39E6E` : `#F39E6E`
  };

  box-shadow: ${
    color === `primary`
      ? `0px 6px 0px 0px #C64F0C`
      : `secondary`
      ? `0px 6px 0px 0px #DF814B`
      : `0px 6px 0px 0px #DF814B`
  };

  text-align: center;
  border: none;
  border-radius: 10px;
  padding: 10px 10px;

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
      : null
  };

  //  padding: 0;
  //   font: inherit;
  //   outline: none;
  //   user-select: none;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;

  &:active {
    // outline: none;

   -moz-user-select
  }
`;

interface ButtonProps {
  size: string;
  color?: string;
  text: string;
  onClick?: any;
  children?: React.ReactNode;
}

export const OldDisabledButton = ({ size, text }: ButtonProps) => {
  return (
    <button
      css={oldButtonStyle({ size })}
      style={{
        backgroundColor: 'rgba(235, 93, 14, 0.4)',
        boxShadow: `0px 6px 0px 0px #E89261`,
      }}
      disabled
    >
      {text}
    </button>
  );
};

export const OldButton = ({ size, color, text, onClick }: ButtonProps) => {
  return (
    <button css={oldButtonStyle({ size, color })} onClick={onClick}>
      {text}
    </button>
  );
};

type Props = {
  size: string;
  fontSize: string;
  color: string;
  onClick?: any;
  children?: React.ReactNode;
  type?: string;
};

const CustomButton = styled.a<{
  size: string;
  fontSize: string;
  color: string;
}>`
  text-align: center;
  border: none;
  border-radius: 10px;
  font-style: normal;
  line-height: 161.7%;
  width: ${(props) => (props.size === `large` ? `100%` : `fit-content`)};

  padding: ${(props) =>
    props.size === `large`
      ? `${rem(8)} 0`
      : `tiny`
      ? `${rem(6)} ${rem(11)} ${rem(5)}`
      : `0`};

  font-weight: ${(props) =>
    props.size === `large`
      ? 'bold'
      : props.color === `secondary2`
      ? `bold`
      : `normal`};

  font-size: ${(props) => props.fontSize};

  color: ${(props) =>
    props.color === `primary`
      ? `#FFFFFF`
      : props.color === `secondary1`
      ? `#FFFFFF`
      : props.color === `secondary2`
      ? `#82B6FF`
      : props.type === `disabled`
      ? `#FFFFFF`
      : `#FFFFFF`};

  background: ${(props) =>
    props.color === `primary`
      ? `#0E74FF`
      : props.color === `secondary1`
      ? `#82B6FF`
      : props.color === `secondary2`
      ? `#FFFFFF`
      : props.type === `disabled`
      ? `#E3EFFF`
      : `#E3EFFF`};

  box-shadow: ${(props) =>
    props.color === `primary`
      ? `0px 6px 0px 0px #1457AE`
      : props.color === `secondary1`
      ? `0px 6px 0px 0px #4192FF`
      : props.color === `secondary2`
      ? `0px 6px 0px 0px #C8D8EE`
      : `0px 6px 0px 0px #E3EFFF`};

  pointer-events: ${(props) => (props.type === `disabled` ? `none` : `auto`)};
`;

export const Button: React.FC<Props> = (props) => {
  return (
    <CustomButton
      size={props.size}
      fontSize={props.fontSize}
      color={props.color}
      onClick={props.onClick}
    >
      {props.children}
    </CustomButton>
  );
};

export const DisabledButton: React.FC<Props> = (props) => {
  return (
    <CustomButton
      size={props.size}
      fontSize={props.fontSize}
      color={props.color}
      type={`disabled`}
    >
      {props.children}
    </CustomButton>
  );
};
