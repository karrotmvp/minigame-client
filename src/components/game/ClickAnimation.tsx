import { ReactComponent as Karrot } from 'assets/karrot.svg';
import './clickAnimation.css';

interface ExpireProps {
  posX: number;
  posY: number;
  visible: boolean;
}
const ClickAnimation = ({ posX, posY, visible }: ExpireProps) => {
  // let b = Math.floor(Math.random() * 100 + 1);
  // let d = ['flowOne', 'flowTwo', 'flowThree'];
  // let a = ['colOne', 'colTwo', 'colThree', 'colFour', 'colFive', 'colSix'];
  // let c = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(1);
  return (
    <>
      {visible ? (
        <Karrot
          // className={`${a[Math.floor(Math.random() * 6)]}`}
          style={{
            position: 'absolute',
            left: `${posX}px`,
            top: `${posY}px`,
            // width: `${Math.floor(Math.random() * (50 - 22) + 22)}px`,
            // height: `auto`,
            // animation: `${d[0]} ${c}s linear`,
            // [Math.floor(Math.random() * 3)]
          }}
        />
      ) : null}
    </>
  );
};

export default ClickAnimation;
