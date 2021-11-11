import styled from '@emotion/styled';
// import { RefreshIcon } from 'assets/Icon';
import { ReactComponent as RefreshIcon } from 'assets/svg/refresh_icon.svg';
const Button = styled.button`
  border: none;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  outline: none;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    transform: scale(1.2);
    outline: none;
    box-shadow: none;
    -webkit-tap-highlight-color: transparent;
  }
`;

interface RefreshButtonProps {
  handleRefresh: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = (props) => {
  return (
    <Button onClick={props.handleRefresh}>
      <RefreshIcon />
    </Button>
  );
};
