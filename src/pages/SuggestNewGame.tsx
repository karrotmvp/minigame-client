import { motion } from 'framer-motion';

type BackdropProps = {
  onClick: any;
  children: any;
};
const Backdrop: React.FC<BackdropProps> = ({ onClick, children }) => {
  return (
    <motion.div
      onClick={onClick}
      className="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
};

type Props = {
  handleClose: any;
};
export const SuggestNewGame: React.FC<Props> = ({ handleClose }) => {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal orange-gradient"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <p>test</p>
        <button onClick={handleClose}>Close</button>
      </motion.div>
    </Backdrop>
  );
};
