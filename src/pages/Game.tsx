import { ScreenHelmet, useNavigator } from '@karrotframe/navigator';
import { AppEjectionButton } from 'components/AppEjectionButton';
import Button from 'components/Button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increase } from '../actions/incrementActions';
import ClickerGame from '../components/ClickerGame';
import { RootState } from '../reducers/rootReducer';

const Game = () => {
  const { push } = useNavigator();

  const handleGameEnd = () => {
    push(`/leaderboard`);
  };

  // Get state of redux store using useSelector
  const { number } = useSelector((state: RootState) => ({
    number: state.increment.number,
  }));

  // useDispatch to dispatch actions
  const dispatch = useDispatch();
  const onIncrease = () => dispatch(increase());

  return (
    <div>
      <ScreenHelmet title="당근키우기" appendRight={<AppEjectionButton />} />
      <div style={{ display: `flex`, justifyContent: `center` }}>
        <ClickerGame number={number} onIncrease={onIncrease} />
        <Button
          size={`large`}
          position={`bottom`}
          text={`게임끝`}
          onClick={handleGameEnd}
        />
      </div>
    </div>
  );
};

export default Game;
