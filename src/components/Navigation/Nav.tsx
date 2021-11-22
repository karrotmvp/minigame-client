/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';

export const navHeight = 68;

type Props = {
  appendLeft?: React.ReactNode;
  appendRight?: React.ReactNode;
  onClickLeft?: () => void;
  onClickRight?: () => void;

  border?: string;
  style?: React.CSSProperties;
};
export const Nav = (props: Props) => {
  return (
    <Wrapper className="nav" border={props.border} style={props.style}>
      <a onClick={props.onClickLeft}>{props.appendLeft}</a>
      <a onClick={props.onClickRight}>{props.appendRight}</a>
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  border: string | undefined;
}>`
  display: flex;
  flex-flow: row;
  align-items: flex-end;
  justify-content: space-between;
  height: ${navHeight}px;
  padding: 28px 22px 16px;

  border-bottom: ${(props) => (props.border ? props.border : `none`)};
  z-index: 10;
  position: sticky;
  // width: 100%;
  top: 0;
  left: 0;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    outline: none;
    z-index: 10;
  }
`;
