import IconClose from 'assets/IconClose';

const AppEjectionButton = () => {
  const handleAppEjection = () => {
    console.log('Ejected from the app. Now back to Karrot Market');
  };
  return (
    <a aria-label="Close" onClick={handleAppEjection}>
      <IconClose />
    </a>
  );
};

export { AppEjectionButton };
