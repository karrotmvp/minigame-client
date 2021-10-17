/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DefaultGameEndModal from 'components/modals/DefaultGameEndModal';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementClickCount } from 'reducers/counterReducer';
import { RootState } from '../reducers/rootReducer';
import background from 'assets/Seocho_background.png';
import { ReactComponent as BigKarrot } from 'assets/Seocho_daangn.svg';
import Modal from 'react-modal';
import GameDirectionPopupModal from 'components/modals/GameDirectionPopupModal';
import { commafy } from 'components/functions/commafy';
import ClickAnimation from 'components/game/ClickAnimation';
import BackendApi from 'services/backendApi/backendApi';

// nav
const customNav = css`
  left: 0;
  width: 100%;
  top: 0;
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  width: 100%;
  height: 44px;
  padding: 0 0.5rem;
  background: rgb(249, 244, 245);
`;
const customNavIcon = css`
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
const gameEndButtonStyle = css`
  padding: 6px 13px;

  background: #ffffff;
  border-radius: 10px;
  border: none;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 161.7%;
  /* identical to box height, or 23px */

  color: #cc6023;
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
const clickCountStyle = css`
  margin-top: 10%;
  font-style: normal;
  font-weight: bold;
  font-size: 50px;

  color: #85370c;
`;
// game end modal
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
// pop-up modal
const popupModalStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  transform: translateY(-50%);
  width: fit-content;
  max-width: 400px;
  display: flex;
  flex-flow: column;
  gap: 26px;
  align-items: center;
  background: rgba(80, 80, 80, 0.5);

  padding: 55px 20px 25px;
  border-radius: 21px;
`;
// big karrot animation
const fullScreenClickable = css`
  // height: 100%;
  position: absolute;
  height: calc(100% - 2.75rem);
  width: 100vw;
  overflow: hidden;
`;
const shakeRight = css`
  transform: rotate(10deg);
`;
const shakeLeft = css`
  transform: rotate(-10deg);
`;

Modal.setAppElement(document.createElement('div'));

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

interface animationArrProps {
  posX: number;
  posY: number;
}
const Game = () => {
  const [alreadyPatchedKarrot, setAlreadyPatchedKarrot] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldPopup, setShouldPopup] = useState<boolean>(false);
  const [shakeToggle, setShakeToggle] = useState(false);
  const [animationArr, setAnimationArr] = useState<animationArrProps[]>([]);

  const dispatch = useDispatch();

  const { userScore } = useSelector((state: RootState) => ({
    userScore: state.userDataReducer.score,
  }));

  const { clickCount } = useSelector((state: RootState) => ({
    clickCount: state.counterReducer.clickCount,
  }));
  const clickCountUp = async () => dispatch(incrementClickCount());

  const handleClickAnimation = async (e: { clientX: any; clientY: any }) => {
    setAnimationArr((animationArr) => [
      ...animationArr,
      { posX: e.clientX - 25, posY: e.clientY - 50 },
    ]);
    setTimeout(() => {
      setAnimationArr((animationArr) => {
        const newArr = animationArr.slice(1);
        return newArr;
      });
    }, 1000);
  };

  const handleScreenClick = async (e: { clientX: any; clientY: any }) => {
    await handleClickAnimation(e);
    await clickCountUp();
  };
  const handleBigKarrotClick = async (e: { clientX: any; clientY: any }) => {
    await handleScreenClick(e);
    setShakeToggle((prevState) => !prevState);
  };

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const accessToken = window.localStorage.getItem('ACCESS_TOKEN');
  const handleGameEnd = useCallback(
    async (baseUrl, accessToken) => {
      let karrotToPatch = clickCount - alreadyPatchedKarrot;
      await BackendApi.patchUserScore({
        baseUrl: baseUrl,
        accessToken: accessToken,
        score: karrotToPatch,
      });
      setIsModalOpen(true);
      setAlreadyPatchedKarrot(clickCount);
    },
    [alreadyPatchedKarrot, clickCount]
  );

  function closeModal() {
    setIsModalOpen(false);
  }
  // Popup modal if user is new
  useEffect(() => {
    if (userScore === 0) {
      setShouldPopup(true);
    } else {
      setShouldPopup(false);
    }
  }, [userScore]);

  return (
    <>
      <div css={customNav}>
        <div css={customNavIcon}>
          <GameEndButton
            handleGameEnd={() => {
              handleGameEnd(baseUrl, accessToken);
            }}
          />
        </div>
      </div>
      <div
        className="wrapper"
        css={fullScreenClickable}
        onClick={handleScreenClick}
      >
        {animationArr.map((item, index) => (
          <ClickAnimation posX={item.posX} posY={item.posY} key={index} />
        ))}
      </div>
      <div css={divStyle}>
        <div css={scoreWrapper}>
          <h1 css={clickCountStyle}>{commafy(clickCount)}</h1>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '20%',
          }}
        >
          <BigKarrot
            onClick={handleBigKarrotClick}
            css={shakeToggle ? shakeLeft : shakeRight}
            style={{
              height: '25rem',
              width: 'auto',
            }}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        contentLabel="Default Game End Modal"
        css={modalStyle}
        style={{
          overlay: {
            background: 'rgba(40, 40, 40, 0.8)',
            zIndex: 100,
          },
        }}
      >
        <DefaultGameEndModal closeModal={closeModal} />
      </Modal>
      <Modal
        isOpen={shouldPopup}
        onRequestClose={() => setShouldPopup(false)}
        shouldCloseOnOverlayClick={true}
        contentLabel="Game Direction Popup Modal"
        css={popupModalStyle}
        style={{
          overlay: {
            background: `none`,
          },
        }}
      >
        <GameDirectionPopupModal setShouldPopup={setShouldPopup} />
      </Modal>
    </>
  );
};

export default Game;
