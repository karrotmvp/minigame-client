/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ScreenHelmet } from '@karrotframe/navigator';
import DefaultGameEndModal from 'components/gameEndModal/DefaultGameEndModal';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router';
import { increase, increaseKarrotCount } from 'reducers/counterReducer';
import GameContainer from '../components/game/GameContainer';
import { RootState } from '../reducers/rootReducer';

const customNavIcon = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: opacity 300ms;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;

const scoreWrapper = css`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;

const karrotCountStyle = css`
  margin-top: 5%;
  font-style: normal;
  font-weight: bold;
  font-size: 50px;

  color: #85370c;
`;

const clickCountStyle = css`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;

  color: #bc9c8a;
`;
const gameEndButtonStyle = css`
  padding: 6px 13px;

  background: #000;
  border: none;
  border-radius: 10px;

  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #cc6023;
`;
interface GameEndButtonProps {
  handleGameEnd: () => void;
}
const GameEndButton = ({ handleGameEnd }: GameEndButtonProps) => {
  return (
    <button css={gameEndButtonStyle} onClick={handleGameEnd}>
      그만하기
    </button>
  );
};
const Game = () => {
  // navigation
  const history = useHistory();
  const handleGameEnd = () => {
    history.push('/game/modal');
  };
  const handleCloseModal = () => {
    history.goBack();
  };
  // game score
  const [count, setCount] = useState(0);
  const { clickCount, karrotCount } = useSelector((state: RootState) => ({
    clickCount: state.counterReducer.clickCount,
    karrotCount: state.counterReducer.karrotCount,
  }));
  const dispatch = useDispatch();
  const countUp = async () => dispatch(increase());
  const countUpKarrot = async () => dispatch(increaseKarrotCount());
  const handleClick = async () => {
    await countUp();
    setCount(count + 1);
    console.log(count);
    if (count >= 9) {
      await countUpKarrot();
      setCount(0);
    }
  };

  let currentRank = 7;

  return (
    <>
      <ScreenHelmet
        appendRight={
          <div css={customNavIcon}>
            <GameEndButton handleGameEnd={handleGameEnd} />
          </div>
        }
      />
      <GameContainer onClick={handleClick} />
      <div style={{ background: `#FAF5F4`, height: `100%` }}>
        <div css={scoreWrapper}>
          <h1 css={karrotCountStyle}>{karrotCount}</h1>
          <h2 css={clickCountStyle}>{clickCount}</h2>
        </div>
      </div>

      <Route path="/game/modal">
        <DefaultGameEndModal
          handleCloseModal={handleCloseModal}
          currentRank={currentRank}
          score={karrotCount}
        />
      </Route>
    </>
  );
};

export default Game;
