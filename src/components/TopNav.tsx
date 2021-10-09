/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import IconBack from '../assets/IconBack';
import { AppEjectionButton } from './AppEjectionButton';
const customNav = css`
  left: 0;
  width: 100%;
  // height: 100%;
  top: 0;
  display: flex;
  width: 100%;
  height: 2.75rem;
  padding: 0 0.5rem;
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
  handleNavCloseAction?: () => void;
  handleNavBackAction?: () => void;
}
const TopNav = ({
  action,
  handleNavCloseAction,
  handleNavBackAction,
}: TopNavprops) => {
  return (
    <div css={customNav}>
      <div css={customNavIcon}>
        {action === `eject` ? (
          <AppEjectionButton />
        ) : action === `back` ? (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={handleNavBackAction}>
            <IconBack />
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default TopNav;
