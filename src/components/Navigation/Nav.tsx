import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';

const Wrapper = styled.div`
  left: 0;
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  // height: ${rem(60)};
  padding: ${rem(50)} ${rem(25)} ${rem(25)};
  background: transparent;
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

type Props = {
  appendLeft?: React.ReactNode;
  apppendRight?: React.ReactNode;
  onClickLeft?: () => void;
  onClickRight?: () => void;
};
export const Nav = (props: Props) => {
  return (
    <Wrapper className="nav">
      <Left onClick={props.onClickLeft}>{props.appendLeft}</Left>
      <Right onClick={props.onClickRight}>{props.apppendRight}</Right>
    </Wrapper>
  );
};
