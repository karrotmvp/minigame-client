import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import userDataReducer from './userDataReducer';
import game2048DataReducer from './game2048DataReducer';
import karrotClickerDataReducer from './karrotClickerDataReducer';
import game2048Reducer from 'pages/Game2048/Game/Game/reducers/game2048Reducer';

const rootReducer = combineReducers({
  counterReducer,
  userDataReducer,
  game2048DataReducer,
  karrotClickerDataReducer,
  //
  game2048Reducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
