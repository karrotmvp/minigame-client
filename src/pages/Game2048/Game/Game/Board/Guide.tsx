import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { boardPadding } from '../styles';
import { ReactComponent as GuideCircle } from 'assets/svg/game2048/guide_circle.svg';
const GuideMotion = styled(motion.div)<{
  cellWidth: number;
  offsetY: number;
  offsetX: number;
}>`
  width: ${(props) => props.cellWidth}px;
  height: ${(props) => props.cellWidth}px;
  position: absolute;
  top: ${(props) => props.offsetY}px;
  left: ${(props) => props.offsetX}px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  cellWidth: number;
};
export const Guide: React.FC<Props> = (props) => {
  // [y,x]
  const coordinate = [1, 3];
  const coordinateToPixels = (coordinate: number) => {
    const pixel =
      (props.cellWidth + boardPadding * 16) * coordinate + boardPadding * 16;
    return pixel;
  };
  const animateDistance = props.cellWidth * 2 + boardPadding * 16 * 2;
  return (
    <GuideMotion
      animate={{
        x: -animateDistance,
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1,
      }}
      cellWidth={props.cellWidth}
      offsetY={coordinateToPixels(coordinate[0])}
      offsetX={coordinateToPixels(coordinate[1])}
    >
      <GuideCircle />
    </GuideMotion>
  );
};
