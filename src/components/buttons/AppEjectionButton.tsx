import IconClose from 'assets/svg/IconClose';
import { useKarrotMarketMini } from 'services/karrotMarketMini';

const AppEjectionButton = () => {
  const karrotMarketMini = useKarrotMarketMini();
  const handleAppEjection = () => {
    karrotMarketMini.close();
  };
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a aria-label="Eject" onClick={handleAppEjection}>
      <IconClose />
    </a>
  );
};

export { AppEjectionButton };
