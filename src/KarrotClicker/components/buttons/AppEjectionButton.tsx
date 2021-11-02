import styled from '@emotion/styled';
import IconClose from 'KarrotClicker/assets/svg/IconClose';
import { useKarrotMarketMini } from 'services/karrotMarketMini';

const Button = styled.button`
  border: none;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  outline: none;
  user-select: none;
`;
const AppEjectionButton = () => {
  const karrotMarketMini = useKarrotMarketMini();
  const handleAppEjection = () => {
    karrotMarketMini.close();
  };
  return (
    <Button onClick={handleAppEjection}>
      <IconClose />
    </Button>
  );
};

export { AppEjectionButton };
