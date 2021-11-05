/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem } from 'polished';

const oldButtonStyle = ({ size, color }: any) => css`
  background: ${color === `primary`
    ? `#EB5D0E`
    : `secondary`
    ? `#F39E6E`
    : `#F39E6E`};

  box-shadow: ${color === `primary`
    ? `0px 6px 0px 0px #C64F0C`
    : `secondary`
    ? `0px 6px 0px 0px #DF814B`
    : `0px 6px 0px 0px #DF814B`};

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
`;

interface ButtonProps {
  size: string;
  color?: string;
  text: string;
  onClick?: any;
  children?: React.ReactNode;
}

export const DisabledButton = ({ size, text }: ButtonProps) => {
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
  // fontSize: string;
  // fontColor: string;
  // buttonColor: string;
  // shadowColor: string;
  size: string;
  color: string;
  onClick?: any;
  children?: React.ReactNode;
};

const CustomButton = styled.div<{ size: string }>`
  text-align: center;
  border: none;
  border-radius: 10px;

  font-size: ${(props) => (props.size === `tiny` ? rem(14) : `1rem`)};
  color: ${(props) => (props.color === `secondary` ? `#82B6FF` : `hotpink`)};
  background: ${(props) =>
    props.color === `secondary` ? `#FFFFFF` : `hotpink`};
  box-shadow: ${(props) =>
    props.color === `secondary` ? `0px 6px 0px 0px #C8D8EE` : `hotpink`};

  padding: ${(props) =>
    props.size === `tiny` ? `${rem(6)} ${rem(11)} ${rem(5)}` : `1rem`};
`;

export const Button = (props: Props) => {
  return (
    <CustomButton size={props.size} color={props.color} onClick={props.onClick}>
      {props.children}
    </CustomButton>
  );
};
