import { getMini } from 'api/mini';
import IconClose from 'assets/IconClose';

const AppEjectionButton = () => {
  const mini = getMini();
  const handleAppEjection = () => {
    mini.close();
    console.log('Ejected from the app. Now back to Karrot Market');
  };
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a aria-label="Eject" onClick={handleAppEjection}>
      <IconClose />
    </a>
  );
};

export { AppEjectionButton };
