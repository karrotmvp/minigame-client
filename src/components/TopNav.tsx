/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import IconBack from '../assets/IconBack';
import { AppEjectionButton } from './buttons/AppEjectionButton';
const Nav = styled.div`
  left: 0;
  width: 100%;
  top: 0;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 30px;
  background: transparent;
`;

const customNavIcon = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: opacity 300ms;
  width: 2.25rem;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;

interface TopNavprops {
  action: string;
  handleNavBackAction?: () => void;
}
const TopNav = ({ action, handleNavBackAction }: TopNavprops) => {
  return (
    <Nav>
      <div css={customNavIcon}>
        {action === `eject` ? (
          <AppEjectionButton />
        ) : action === `back` ? (
          <div onClick={handleNavBackAction}>
            <IconBack />
          </div>
        ) : null}
      </div>
    </Nav>
  );
};

export default TopNav;
