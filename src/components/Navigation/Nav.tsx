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
      <Left onClick={props.onClickLeft}>{props.appendLeft}</Left>
      <Right onClick={props.onClickRight}>{props.appendRight}</Right>
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
  height: ${rem(90)};
  padding: ${rem(50)} ${rem(25)} ${rem(25)};
  background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : `inherit`};

  border-bottom: ${(props) => (props.border ? props.border : `none`)};
  z-index: 10;
  position: sticky;
  // width: 100%;
  top: 0;
  left: 0;
`;

const Left = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 300ms;
  // width: 2.25rem;
  // height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;
const Right = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 300ms;
  // width: 2.25rem;
  // height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;
