import { combineReducers } from 'redux';
import userDataReducer from './userDataReducer';
import game2048DataReducer from './game2048DataReducer';
import karrotClickerDataReducer from './karrotClickerDataReducer';
// import game2048Reducer from 'pages/Game2048/Game/Game/reducers/game2048Reducer';
import gameKarrotClickerReducer from '../pages/KarrotClicker/Game/reducers/gameKarrotClickerReducer';
const rootReducer = combineReducers({
  gameKarrotClickerReducer,
  userDataReducer,
  game2048DataReducer,
  karrotClickerDataReducer,
  //
  // game2048Reducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
