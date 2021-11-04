import styled from '@emotion/styled';
import { useNavigator } from '@karrotframe/navigator';
import IconBack from 'assets/svg/IconBack';
import IconClose from 'assets/svg/IconClose';
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
export const AppEjectionButton = () => {
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

export const BackButton = () => {
  const { pop } = useNavigator();
  const goBackOnePage = () => {
    pop();
  };
  return (
    <Button onClick={goBackOnePage}>
      <IconBack />
    </Button>
  );
};
