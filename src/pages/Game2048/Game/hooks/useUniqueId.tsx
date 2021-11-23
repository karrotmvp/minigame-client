let uniqueId = 1;

export const useUniqueId = () => {
  const nextId = () => {
    return uniqueId++;
  };

  return nextId;
};
