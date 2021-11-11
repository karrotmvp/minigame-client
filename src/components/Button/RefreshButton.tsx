import styled from '@emotion/styled';
import RefreshIconUrl from 'assets/svg/refresh_icon.svg';

interface RefreshButtonProps {
  handleRefresh: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = (props) => {
  return (
    <Button onClick={props.handleRefresh}>
      <img src={RefreshIconUrl} alt="" />
    </Button>
  );
};

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
