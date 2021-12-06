import confetti from 'canvas-confetti';
import { randomInRange } from 'utils/number';

export const fireConfetti = ({
  colors = [`#0E74FF`, `#82B6FF`, `#E3EFFF`],
}: {
  colors: string[];
}) => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  });
};

export const fireRandomDirectionConfetti = ({
  colors = [`#0E74FF`, `#82B6FF`, `#E3EFFF`],
}: {
  colors: string[];
}) => {
  confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 },
    colors,
  });
};
