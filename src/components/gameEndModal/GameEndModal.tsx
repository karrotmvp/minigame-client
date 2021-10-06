  topUserText: string;
  handleTopUserText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  topUserText,
  handleTopUserText,
      {currentRank <= 10 ? (
        <TopUserGameEndModal
          handleCloseModal={handleCloseModal}
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
