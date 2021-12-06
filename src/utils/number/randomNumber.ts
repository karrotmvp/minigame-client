export const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
