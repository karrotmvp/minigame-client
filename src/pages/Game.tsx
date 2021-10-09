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
import background from 'assets/Seocho_background.png';
import karrot from 'assets/Seocho_daangn.png';
import BackendService from 'services/backendService';
import { updateScore } from 'reducers/userDataReducer';
import IconBack from 'assets/IconBack';
import { Link } from 'react-router-dom';
import { ReactComponent as BigKarrot } from 'assets/Seocho_daangn.svg';
// nav
const customNav = css`
  left: 0;
  width: 100%;
  // height: 100%;
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
  // flex-flow: row;
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
//

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
  // const history = useHistory();
  // game score
  const { clickCount, karrotCount } = useSelector((state: RootState) => ({
    clickCount: state.counterReducer.clickCount,
    karrotCount: state.counterReducer.karrotCount,
  }));
  const [count, setCount] = useState(0);
  const [currentRank, setCurrentRank] = useState(0);

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

  const patchCurrentScore = async ({ score }: any) => {
    try {
      const response = await BackendService.patchCurrentScore(score);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  const getCurrentuserInfo = async () => {
    try {
      const response = await BackendService.getCurrentUserInfo();
      const responseData: any = response.data[`data`];
      return responseData;
    } catch (error) {
      console.error(error);
    }
  };
  const handleGameEnd = () => {
    patchCurrentScore(karrotCount);
    dispatch(updateScore(karrotCount));

    getCurrentuserInfo().then((data) => {
      console.log(data);

      setCurrentRank(data.rank);
    });
    // history.push('/game/modal');
  };
  const handleCloseModal = () => {
    // history.goBack();
  };

  return (
    <>
      {/* <ScreenHelmet
        appendRight={
          <div css={customNavIcon}>
            <GameEndButton handleGameEnd={handleGameEnd} />
          </div>
        }
      /> */}
      <div css={customNav}>
        <div css={customNavIcon1}>
          <Link to="/returning-user">
            <IconBack />
          </Link>
        </div>
        <div css={customNavIcon2}>
          <Link to="/game/modal">
            <GameEndButton handleGameEnd={handleGameEnd} />
          </Link>
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
    </>
  );
};

export default Game;
