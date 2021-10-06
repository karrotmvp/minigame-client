import { ScreenHelmet } from '@karrotframe/navigator';
import { AppEjectionButton } from 'components/AppEjectionButton';
import Button from 'components/Button';
import GameEndModal from 'components/GameEndModal';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router';
import { increase } from 'reducers/counterReducer';
import ClickerGame from '../components/ClickerGame';
import { RootState } from '../reducers/rootReducer';

const Game = () => {
  const history = useHistory();

  const handleGameEnd = () => {
    history.push('/game/modal');
  };
  const handleCloseModal = () => {
    history.goBack();
  };
  // Get state of redux store using useSelector
  const { score } = useSelector((state: RootState) => ({
    score: state.counterReducer.score,
  }));

  // useDispatch to dispatch actions
  const dispatch = useDispatch();
  const onIncrease = () => dispatch(increase());

  return (
    <div>
      <ScreenHelmet title="당근키우기" appendRight={<AppEjectionButton />} />
      <div style={{ display: `flex`, justifyContent: `center` }}>
        <ClickerGame score={score} onIncrease={onIncrease} />
        <Button
          size={`large`}
          color={`primary`}
          position={`bottom`}
          text={`게임끝`}
          onClick={handleGameEnd}
        />
      </div>

      <Route path="/game/modal">
        <GameEndModal handleCloseModal={handleCloseModal} score={score} />
      </Route>
    </div>
  );
};

export default Game;
