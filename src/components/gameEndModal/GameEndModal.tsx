import { useNavigator } from '@karrotframe/navigator';
import TopUserGameEndModal from './TopUserGameEndModal';
import DefaultGameEndModal from './DefaultGameEndModal';

interface GameEndModalProps {
  handleCloseModal: () => void;
  currentRank: number;
  score: number;
  topUserText: string;
  handleTopUserText: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const GameEndModal = ({
  handleCloseModal,
  currentRank,
  score,
  topUserText,
  handleTopUserText,
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
          topUserText={topUserText}
          handleTopUserText={handleTopUserText}
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
