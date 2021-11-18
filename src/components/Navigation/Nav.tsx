/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';

type Props = {
  appendLeft?: React.ReactNode;
  appendRight?: React.ReactNode;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  backgroundColor?: string;
  border?: string;
};
export const Nav = (props: Props) => {
  return (
    <Wrapper
      className="nav"
      backgroundColor={props.backgroundColor}
      border={props.border}
    >
      <a onClick={props.onClickLeft}>{props.appendLeft}</a>
      <a onClick={props.onClickRight}>{props.appendRight}</a>
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  backgroundColor: string | undefined;
  border: string | undefined;
}>`
  display: flex;
  flex-flow: row;
  align-items: flex-end;
  justify-content: space-between;
  // height: ${rem(68)};
  padding: ${rem(28)} ${rem(22)} ${rem(16)};
  background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : `inherit`};

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
