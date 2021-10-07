import { useNavigator } from '@karrotframe/navigator';
import TopUserGameEndModal from './TopUserGameEndModal';
import DefaultGameEndModal from './DefaultGameEndModal';

interface GameEndModalProps {
  handleCloseModal: () => void;
  currentRank: number;
  score: number;
}
const GameEndModal = ({
  handleCloseModal,
  currentRank,
  score,
}: GameEndModalProps) => {
  const { push } = useNavigator();

  const handleViewLeaderboard = () => {
    push('/leaderboard');
  };

  return (
    <>
      {currentRank <= 10 ? (
        <TopUserGameEndModal
          handleViewLeaderboard={handleViewLeaderboard}
          // score={score}
          currentRank={currentRank}
        />
      ) : (
        <DefaultGameEndModal
          handleCloseModal={handleCloseModal}
          handleViewLeaderboard={handleViewLeaderboard}
          score={score}
        />
      )}
    </>
  );
};

export default GameEndModal;
