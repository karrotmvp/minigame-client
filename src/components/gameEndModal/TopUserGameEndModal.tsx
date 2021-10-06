  currentRank: number;
  topUserText: string;
  handleTopUserText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentRank,
  topUserText,
  handleTopUserText,
          <span css={emphasizedTextStyle}>{currentRank}위</span>로 순위권에
          <input
            type="text"
            onChange={handleTopUserText}
            value={topUserText}
            placeholder="예) 내가 송파짱!"
            maxLength={25}
          />
