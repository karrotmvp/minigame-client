import Mini from '@karrotmarket/mini';

// Only one Mini can exist per project -> Used Singleton pattern
let mini: Mini;
export const getMini = () => {
  if (mini) {
    return mini;
  } else {
    return (mini = new Mini());
  }
};
