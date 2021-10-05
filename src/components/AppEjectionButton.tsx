import { getMini } from 'api/mini';
import IconClose from 'assets/IconClose';

const AppEjectionButton = () => {
  const mini = getMini();
  const handleAppEjection = () => {
    mini.close();
    console.log('Ejected from the app. Now back to Karrot Market');
  };
  return (
    <a aria-label="Close" onClick={handleAppEjection}>
      <IconClose />
    </a>
  );
};

export { AppEjectionButton };
