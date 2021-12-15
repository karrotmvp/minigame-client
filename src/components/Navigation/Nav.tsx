/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from '@emotion/styled';
// import { ScreenHelmet } from '@karrotframe/navigator';
import React from 'react';
import { navHeight } from 'styles';

type Props = {
  appendLeft?: React.ReactNode;
  appendRight?: React.ReactNode;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  appendCenter?: React.ReactNode;
  border?: string;
  style?: React.CSSProperties;
};
export const Nav = (props: Props) => {
  return (
    // <ScreenHelmet>
    <NavContainer className="nav" border={props.border} style={props.style}>
      <a onClick={props.onClickLeft}>{props.appendLeft}</a>
      <div className="centered">{props.appendCenter}</div>
      <a onClick={props.onClickRight}>{props.appendRight}</a>
    </NavContainer>
    // </ScreenHelmet>
  );
};

// export const Nav: React.FC<Props> = (props) => {
//   return (
//     <ScreenHelmet
//       appendLeft={<a onClick={props.onClickLeft}>{props.appendLeft}</a>}
//       appendRight={<a onClick={props.onClickRight}>{props.appendRight}</a>}
//     />
//   );
// };

const NavContainer = styled.div<{
  border: string | undefined;
}>`
  position: sticky;
  height: ${navHeight};
  min-height: ${navHeight};
  width: 100%;
  top: 0;
  left: 0;

  padding: 14px 22px 14px;

  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;

  border-bottom: ${(props) => (props.border ? props.border : `none`)};
  z-index: 10;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    outline: none;
    z-index: 10;
  }

  div.centered {
    position: absolute;
    width: fit-content;
    top: 24px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
`;
