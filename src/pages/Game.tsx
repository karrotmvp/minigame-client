/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DefaultGameEndModal from 'components/gameEndModal/DefaultGameEndModal';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increase, increaseKarrotCount } from 'reducers/counterReducer';
import GameContainer from '../components/game/GameContainer';
import { RootState } from '../reducers/rootReducer';
import background from 'assets/Seocho_background.png';
import { updateScore } from 'reducers/userDataReducer';
import IconBack from 'assets/IconBack';
import { Link } from 'react-router-dom';
import { ReactComponent as BigKarrot } from 'assets/Seocho_daangn.svg';
import Modal from 'react-modal';
const axios = require('axios').default;

// nav
const customNav = css`
  left: 0;
  width: 100%;
  top: 0;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 0 0.5rem;
`;
const customNavIcon1 = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: opacity 300ms;
  width: 2.25rem;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;
const customNavIcon2 = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
  transition: opacity 300ms;
  width: auto;
  height: 2.75rem;
  text-decoration: none;
  outline: none;
  z-index: 10;
`;
// main div
const divStyle = css`
  background-image: url(${background});
  background-size: cover;
  height: calc(100% - 2.75rem);
  display: flex;
  flex-flow: column;
`;
const scoreWrapper = css`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;
const karrotCountStyle = css`
  margin-top: 10%;
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
// modal
const modalStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  transform: translateY(-50%);
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-flow: column;
  align-items: center;
  background: #fff;

  padding: 45px 15px 20px;
  border-radius: 21px;
`;

Modal.setAppElement('body');

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
  const [count, setCount] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);

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
    console.log('count');
    if (count >= 9) {
      await countUpKarrot();
      setCount(0);
    }
  };

  const handleGameEnd = async () => {
    await axios.patch(
      `${process.env.REACT_APP_BASE_URL}/user-rank`,
      {
        score: karrotCount,
      },
      {
        headers: {
          Authorization: process.env.REACT_APP_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    dispatch(updateScore(karrotCount));
    setIsOpen(true);
  };

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <div css={customNav}>
        <div css={customNavIcon1}>
          <Link to="/">
            <IconBack />
          </Link>
        </div>
        <div css={customNavIcon2}>
          <GameEndButton handleGameEnd={handleGameEnd} />
        </div>
      </div>

      <GameContainer onClick={handleClick} />

      <div css={divStyle} onClick={handleClick}>
        <div css={scoreWrapper}>
          <h1 css={karrotCountStyle}>{karrotCount}</h1>
          <h2 css={clickCountStyle}>{clickCount}</h2>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '2rem',
          }}
        >
          <BigKarrot
            style={{
              height: '25rem',
              width: 'auto',
            }}
          />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        contentLabel="Default Game End Modal"
        css={modalStyle}
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
          },
        }}
      >
        <DefaultGameEndModal closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default Game;
